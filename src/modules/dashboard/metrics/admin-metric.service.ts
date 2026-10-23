import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Lead } from '../../../shared/entities/lead.entity';
import { Student } from '../../../shared/entities/student.entity';
import { Course } from '../../../shared/entities/course.entity';
import { Branch } from '../../../shared/entities/branch.entity';
import { Group } from '../../../shared/entities/group.entity';
import { Session } from '../../../shared/entities/session.entity';
import { Invoice } from '../../../shared/entities/invoice.entity';
import { Payment } from '../../../shared/entities/payment.entity';
import { Attendance } from '../../../shared/entities/attendance.entity';
import { GroupStudent } from '../../../shared/entities/group-student.entity';
import { User } from '../../../shared/entities/user.entity';
import { BaseMetricService } from './base-metric.service';
import { AuthUser } from '../../../common/utils/branch-scope';
import { DashboardQueryDto, KpiResult, AlertItem } from '../dashboard.dto';
import { LeadStatus } from '../../../common/enums/lead-status.enum';
import { GroupStatus } from '../../../common/enums/group-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';
import { AttendanceStatus } from '../../../common/enums/attendance-status.enum';

@Injectable()
export class AdminMetricService extends BaseMetricService {
  constructor(
    config: ConfigService,
    @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(Branch) private readonly branchRepo: Repository<Branch>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(Session) private readonly sessionRepo: Repository<Session>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Attendance) private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(GroupStudent) private readonly gsRepo: Repository<GroupStudent>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {
    super(config);
  }

  async getMetrics(user: AuthUser, dto: DashboardQueryDto) {
    const bf = this.branchFilter(user, dto.branch_id);
    const now = new Date();
    const today = this.startOfPeriod(now);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalLeads,
      prevTotalLeads,
      totalStudents,
      prevTotalStudents,
      totalGroups,
      totalCourses,
      totalBranches,
      totalSessions,
      revenueToday,
      prevRevenueToday,
      revenueMonth,
      prevRevenueMonth,
      outstandingPayments,
      groupFillRate,
      upcomingSessions,
      attendanceSummary,
      recentLeads,
      recentPayments,
    ] = await Promise.all([
      this.countLeads(bf),
      this.countLeadsPrevDay(bf),
      this.countStudents(bf),
      this.countStudentsPrevDay(bf),
      this.countGroups(bf),
      this.courseRepo.count(),
      this.branchRepo.count(),
      this.countSessions(bf),
      this.sumPayments(today, bf),
      this.sumPaymentsPrevDay(bf),
      this.sumPayments(startOfMonth, bf),
      this.sumPayments(prevMonth, bf, prevMonthEnd),
      this.sumOutstanding(bf),
      this.computeGroupFillRate(bf),
      this.getUpcomingSessions(bf, 5),
      this.getAttendanceSummary(bf),
      this.getRecentLeads(bf, 5),
      this.getRecentPayments(bf, 5),
    ]);

    const kpis: Record<string, KpiResult> = {
      total_leads: this.makeKpi(totalLeads, prevTotalLeads),
      total_students: this.makeKpi(totalStudents, prevTotalStudents),
      total_groups: { value: totalGroups, previous_value: 0, change_pct: 0 },
      total_courses: { value: totalCourses, previous_value: 0, change_pct: 0 },
      total_branches: { value: totalBranches, previous_value: 0, change_pct: 0 },
      total_sessions: { value: totalSessions, previous_value: 0, change_pct: 0 },
      revenue_today: this.makeKpi(revenueToday, prevRevenueToday),
      revenue_month: this.makeKpi(revenueMonth, prevRevenueMonth),
      outstanding_payments: { value: outstandingPayments, previous_value: 0, change_pct: 0 },
      group_fill_rate: groupFillRate,
      conversion_rate: totalLeads > 0
        ? this.makeKpi(Math.round((totalStudents / totalLeads) * 100), 0)
        : { value: 0, previous_value: 0, change_pct: 0 },
    };

    const alerts: AlertItem[] = [];
    if (outstandingPayments > 0) {
      alerts.push({
        id: 'outstanding-payments',
        title: 'Outstanding Payments',
        description: `${outstandingPayments} in unpaid invoices require attention`,
        severity: 'warning',
        link: '/finance/invoices',
        created_at: now.toISOString(),
      });
    }

