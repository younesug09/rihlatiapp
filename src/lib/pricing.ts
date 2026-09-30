// Mirrors database logic (compute_booking_fees, cancel_booking).
export const CUSTOMER_FEE = 0.04;
export const AGENCY_FEE = 0.08;
export const PLATFORM_TOTAL = CUSTOMER_FEE + AGENCY_FEE;
export const LATE_AGENCY = 0.1;
export const LATE_PLATFORM = 0.05;

const r = (n: number) => Math.round(n * 100) / 100;

export function commission(base: number) {
  return {
    base: r(base),
    serviceFee: r(base * CUSTOMER_FEE),
    customerTotal: r(base * (1 + CUSTOMER_FEE)),
    agencyFee: r(base * AGENCY_FEE),
    agencyPayout: r(base * (1 - AGENCY_FEE)),
    platformRevenue: r(base * PLATFORM_TOTAL),
  };
}

export function cancellationPreview(opts: { base: number; total: number; departure: string; confirmed: boolean }) {
  const hours = (new Date(opts.departure).getTime() - Date.now()) / 3_600_000;
  const late = opts.confirmed && hours < 48;
  const agency = late ? r(opts.base * LATE_AGENCY) : 0;
  const platform = late ? r(opts.base * LATE_PLATFORM) : 0;
  const penalty = agency + platform;
  return { late, hours, agency, platform, penalty, refund: Math.max(0, r(opts.total - penalty)) };
}
