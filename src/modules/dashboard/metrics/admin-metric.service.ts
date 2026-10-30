import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
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
import { Employee } from '../../../shared/entities/employee.entity';
import { LeaveRequest } from '../../../shared/entities/leave-request.entity';
import { PayrollEntry } from '../../../shared/entities/payroll-entry.entity';
import { PayrollPeriod } from '../../../shared/entities/payroll-period.entity';
import { Activity } from '../../../shared/entities/activity.entity';
import { ActivityRegistration } from '../../../shared/entities/activity-registration.entity';
import { Certificate } from '../../../shared/entities/certificate.entity';
import { CertificateTemplate } from '../../../shared/entities/certificate-template.entity';
import { LmsModule } from '../../../shared/entities/lms-module.entity';
import { LmsLesson } from '../../../shared/entities/lms-lesson.entity';
import { Assignment } from '../../../shared/entities/assignment.entity';
import { Submission } from '../../../shared/entities/submission.entity';
import { Quiz } from '../../../shared/entities/quiz.entity';
import { QuizAttempt } from '../../../shared/entities/quiz-attempt.entity';
import { InventoryItem } from '../../../shared/entities/inventory-item.entity';
import { StockLevel } from '../../../shared/entities/stock-level.entity';
import { StockMove } from '../../../shared/entities/stock-move.entity';
import { BaseMetricService } from './base-metric.service';
import { AuthUser } from '../../../common/utils/branch-scope';
import { DashboardQueryDto, KpiResult, AlertItem, TimeSeriesPoint } from '../dashboard.dto';
import { LeadStatus } from '../../../common/enums/lead-status.enum';
import { GroupStatus } from '../../../common/enums/group-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';
import { AttendanceStatus } from '../../../common/enums/attendance-status.enum';
import { EmployeeStatus } from '../../../common/enums/employee-status.enum';
import { LeaveStatus } from '../../../common/enums/leave-status.enum';
import { PayrollStatus } from '../../../common/enums/payroll-status.enum';
import { ActivityStatus } from '../../../common/enums/activity-status.enum';
import { CertStatus } from '../../../common/enums/cert-status.enum';
import { SubmissionStatus } from '../../../common/enums/submission-status.enum';
import { AttemptStatus } from '../../../common/enums/attempt-status.enum';
import { InventoryStatus } from '../../../common/enums/inventory-status.enum';
import { StockMoveType } from '../../../common/enums/stock-move-type.enum';

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
    @InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(LeaveRequest) private readonly leaveRepo: Repository<LeaveRequest>,
    @InjectRepository(PayrollEntry) private readonly payrollEntryRepo: Repository<PayrollEntry>,
    @InjectRepository(PayrollPeriod) private readonly payrollPeriodRepo: Repository<PayrollPeriod>,
    @InjectRepository(Activity) private readonly activityRepo: Repository<Activity>,
    @InjectRepository(ActivityRegistration) private readonly activityRegRepo: Repository<ActivityRegistration>,
    @InjectRepository(Certificate) private readonly certificateRepo: Repository<Certificate>,
    @InjectRepository(CertificateTemplate) private readonly certTemplateRepo: Repository<CertificateTemplate>,
    @InjectRepository(LmsModule) private readonly lmsModuleRepo: Repository<LmsModule>,
    @InjectRepository(LmsLesson) private readonly lmsLessonRepo: Repository<LmsLesson>,
    @InjectRepository(Assignment) private readonly assignmentRepo: Repository<Assignment>,
    @InjectRepository(Submission) private readonly submissionRepo: Repository<Submission>,
    @InjectRepository(Quiz) private readonly quizRepo: Repository<Quiz>,
    @InjectRepository(QuizAttempt) private readonly quizAttemptRepo: Repository<QuizAttempt>,
    @InjectRepository(InventoryItem) private readonly inventoryRepo: Repository<InventoryItem>,
    @InjectRepository(StockLevel) private readonly stockLevelRepo: Repository<StockLevel>,
    @InjectRepository(StockMove) private readonly stockMoveRepo: Repository<StockMove>,
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
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfYear = new Date(now.getFullYear(), 0, 1);

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
      // Additional metrics
      leadsByStatus,
      studentsByLevel,
      studentsByStatus,
      groupsByStatus,
      groupsByMode,
      sessionsByMode,
      pendingEnrollments,
      newLeadsToday,
      newStudentsToday,
      revenueYear,
      averageOrderValue,
      paymentMethodBreakdown,
      overdueInvoices,
      overdueStudentsCount,
      absenceAlertsCount,
      activeEmployees,
      pendingLeaves,
      activePayrollPeriods,
      totalPayrollMonth,
      upcomingActivities,
      activityRegistrations,
      totalActivities,
      issuedCertificates,
      pendingCertificates,
      revokedCertificates,
      totalTemplates,
      totalLmsModules,
      totalLmsLessons,
      totalAssignments,
      pendingSubmissions,
      gradedSubmissions,
      totalQuizzes,
      completedQuizAttempts,
      averageQuizScore,
      lowStockItemsCount,
      inventoryValuation,
      stockMovementsMonth,
      // Time series
      revenueTimeSeries,
      leadsTimeSeries,
      enrollmentTimeSeries,
      sessionTimeSeries,
      attendanceTimeSeries,
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
      this.getLeadsByStatus(bf),
      this.getStudentsByLevel(bf),
      this.getStudentsByStatus(bf),
      this.getGroupsByStatus(bf),
      this.getGroupsByMode(bf),
      this.getSessionsByMode(bf),
      this.getPendingEnrollments(bf),
      this.countLeadsFrom(today, bf),
      this.countStudentsFrom(today, bf),
      this.sumPayments(startOfYear, bf),
      this.getAverageOrderValue(bf),
      this.getPaymentMethodBreakdown(bf),
      this.getOverdueInvoices(bf),
      this.getOverdueStudentsCount(bf),
      this.getAbsenceAlertsCount(bf),
      this.getActiveEmployees(bf),
      this.getPendingLeaves(bf),
      this.getActivePayrollPeriods(),
      this.getTotalPayrollMonth(bf),
      this.getUpcomingActivities(bf),
      this.getActivityRegistrations(bf),
      this.getTotalActivities(bf),
      this.getIssuedCertificates(bf),
      this.getPendingCertificates(bf),
      this.getRevokedCertificates(bf),
      this.getTotalTemplates(),
      this.getTotalLmsModules(bf),
      this.getTotalLmsLessons(),
      this.getTotalAssignments(bf),
      this.getPendingSubmissions(bf),
      this.getGradedSubmissions(bf),
      this.getTotalQuizzes(bf),
      this.getCompletedQuizAttempts(bf),
      this.getAverageQuizScore(bf),
      this.getLowStockItemsCount(bf),
      this.getInventoryValuation(bf),
      this.getStockMovementsMonth(bf),
      this.getRevenueTimeSeries(bf, startOfMonth),
      this.getLeadsTimeSeries(bf, startOfMonth),
      this.getEnrollmentTimeSeries(bf, startOfMonth),
      this.getSessionTimeSeries(bf, startOfMonth),
      this.getAttendanceTimeSeries(bf, startOfMonth),
    ]);

    const kpis: Record<string, KpiResult> = {
      // Core metrics
      total_leads: this.makeKpi(totalLeads, prevTotalLeads),
      total_students: this.makeKpi(totalStudents, prevTotalStudents),
      total_groups: { value: totalGroups, previous_value: 0, change_pct: 0 },
      total_courses: { value: totalCourses, previous_value: 0, change_pct: 0 },
      total_branches: { value: totalBranches, previous_value: 0, change_pct: 0 },
      total_sessions: { value: totalSessions, previous_value: 0, change_pct: 0 },
      revenue_today: this.makeKpi(revenueToday, prevRevenueToday),
      revenue_month: this.makeKpi(revenueMonth, prevRevenueMonth),
      revenue_year: { value: revenueYear, previous_value: 0, change_pct: 0 },
      outstanding_payments: { value: outstandingPayments, previous_value: 0, change_pct: 0 },
      group_fill_rate: groupFillRate,
      conversion_rate: totalLeads > 0
        ? this.makeKpi(Math.round((totalStudents / totalLeads) * 100), 0)
        : { value: 0, previous_value: 0, change_pct: 0 },

      // Lead pipeline KPIs
      new_leads_today: { value: newLeadsToday, previous_value: 0, change_pct: 0 },
      pending_enrollments: { value: pendingEnrollments, previous_value: 0, change_pct: 0 },

      // Student KPIs
      new_students_today: { value: newStudentsToday, previous_value: 0, change_pct: 0 },
      average_order_value: this.makeKpi(averageOrderValue, 0),
      overdue_students: { value: overdueStudentsCount, previous_value: 0, change_pct: 0 },
      absence_alerts: { value: absenceAlertsCount, previous_value: 0, change_pct: 0 },

      // Finance KPIs
      overdue_invoices_count: { value: overdueInvoices, previous_value: 0, change_pct: 0 },

      // HR KPIs
      active_employees: { value: activeEmployees, previous_value: 0, change_pct: 0 },
      pending_leave_requests: { value: pendingLeaves, previous_value: 0, change_pct: 0 },
      payroll_month_total: { value: totalPayrollMonth, previous_value: 0, change_pct: 0 },

      // Activities KPIs
      total_activities: { value: totalActivities, previous_value: 0, change_pct: 0 },
      upcoming_activities: { value: upcomingActivities, previous_value: 0, change_pct: 0 },
      activity_registrations: { value: activityRegistrations, previous_value: 0, change_pct: 0 },

      // Certificates KPIs
      certificates_issued: { value: issuedCertificates, previous_value: 0, change_pct: 0 },
      certificates_pending: { value: pendingCertificates, previous_value: 0, change_pct: 0 },
      certificates_revoked: { value: revokedCertificates, previous_value: 0, change_pct: 0 },
      certificate_templates: { value: totalTemplates, previous_value: 0, change_pct: 0 },

      // LMS KPIs
      lms_modules: { value: totalLmsModules, previous_value: 0, change_pct: 0 },
      lms_lessons: { value: totalLmsLessons, previous_value: 0, change_pct: 0 },
      lms_assignments: { value: totalAssignments, previous_value: 0, change_pct: 0 },
      lms_quizzes: { value: totalQuizzes, previous_value: 0, change_pct: 0 },
      lms_pending_submissions: { value: pendingSubmissions, previous_value: 0, change_pct: 0 },
      lms_graded_submissions: { value: gradedSubmissions, previous_value: 0, change_pct: 0 },
      lms_completed_attempts: { value: completedQuizAttempts, previous_value: 0, change_pct: 0 },
      lms_average_score: { value: averageQuizScore, previous_value: 0, change_pct: 0 },

      // Inventory KPIs
      inventory_low_stock: { value: lowStockItemsCount, previous_value: 0, change_pct: 0 },
      inventory_valuation: { value: inventoryValuation, previous_value: 0, change_pct: 0 },
      inventory_movements_month: { value: stockMovementsMonth, previous_value: 0, change_pct: 0 },
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
    if (overdueStudentsCount > 0) {
      alerts.push({
        id: 'overdue-students',
        title: 'Students with Overdue Payments',
        description: `${overdueStudentsCount} students have overdue invoices`,
        severity: 'warning',
        link: '/finance/receivables',
        created_at: now.toISOString(),
      });
    }
    if (absenceAlertsCount > 0) {
      alerts.push({
        id: 'absence-alerts',
        title: 'Absence Alerts',
        description: `${absenceAlertsCount} students have 3+ absences`,
        severity: 'warning',
        link: '/attendance/reports',
        created_at: now.toISOString(),
      });
    }
    if (pendingLeaves > 0) {
      alerts.push({
        id: 'pending-leaves',
        title: 'Pending Leave Requests',
        description: `${pendingLeaves} employee leave requests need approval`,
        severity: 'info',
        link: '/hr/leaves',
        created_at: now.toISOString(),
      });
    }
    if (lowStockItemsCount > 0) {
      alerts.push({
        id: 'low-stock',
        title: 'Low Stock Items',
        description: `${lowStockItemsCount} inventory items are at or below reorder level`,
        severity: 'warning',
        link: '/inventory/items',
        created_at: now.toISOString(),
      });
    }
    if (pendingCertificates > 0) {
      alerts.push({
        id: 'pending-certificates',
        title: 'Certificates Ready for Issue',
        description: `${pendingCertificates} students meet certificate issuance criteria`,
        severity: 'info',
        link: '/certificates/auto-issue',
        created_at: now.toISOString(),
      });
    }
    if (pendingSubmissions > 0) {
      alerts.push({
        id: 'pending-submissions',
        title: 'Submissions Pending Grading',
        description: `${pendingSubmissions} assignments need teacher grading`,
        severity: 'info',
        link: '/lms/gradebook',
        created_at: now.toISOString(),
      });
    }

    const timeSeries: Record<string, TimeSeriesPoint[]> = {
      revenue: revenueTimeSeries,
      leads: leadsTimeSeries,
      enrollments: enrollmentTimeSeries,
      sessions: sessionTimeSeries,
      attendance: attendanceTimeSeries,
    };

    const recentItems: Record<string, any[]> = {
      leads: recentLeads,
      payments: recentPayments,
      upcoming_sessions: upcomingSessions,
    };

    return {
      kpis,
      time_series: timeSeries,
      alerts,
      recent_items: recentItems,
      attendance_summary: attendanceSummary,
      pipeline: {
        leads_by_status: leadsByStatus,
        students_by_level: studentsByLevel,
        students_by_status: studentsByStatus,
        groups_by_status: groupsByStatus,
        groups_by_mode: groupsByMode,
        sessions_by_mode: sessionsByMode,
        payment_methods: paymentMethodBreakdown,
      },
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
      .where("i.status IN (:...statuses)", { statuses: ['unpaid', 'partial'] });
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

  // ═════════════════════════════════════════════════════════════════════════════
  // PIPELINE & BREAKDOWN METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getLeadsByStatus(branchFilter?: string) {
    const qb = this.leadRepo
      .createQueryBuilder('l')
      .select('l.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('l.status');
    if (branchFilter) qb.andWhere('l.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getStudentsByLevel(branchFilter?: string) {
    const qb = this.studentRepo
      .createQueryBuilder('s')
      .select('s.current_level', 'level')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.current_level');
    if (branchFilter) qb.andWhere('s.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getStudentsByStatus(branchFilter?: string) {
    const qb = this.studentRepo
      .createQueryBuilder('s')
      .select('s.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.status');
    if (branchFilter) qb.andWhere('s.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getGroupsByStatus(branchFilter?: string) {
    const qb = this.groupRepo
      .createQueryBuilder('g')
      .select('g.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('g.status');
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getGroupsByMode(branchFilter?: string) {
    const qb = this.groupRepo
      .createQueryBuilder('g')
      .select('g.mode', 'mode')
      .addSelect('COUNT(*)', 'count')
      .groupBy('g.mode');
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getSessionsByMode(branchFilter?: string) {
    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .select('s.mode', 'mode')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.mode')
      .leftJoin('s.group', 'g');
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getPendingEnrollments(branchFilter?: string) {
    const qb = this.enrollmentsRepo()
      .createQueryBuilder('e')
      .where("e.status = :status", { status: 'pending' });
    if (branchFilter) qb.innerJoin('e.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getAverageOrderValue(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo
      .createQueryBuilder('i')
      .select('AVG(i.total_amount)', 'avg')
      .where("i.status = :status", { status: 'PAID' });
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.avg ?? 0);
  }

  private async getPaymentMethodBreakdown(branchFilter?: string) {
    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .select('p.method', 'method')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.status = :status', { status: 'completed' })
      .groupBy('p.method')
      .leftJoin('p.invoice', 'i');
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    return qb.getRawMany();
  }

  private async getOverdueInvoices(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo
      .createQueryBuilder('i')
      .select('COUNT(*)', 'count')
      .where("i.status = :status", { status: 'OVERDUE' });
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.count ?? 0);
  }

  private async getOverdueStudentsCount(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo
      .createQueryBuilder('i')
      .select('COUNT(DISTINCT i.student_id)', 'count')
      .where("i.status = :status", { status: 'OVERDUE' });
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.count ?? 0);
  }

  private async getAbsenceAlertsCount(branchFilter?: string): Promise<number> {
    const threshold = 3;
    const qb = this.attendanceRepo
      .createQueryBuilder('a')
      .select('a.student_id', 'student_id')
      .addSelect('COUNT(*)', 'absences')
      .where("a.status = :status", { status: 'absent' })
      .groupBy('a.student_id')
      .having('COUNT(*) >= :threshold', { threshold });
    if (branchFilter) {
      qb.innerJoin('a.session', 's')
        .innerJoin('s.group', 'g')
        .andWhere('g.branch_id = :b', { b: branchFilter });
    }
    const rows = await qb.getRawMany();
    return rows.length;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // HR METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getActiveEmployees(branchFilter?: string): Promise<number> {
    const qb = this.employeeRepo
      .createQueryBuilder('e')
      .where("e.status = :status", { status: EmployeeStatus.ACTIVE });
    if (branchFilter) {
      qb.innerJoin('e.user', 'u').andWhere('u.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getPendingLeaves(branchFilter?: string): Promise<number> {
    const qb = this.leaveRepo
      .createQueryBuilder('l')
      .where("l.status = :status", { status: LeaveStatus.PENDING });
    if (branchFilter) {
      qb.innerJoin('l.employee', 'emp')
        .innerJoin('emp.user', 'u')
        .andWhere('u.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getActivePayrollPeriods(): Promise<number> {
    return this.payrollPeriodRepo.count({
      where: { status: PayrollStatus.OPEN },
    });
  }

  private async getTotalPayrollMonth(branchFilter?: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const qb = this.payrollEntryRepo
      .createQueryBuilder('pe')
      .select('COALESCE(SUM(pe.total_amount), 0)', 'total')
      .innerJoin('pe.payroll_period', 'pp')
      .where('pp.start_date >= :from', { from: startOfMonth })
      .andWhere("pp.status = :status", { status: 'closed' });
    if (branchFilter) {
      qb.innerJoin('pe.employee', 'emp')
        .innerJoin('emp.user', 'u')
        .andWhere('u.branch_id = :b', { b: branchFilter });
    }
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ACTIVITIES METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getUpcomingActivities(branchFilter?: string): Promise<number> {
    const now = new Date();
    const qb = this.activityRepo
      .createQueryBuilder('a')
      .where('a.date >= :today', { today: now.toISOString().slice(0, 10) })
      .andWhere("a.status = :status", { status: ActivityStatus.UPCOMING });
    if (branchFilter) qb.andWhere('a.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getActivityRegistrations(branchFilter?: string): Promise<number> {
    const qb = this.activityRegRepo.createQueryBuilder('r');
    if (branchFilter) {
      qb.innerJoin('r.activity', 'a').andWhere('a.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getTotalActivities(branchFilter?: string): Promise<number> {
    const qb = this.activityRepo.createQueryBuilder('a');
    if (branchFilter) qb.andWhere('a.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // CERTIFICATE METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getIssuedCertificates(branchFilter?: string): Promise<number> {
    const qb = this.certificateRepo
      .createQueryBuilder('c')
      .where("c.status = :status", { status: CertStatus.ACTIVE });
    if (branchFilter) qb.innerJoin('c.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getPendingCertificates(branchFilter?: string): Promise<number> {
    const qb = this.certificateRepo
      .createQueryBuilder('c')
      .where("c.status = :status", { status: 'pending' });
    if (branchFilter) qb.innerJoin('c.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getRevokedCertificates(branchFilter?: string): Promise<number> {
    const qb = this.certificateRepo
      .createQueryBuilder('c')
      .where("c.status = :status", { status: 'revoked' });
    if (branchFilter) qb.innerJoin('c.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getTotalTemplates(): Promise<number> {
    return this.certTemplateRepo.count();
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // LMS METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getTotalLmsModules(branchFilter?: string): Promise<number> {
    const qb = this.lmsModuleRepo.createQueryBuilder('m');
    if (branchFilter) qb.innerJoin('m.group', 'g').andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getTotalLmsLessons(): Promise<number> {
    return this.lmsLessonRepo.count();
  }

  private async getTotalAssignments(branchFilter?: string): Promise<number> {
    const qb = this.assignmentRepo.createQueryBuilder('a');
    if (branchFilter) qb.innerJoin('a.group', 'g').andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getPendingSubmissions(branchFilter?: string): Promise<number> {
    const qb = this.submissionRepo
      .createQueryBuilder('s')
      .where("s.status = :status", { status: SubmissionStatus.SUBMITTED });
    if (branchFilter) {
      qb.innerJoin('s.assignment', 'a')
        .innerJoin('a.group', 'g')
        .andWhere('g.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getGradedSubmissions(branchFilter?: string): Promise<number> {
    const qb = this.submissionRepo
      .createQueryBuilder('s')
      .where("s.status = :status", { status: SubmissionStatus.GRADED });
    if (branchFilter) {
      qb.innerJoin('s.assignment', 'a')
        .innerJoin('a.group', 'g')
        .andWhere('g.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getTotalQuizzes(branchFilter?: string): Promise<number> {
    const qb = this.quizRepo.createQueryBuilder('q');
    if (branchFilter) qb.innerJoin('q.group', 'g').andWhere('g.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async getCompletedQuizAttempts(branchFilter?: string): Promise<number> {
    const qb = this.quizAttemptRepo
      .createQueryBuilder('qa')
      .where("qa.status = :status", { status: AttemptStatus.GRADED });
    if (branchFilter) {
      qb.innerJoin('qa.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    }
    return qb.getCount();
  }

  private async getAverageQuizScore(branchFilter?: string): Promise<number> {
    const qb = this.quizAttemptRepo
      .createQueryBuilder('qa')
      .select('AVG(qa.percentage)', 'avg')
      .where("qa.status = :status", { status: AttemptStatus.GRADED });
    if (branchFilter) {
      qb.innerJoin('qa.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    }
    const row = await qb.getRawOne();
    return Number(row?.avg ?? 0);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // INVENTORY METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getLowStockItemsCount(branchFilter?: string): Promise<number> {
    const qb = this.stockLevelRepo
      .createQueryBuilder('sl')
      .select('COUNT(*)', 'count')
      .innerJoin('sl.item', 'i')
      .andWhere('i.status = :status', { status: InventoryStatus.ACTIVE })
      .andWhere('sl.quantity <= i.reorder_level');
    if (branchFilter) qb.andWhere('sl.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.count ?? 0);
  }

  private async getInventoryValuation(branchFilter?: string): Promise<number> {
    const qb = this.stockLevelRepo
      .createQueryBuilder('sl')
      .select('COALESCE(SUM(sl.quantity * i.unit_cost), 0)', 'total')
      .innerJoin('sl.item', 'i');
    if (branchFilter) qb.andWhere('sl.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async getStockMovementsMonth(branchFilter?: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const qb = this.stockMoveRepo
      .createQueryBuilder('sm')
      .select('COUNT(*)', 'count')
      .where('sm.created_at >= :from', { from: startOfMonth });
    if (branchFilter) qb.andWhere('sm.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.count ?? 0);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // TIME SERIES METRICS
  // ═════════════════════════════════════════════════════════════════════════════

  private async getRevenueTimeSeries(branchFilter?: string, from?: Date): Promise<TimeSeriesPoint[]> {
    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.paid_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COALESCE(SUM(p.amount), 0)', 'value')
      .where('p.status = :status', { status: 'completed' })
      .andWhere('p.paid_at >= :from', { from })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .leftJoin('p.invoice', 'i');
    if (branchFilter) qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r) => ({ date: r.date, value: Number(r.value) }));
  }

  private async getLeadsTimeSeries(branchFilter?: string, from?: Date): Promise<TimeSeriesPoint[]> {
    const qb = this.leadRepo
      .createQueryBuilder('l')
      .select("TO_CHAR(l.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'value')
      .where('l.created_at >= :from', { from })
      .groupBy('date')
      .orderBy('date', 'ASC');
    if (branchFilter) qb.andWhere('l.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r) => ({ date: r.date, value: Number(r.value) }));
  }

  private async getEnrollmentTimeSeries(branchFilter?: string, from?: Date): Promise<TimeSeriesPoint[]> {
    const qb = this.enrollmentsRepo()
      .createQueryBuilder('e')
      .select("TO_CHAR(e.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'value')
      .where("e.status = :status", { status: 'active' })
      .andWhere('e.created_at >= :from', { from })
      .groupBy('date')
      .orderBy('date', 'ASC');
    if (branchFilter) qb.innerJoin('e.student', 'st').andWhere('st.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r) => ({ date: r.date, value: Number(r.value) }));
  }

  private async getSessionTimeSeries(branchFilter?: string, from?: Date): Promise<TimeSeriesPoint[]> {
    const qb = this.sessionRepo
      .createQueryBuilder('s')
      .select("TO_CHAR(s.date, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'value')
      .where('s.date >= :from', { from })
      .andWhere('s.cancelled_at IS NULL')
      .groupBy('date')
      .orderBy('date', 'ASC')
      .leftJoin('s.group', 'g');
    if (branchFilter) qb.andWhere('g.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r) => ({ date: r.date, value: Number(r.value) }));
  }

  private async getAttendanceTimeSeries(branchFilter?: string, from?: Date): Promise<TimeSeriesPoint[]> {
    const qb = this.attendanceRepo
      .createQueryBuilder('a')
      .select("TO_CHAR(a.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'value')
      .where('a.created_at >= :from', { from })
      .groupBy('date')
      .orderBy('date', 'ASC');
    if (branchFilter) {
      qb.innerJoin('a.session', 's')
        .innerJoin('s.group', 'g')
        .andWhere('g.branch_id = :b', { b: branchFilter });
    }
    const rows = await qb.getRawMany();
    return rows.map((r) => ({ date: r.date, value: Number(r.value) }));
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═════════════════════════════════════════════════════════════════════════════

  private enrollmentsRepo() {
    return this.dataSource.getRepository('Enrollment');
  }
}