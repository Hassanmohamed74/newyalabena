import { resolvePeriod, PeriodResolver } from './period.util';

const appConfig = { get: (k: string) => (k === 'APP_TIME_ZONE' ? 'Africa/Cairo' : undefined) } as any;

describe('resolvePeriod', () => {
  it('resolves today as a day bucket', () => {
    const r = resolvePeriod('today', undefined, undefined, appConfig);
    expect(r.bucket).toBe('day');
    // Use the same timezone logic as the resolver
    const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Cairo' }).format(new Date());
    const expectedStart = new Date(todayStr + 'T00:00:00');
    const expectedEnd = new Date(todayStr + 'T23:59:59.999');
    expect(r.from.getTime()).toBe(expectedStart.getTime());
    expect(r.to.getTime()).toBe(expectedEnd.getTime());
  });

  it('resolves 7d and previousFor', () => {
    const r = resolvePeriod('7d', undefined, undefined, appConfig);
    expect(r.bucket).toBe('day');
    // Previous period should be exactly 7 days before the current period start
    expect(r.previousFrom.getTime()).toBe(r.from.getTime() - 7 * 86_400_000);
  });

  it('resolves month and previousFor', () => {
    const r = resolvePeriod('month', undefined, undefined, appConfig);
    expect(r.bucket).toBe('day');
    expect(r.previousFrom.getMonth()).toBe(r.from.getMonth() - 1);
  });

  it('resolves year and previousFor', () => {
    const r = resolvePeriod('year', undefined, undefined, appConfig);
    expect(r.bucket).toBe('month');
    expect(r.previousFrom.getFullYear()).toBe(r.from.getFullYear() - 1);
  });

  it('resolves custom period and returns non-zero duration', () => {
    const from = '2026-06-01';
    const to = '2026-06-10';
    const r = resolvePeriod('custom', from, to, appConfig);
    expect(r.bucket).toBe('day');
    expect(r.from.getTime()).toBe(new Date(from).setHours(0, 0, 0, 0));
    expect(r.to.getTime()).toBe(new Date(to).setHours(23, 59, 59, 999));
  });
});

describe('PeriodResolver', () => {
  it('uses default Africa/Cairo when APP_TIME_ZONE is unset', () => {
    const resolver = new PeriodResolver({ get: () => undefined } as any);
    const r = resolver.resolve('month');
    expect(r.from.getFullYear()).toBe(new Date().getFullYear());
  });
});