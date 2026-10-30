import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment } from '../../../shared/entities/payment.entity';
import { Invoice } from '../../../shared/entities/invoice.entity';
import { Enrollment } from '../../../shared/entities/enrollment.entity';
import { Refund } from '../../../shared/entities/refund.entity';
import { FinancialTransaction } from '../../../shared/entities/financial-transaction.entity';
import { Installment } from '../../../shared/entities/installment.entity';
import { PromoCode } from '../../../shared/entities/promo-code.entity';
import { PayrollPeriod } from '../../../shared/entities/payroll-period.entity';
import { Group } from '../../../shared/entities/group.entity';
import { Course } from '../../../shared/entities/course.entity';
import { BaseMetricService } from './base-metric.service';
import { AuthUser } from '../../../common/utils/branch-scope';
import { DashboardQueryDto, KpiResult, AlertItem, TimeSeriesPoint } from '../dashboard.dto';
import { PeriodResolver } from './period.util';
import { toMoney } from './trend.util';

@Injectable()
export class FinanceMetricService extends BaseMetricService {
  constructor(
    config: ConfigService,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(Enrollment) private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(Refund) private readonly refundRepo: Repository<Refund>,
    @InjectRepository(FinancialTransaction) private readonly ftRepo: Repository<FinancialTransaction>,
    @InjectRepository(Installment) private readonly installmentRepo: Repository<Installment>,
    @InjectRepository(PromoCode) private readonly promoRepo: Repository<PromoCode>,
    @InjectRepository(PayrollPeriod) private readonly payrollPeriodRepo: Repository<PayrollPeriod>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    private readonly periodResolver: PeriodResolver,
  ) {
    super(config);
  }
  private async sumPayments(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.paymentRepo.createQueryBuilder('p').select('COALESCE(SUM(p.amount), 0)', 'total').where('p.status = :status', { status: 'completed' }).andWhere('p.paid_at >= :from', { from });
    if (to) qb.andWhere('p.paid_at <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.innerJoin('p.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async sumInvoiced(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('COALESCE(SUM(i.total_amount), 0)', 'total').where('i.created_at >= :from', { from });
    if (to) qb.andWhere('i.created_at <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }
  private async sumOutstanding(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('COALESCE(SUM(i.balance_due), 0)', 'total').where("i.status IN (:...statuses)", { statuses: ['unpaid', 'partial', 'overdue'] });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async sumOverdue(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('COALESCE(SUM(i.balance_due), 0)', 'total').where('i.status = :status', { status: 'overdue' });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async sumRefunds(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.refundRepo.createQueryBuilder('r').select('COALESCE(SUM(r.amount), 0)', 'total').where("r.status IN (:...statuses)", { statuses: ['pending', 'approved'] }).andWhere('r.created_at >= :from', { from });
    if (to) qb.andWhere('r.created_at <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.innerJoin('r.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async countRefunds(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.refundRepo.createQueryBuilder('r').select('COUNT(r.id)', 'total').where("r.status IN (:...statuses)", { statuses: ['pending', 'approved'] }).andWhere('r.created_at >= :from', { from });
    if (to) qb.andWhere('r.created_at <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.innerJoin('r.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }
  private async sumDiscounts(from: Date, branchFilter?: string, to?: Date): Promise<number> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('COALESCE(SUM(i.discount_amount), 0)', 'total').where('i.created_at >= :from', { from });
    if (to) qb.andWhere('i.created_at <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async sumFinancialTx(from: Date, branchFilter?: string, to?: Date, direction: 'in' | 'out' = 'in'): Promise<number> {
    const qb = this.ftRepo.createQueryBuilder('ft').select('COALESCE(SUM(ft.amount), 0)', 'total').where('ft.transaction_date >= :from', { from }).andWhere('ft.direction = :dir', { dir: direction });
    if (to) qb.andWhere('ft.transaction_date <= :to', { to });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('ft.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.total ?? 0);
  }

  private async avgInvoiceValue(branchFilter?: string): Promise<number> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('COALESCE(AVG(i.total_amount), 0)', 'avg');
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.avg ?? 0);
  }

  private async avgDaysToPay(branchFilter?: string): Promise<number> {
    const qb = this.paymentRepo.createQueryBuilder('p').innerJoin('p.invoice', 'i').select('COALESCE(AVG(EXTRACT(EPOCH FROM (p.paid_at - i.created_at)) / 86400), 0)', 'avg').where('p.status = :status', { status: 'completed' });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const row = await qb.getRawOne();
    return Number(row?.avg ?? 0);
  }
  private async revenueTrend(branchFilter?: string, period: any = { from: new Date(), to: new Date() }): Promise<TimeSeriesPoint[]> {
    const qb = this.paymentRepo.createQueryBuilder('p').select("TO_CHAR(p.paid_at, 'YYYY-MM-DD')", 'date').addSelect('COALESCE(SUM(p.amount), 0)', 'value').where('p.status = :status', { status: 'completed' }).andWhere('p.paid_at >= :from', { from: period.from }).andWhere('p.paid_at <= :to', { to: period.to }).groupBy("TO_CHAR(p.paid_at, 'YYYY-MM-DD')").orderBy('date', 'ASC');
    if (branchFilter && branchFilter !== '__none__') qb.innerJoin('p.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    const map = new Map(rows.map((r: any) => [r.date, Number(r.value)]));
    const points: TimeSeriesPoint[] = [];
    const d = new Date(period.from);
    while (d <= period.to) {
      const key = d.toISOString().slice(0, 10);
      points.push({ date: key, value: map.get(key) ?? 0 });
      d.setDate(d.getDate() + 1);
    }
    return points;
  }

  private async revenueByPaymentMethod(branchFilter?: string, period: any = { from: new Date(), to: new Date() }): Promise<{ label: string; value: number }[]> {
    const qb = this.paymentRepo.createQueryBuilder('p').select('p.method', 'method').addSelect('COALESCE(SUM(p.amount), 0)', 'total').where('p.status = :status', { status: 'completed' }).andWhere('p.paid_at >= :from', { from: period.from }).andWhere('p.paid_at <= :to', { to: period.to }).groupBy('p.method');
    if (branchFilter && branchFilter !== '__none__') qb.innerJoin('p.invoice', 'i').andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r: any) => ({ label: String(r.method), value: Number(r.total) }));
  }

  private async incomeVsExpenses(branchFilter?: string, period: any = { from: new Date(), to: new Date() }): Promise<{ label: string; income: number; expense: number }[]> {
    const qb = this.ftRepo.createQueryBuilder('ft').select("TO_CHAR(ft.transaction_date, 'YYYY-MM')", 'month').addSelect("SUM(CASE WHEN ft.direction = 'in' THEN ft.amount ELSE 0 END)", 'income').addSelect("SUM(CASE WHEN ft.direction = 'out' THEN ft.amount ELSE 0 END)", 'expense').where('ft.transaction_date >= :from', { from: period.from }).andWhere('ft.transaction_date <= :to', { to: period.to }).groupBy("TO_CHAR(ft.transaction_date, 'YYYY-MM')").orderBy('month', 'ASC');
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('ft.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r: any) => ({ label: String(r.month), income: Number(r.income), expense: Number(r.expense) }));
  }

  private async invoicesByStatus(branchFilter?: string, period: any = { from: new Date(), to: new Date() }): Promise<{ label: string; count: number; amount: number }[]> {
    const qb = this.invoiceRepo.createQueryBuilder('i').select('i.status', 'status').addSelect('COUNT(i.id)', 'count').addSelect('COALESCE(SUM(i.total_amount), 0)', 'amount').where('i.created_at >= :from', { from: period.from }).andWhere('i.created_at <= :to', { to: period.to }).groupBy('i.status');
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r: any) => ({ label: String(r.status), count: Number(r.count), amount: Number(r.amount) }));
  }

  private async agingBuckets(branchFilter?: string): Promise<{ label: string; amount: number }[]> {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    const buckets: { label: string; min: number; max: number; amount: number }[] = [
      { label: '0-30', min: 0, max: 30, amount: 0 },
      { label: '31-60', min: 31, max: 60, amount: 0 },
      { label: '61-90', min: 61, max: 90, amount: 0 },
      { label: '90+', min: 91, max: Infinity, amount: 0 },
    ];
    const qb = this.invoiceRepo.createQueryBuilder('i').select('i.balance_due', 'balance').addSelect('i.due_date', 'due_date').where("i.status IN (:...statuses)", { statuses: ['unpaid', 'partial', 'overdue'] });
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    for (const row of rows) {
      const balance = Number(row.balance);
      if (balance <= 0) continue;
      const dueDate = row.due_date ? new Date(row.due_date) : null;
      const daysOverdue = dueDate ? Math.floor((now.getTime() - dueDate.getTime()) / dayMs) : 0;
      for (const b of buckets) {
        if (daysOverdue >= b.min && daysOverdue <= b.max) { b.amount += balance; break; }
      }
    }
    return buckets.map(b => ({ label: b.label, amount: b.amount }));
  }
  private async installmentsDue(branchFilter?: string): Promise<{ count: number; amount: number; rows: any[] }> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const qb = this.installmentRepo.createQueryBuilder('i').innerJoin('i.invoice', 'inv').where('i.status = :status', { status: 'pending' }).andWhere('i.due_date >= :now', { now }).andWhere('i.due_date <= :week', { week: weekFromNow }).orderBy('i.due_date', 'ASC').take(10);
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('inv.branch_id = :b', { b: branchFilter });
    const rows = await qb.getMany();
    const amount = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    return { count: rows.length, amount, rows };
  }

  private async topDebtors(branchFilter?: string): Promise<{ label: string; amount: number; count: number }[]> {
    const qb = this.invoiceRepo.createQueryBuilder('i').innerJoin('i.student', 's').innerJoin('s.user', 'u').select('u.id', 'id').addSelect("u.first_name || ' ' || u.last_name", 'label').addSelect('COUNT(i.id)', 'count').addSelect('COALESCE(SUM(i.balance_due), 0)', 'amount').where("i.status IN (:...statuses)", { statuses: ['unpaid', 'partial', 'overdue'] }).andWhere('i.balance_due > 0').groupBy('u.id').orderBy('amount', 'DESC').take(10);
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('i.branch_id = :b', { b: branchFilter });
    const rows = await qb.getRawMany();
    return rows.map((r: any) => ({ label: String(r.label), amount: Number(r.amount), count: Number(r.count) }));
  }

  private async refundsPending(branchFilter?: string): Promise<{ count: number; amount: number; rows: any[] }> {
    const qb = this.refundRepo.createQueryBuilder('r').innerJoin('r.invoice', 'inv').innerJoin('inv.student', 'st').innerJoin('st.user', 'u').where("r.status = :status", { status: 'pending' }).orderBy('r.created_at', 'ASC').take(10);
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('inv.branch_id = :b', { b: branchFilter });
    const rows = await qb.getMany();
    const amount = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    return { count: rows.length, amount, rows };
  }

  private async failedPendingPayments(branchFilter?: string): Promise<{ count: number; amount: number; rows: any[] }> {
    const qb = this.paymentRepo.createQueryBuilder('p').innerJoin('p.invoice', 'inv').where("p.method = :method", { method: 'EASYKASH' }).where("p.status IN (:...statuses)", { statuses: ['pending', 'failed'] }).orderBy('p.paid_at', 'DESC').take(10);
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('inv.branch_id = :b', { b: branchFilter });
    const rows = await qb.getMany();
    const amount = rows.reduce((sum, r) => sum + Number(r.amount), 0);
    return { count: rows.length, amount, rows };
  }

  private async latestPayments(branchFilter?: string): Promise<any[]> {
    const qb = this.paymentRepo.createQueryBuilder('p').innerJoin('p.invoice', 'inv').innerJoin('p.recorder', 'rec').where('p.status = :status', { status: 'completed' }).orderBy('p.paid_at', 'DESC').take(10);
    if (branchFilter && branchFilter !== '__none__') qb.andWhere('inv.branch_id = :b', { b: branchFilter });
    const rows = await qb.getMany();
    return rows.map((p: any) => ({ id: p.id, amount: Number(p.amount), method: p.method, paid_at: p.paid_at, recorder: p.recorder ? `${p.recorder.first_name} ${p.recorder.last_name}` : 'Unknown' }));
  }

  async getMetrics(user: AuthUser, dto: DashboardQueryDto) {
    const bf = this.branchFilter(user, dto.branch_id);
    const period = this.periodResolver.resolve((dto.period ?? 'month') as any, dto.from, dto.to);
    const now = new Date();

    const [
      revenue, prevRevenue, invoiced, outstanding, overdue, refundsAmt, refundsCount,
      discounts, avgOrderValue, avgDaysToPay,
      revenueTrend, incomeVsExpenses, revenueByMethod, invoicesByStatus,
      agingBuckets, installmentsDue, pendingRefunds, failedPayments,
      latestPayments,
    ] = await Promise.all([
      this.sumPayments(period.from, bf, period.to),
      this.sumPayments(period.previousFrom, bf, period.previousTo),
      this.sumInvoiced(period.from, bf, period.to),
      this.sumOutstanding(bf),
      this.sumOverdue(bf),
      this.sumRefunds(period.from, bf, period.to),
      this.countRefunds(period.from, bf, period.to),
      this.sumDiscounts(period.from, bf, period.to),
      this.avgInvoiceValue(bf),
      this.avgDaysToPay(bf),
      this.revenueTrend(bf, period),
      this.incomeVsExpenses(bf, period),
      this.revenueByPaymentMethod(bf, period),
      this.invoicesByStatus(bf, period),
      this.agingBuckets(bf),
      this.installmentsDue(bf),
      this.refundsPending(bf),
      this.failedPendingPayments(bf),
      this.latestPayments(bf),
    ]);

    const totalRevenue = Number(revenue);
    const netProfit = totalRevenue - Number(refundsAmt);

    const kpis: Record<string, KpiResult> = {
      total_revenue: { value: totalRevenue, previous_value: Number(prevRevenue), change_pct: this.changePct(totalRevenue, Number(prevRevenue)) },
      net_profit: { value: netProfit, previous_value: 0, change_pct: 0 },
      total_invoiced: { value: Number(invoiced), previous_value: 0, change_pct: 0 },
      outstanding_payments: { value: Number(outstanding), previous_value: 0, change_pct: 0 },
      overdue_amount: { value: Number(overdue), previous_value: 0, change_pct: 0 },
      total_refunds: { value: Number(refundsAmt), previous_value: 0, change_pct: 0 },
      refund_count: { value: refundsCount, previous_value: 0, change_pct: 0 },
      total_discounts: { value: Number(discounts), previous_value: 0, change_pct: 0 },
      average_order_value: { value: Number(avgOrderValue), previous_value: 0, change_pct: 0 },
      avg_days_to_pay: { value: Number(avgDaysToPay), previous_value: 0, change_pct: 0 },
    };

    const alerts: AlertItem[] = [];
    if (Number(outstanding) > 0) {
      alerts.push({
        id: 'finance-outstanding',
        title: 'Outstanding Payments',
        description: `${Number(outstanding).toLocaleString()} in unpaid invoices require attention`,
        severity: 'warning',
        link: '/finance/invoices',
        created_at: now.toISOString(),
      });
    }
    if (Number(overdue) > 0) {
      alerts.push({
        id: 'finance-overdue',
        title: 'Overdue Invoices',
        description: `${Number(overdue).toLocaleString()} is overdue`,
        severity: 'critical',
        link: '/finance/invoices',
        created_at: now.toISOString(),
      });
    }
    if (refundsCount > 0) {
      alerts.push({
        id: 'finance-pending-refunds',
        title: 'Pending Refunds',
        description: `${refundsCount} refund(s) awaiting approval`,
        severity: 'info',
        link: '/finance/refunds',
        created_at: now.toISOString(),
      });
    }

    const timeSeries: Record<string, TimeSeriesPoint[]> = {
      revenue: revenueTrend,
      income: incomeVsExpenses.map((p) => ({ date: p.label, value: p.income })),
      expense: incomeVsExpenses.map((p) => ({ date: p.label, value: p.expense })),
    };

    return {
      kpis,
      time_series: timeSeries,
      alerts,
      recent_items: {
        latest_payments: latestPayments,
      },
      attendance_summary: {},
      pipeline: {
        revenue_by_method: revenueByMethod,
        invoices_by_status: invoicesByStatus,
        aging_buckets: agingBuckets,
        installments_due: installmentsDue,
        pending_refunds: pendingRefunds,
        failed_payments: failedPayments,
      },
    };
  }
}
