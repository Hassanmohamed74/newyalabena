import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Lead } from '../../../shared/entities/lead.entity';
import { Student } from '../../../shared/entities/student.entity';
import { BaseMetricService } from './base-metric.service';
import { AuthUser } from '../../../common/utils/branch-scope';
import { DashboardQueryDto, KpiResult, AlertItem } from '../dashboard.dto';

@Injectable()
export class SalesMetricService extends BaseMetricService {
  constructor(
    config: ConfigService,
    @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
  ) {
    super(config);
  }

  async getMetrics(user: AuthUser, dto: DashboardQueryDto) {
    const bf = this.branchFilter(user, dto.branch_id);
    const now = new Date();
    const today = this.startOfPeriod(now);
    const prevDay = new Date(Date.now() - 86_400_000);

    const [
      totalLeads,
      prevTotalLeads,
      totalStudents,
      prevTotalStudents,
      newLeadsToday,
    ] = await Promise.all([
      this.countLeads(bf),
      this.countLeadsFrom(prevDay, bf),
      this.countStudents(bf),
      this.countStudentsFrom(prevDay, bf),
      this.countLeadsFrom(today, bf),
    ]);

    const kpis: Record<string, KpiResult> = {
      total_leads: this.makeKpi(totalLeads, prevTotalLeads),
      total_students: this.makeKpi(totalStudents, prevTotalStudents),
      new_leads_today: { value: newLeadsToday, previous_value: 0, change_pct: 0 },
      conversion_rate: totalLeads > 0
        ? this.makeKpi(Math.round((totalStudents / totalLeads) * 100), 0)
        : { value: 0, previous_value: 0, change_pct: 0 },
    };

    const alerts: AlertItem[] = [];
    if (newLeadsToday === 0) {
      alerts.push({
        id: 'no-new-leads',
        title: 'No New Leads Today',
        description: 'No new leads were created today. Consider launching a campaign.',
        severity: 'info',
        link: '/leads',
        created_at: now.toISOString(),
      });
    }

    return {
      kpis,
      time_series: {},
      alerts,
      recent_items: {},
      attendance_summary: { present: 0, absent: 0, late: 0 },
    };
  }

  private async countLeads(branchFilter?: string): Promise<number> {
    const qb = this.leadRepo.createQueryBuilder('l');
    if (branchFilter) qb.where('l.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countLeadsFrom(fromDate: Date, branchFilter?: string): Promise<number> {
    const qb = this.leadRepo.createQueryBuilder('l')
      .where('l.created_at >= :d', { d: fromDate });
    if (branchFilter) qb.andWhere('l.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countStudents(branchFilter?: string): Promise<number> {
    const qb = this.studentRepo.createQueryBuilder('s');
    if (branchFilter) qb.where('s.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }

  private async countStudentsFrom(fromDate: Date, branchFilter?: string): Promise<number> {
    const qb = this.studentRepo.createQueryBuilder('s')
      .where('s.created_at >= :d', { d: fromDate });
    if (branchFilter) qb.andWhere('s.branch_id = :b', { b: branchFilter });
    return qb.getCount();
  }
}