    return {
      kpis,
      time_series: {},
      alerts,
      recent_items: {
        leads: recentLeads,
        payments: recentPayments,
        upcoming_sessions: upcomingSessions,
      },
      attendance_summary: attendanceSummary,
    };
  }
  private async countLeadsPrevDay(branchFilter?: string): Promise<number> {
    const yesterday = new Date(Date.now() - 86_400_000);
    return this.countLeadsFrom(yesterday, branchFilter);
  }

  private async countStudentsPrevDay(branchFilter?: string): Promise<number> {
    const yesterday = new Date(Date.now() - 86_400_000);
    return this.countStudentsFrom(yesterday, branchFilter);
  }

  private async sumPaymentsPrevDay(branchFilter?: string): Promise<number> {
    const yesterday = new Date(Date.now() - 86_400_000);
    return this.sumPaymentsFrom(yesterday, branchFilter);
  }

  private async countLeadsFrom(fromDate: Date, branchFilter?: string): Promise<number> {
    const qb = this.leadRepo.createQueryBuilder('l')
      .where('l.created_at >= :d', { d: fromDate });
    if (branchFilter) qb.andWhere('l.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countStudentsFrom(fromDate: Date, branchFilter?: string): Promise<number> {
    const qb = this.studentRepo.createQueryBuilder('s')
      .where('s.created_at >= :d', { d: fromDate });
    if (branchFilter) qb.andWhere('s.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async sumPaymentsFrom(from: Date, branchFilter?: string): Promise<number> {
    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.status = :status', { status: 'completed' })
      .andWhere('p.paid_at >= :from', { from });
    if (branchFilter) qb.innerJoin('p.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async countLeads(branchFilter?: string): Promise<number> {
    const qb = this.leadRepo.createQueryBuilder('l');
    if (branchFilter) qb.where('l.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countStudents(branchFilter?: string): Promise<number> {
    const qb = this.studentRepo.createQueryBuilder('s');
    if (branchFilter) qb.where('s.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countGroups(branchFilter?: string): Promise<number> {
    const qb = this.groupRepo.createQueryBuilder('g');
    if (branchFilter) qb.where('g.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countSessions(branchFilter?: string): Promise<number> {
    const qb = this.sessionRepo.createQueryBuilder('s')
      .leftJoin('s.group', 'g');
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async sumPayments(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.status = :status', { status: 'completed' })
      .andWhere('p.paid_at >= :from', { from });
    if (to) qb.andWhere('p.paid_at <= :to', { to });
    if (branchFilter) qb.innerJoin('p.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }
  private async sumOutstanding(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.balance_due), 0)', 'total')
      .where("i.status IN (:...statuses)", { statuses: ['UNPAID', 'PARTIAL'] });
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async computeGroupFillRate(branchFilter?: string): Promise<KpiResult> {
    const qb = this.groupRepo
      .createQueryBuilder('g')
      .select('COALESCE(SUM(g.capacity), 0)', 'capacity');
    if (branchFilter) qb.where('g.branch_id = :b', { b: branchFilter });
    const capacityRow = await qb.getRawOne();
    const capacity = Number(capacityRow?.capacity ?? 0);

    const enrolledQb = this.gsRepo.createQueryBuilder('gs')
      .select('COUNT(*)', 'enrolled')
      .where("gs.status = :status", { status: 'active' });
    if (branchFilter) {
      enrolledQb.innerJoin('gs.group', 'g').andWhere('g.branch_id = :b', { b: branchFilter });
    }
    const enrolledRow = await enrolledQb.getRawOne();
    const enrolled = Number(enrolledRow?.enrolled ?? 0);

    return this.makeKpi(capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0, 0);
  }

  private async getUpcomingSessions(branchFilter?: string, limit: number = 5) {
    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .leftJoinAndSelect('s.group', 'g')
      .where('s.date >= :d', { d: this.academyToday })
      .andWhere('s.cancelled_at IS NULL')
      .orderBy('s.date', 'ASC')
      .take(limit);
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getMany();
  }

  private async getAttendanceSummary(branchFilter?: string) {
    const qb = this.attendanceRepo
      .createQueryBuilder('a')
      .select("a.status", 'status')
      .addSelect('COUNT(a.id)', 'count')
      .groupBy('a.status');
    if (branchFilter) {
      qb.innerJoin('a.session', 's')
        .innerJoin('s.group', 'g')
        .andWhere('g.branch_id = :b', { b: branchFilter });
    }
    const rows = await qb.getRawMany();
    const summary = { present: 0, absent: 0, late: 0 };
    for (const row of rows) {
      const key = String(row.status).toLowerCase();
      if (key in summary) {
        (summary as Record<string, number>)[key] = Number(row.count);
      }
    }
    return summary;
  }

  private async getRecentLeads(branchFilter?: string, limit: number = 5) {
    const qb = this.leadRepo
      .createQueryBuilder('l')
      .orderBy('l.created_at', 'DESC')
      .take(limit);
    if (branchFilter) qb.where('l.branch_id = :b', { b: branchFilter });
    return qb.getMany();
  }

  private async getRecentPayments(branchFilter?: string, limit: number = 5) {
    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.invoice', 'i')
      .orderBy('p.paid_at', 'DESC')
      .take(limit);
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    return qb.getMany();
  }
}