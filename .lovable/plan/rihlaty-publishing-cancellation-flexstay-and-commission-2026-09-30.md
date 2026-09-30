# Rihlaty: publishing, cancellation, FlexStay and commission

All changes are additive. No existing table, column, function or page is removed.

## 1. Trip publishing and booking requests
- Published agency trips appear on the Discover page (a "trips available now" section plus per-destination lists that already exist).
- The booking form for a trip asks for number of seats and traveler details (name, phone, notes), then sends a request with status "pending".
- The agency gets a notification (already wired) and accepts or rejects. Acceptance keeps the existing seat check and unlocks the verified QR voucher for the traveler.

## 2. Cancellation and refund (48h rule)
- Travelers get a "Cancel booking" button in My Bookings with a preview of the refund before confirming.
- More than 48h before departure: 100% refund.
- Less than 48h: 15% penalty on the trip price. 10% goes to the agency, 5% stays with the platform. The rest is refunded.
- Seats are released back to the trip. Agency and traveler are notified. Refunds are recorded as amounts (no real money moves; online payment is still "coming soon").

## 3. FlexStay incentive
- Agency or admin can send a "FlexStay offer" on a confirmed booking when dates are overbooked.
- Traveler receives a notification and a card in My Bookings: shift the stay by +1 day?
- If accepted: dates move +1 day, and the traveler gets a 20% voucher code for the next trip, a free upgrade/breakfast note on the voucher, and a VIP badge on their digital passport.
- If declined: nothing changes.

## 4. Commission engine (12%)
- Checkout shows: trip price, customer service fee 4%, total paid (10,000 → 10,400 DZD).
- Agency payout = price minus 8% (9,200 DZD). Platform revenue = 12% (1,200 DZD).
- Agency dashboard: new "Payouts" section (gross, 8% fee, net payout, cancellation compensation).
- Admin dashboard: "Platform earnings" (customer fees, agency fees, cancellation fees, total, per month).

## Technical details
- Migration adds nullable/defaulted columns to bookings: base_price, service_fee, agency_fee, platform_revenue, agency_payout, cancelled_at, cancellation_reason, refund_amount, penalty_amount, agency_compensation, platform_penalty_fee, flexstay_status, traveler_name, traveler_phone.
- New tables: flexstay_offers, discount_vouchers, user_badges (with GRANTs + RLS).
- Security-definer functions: compute fees on insert (trigger, so the client cannot tamper), cancel_booking(id, reason), offer_flexstay(id), respond_flexstay(id, accept). Seat release and notifications happen inside them; audit_logs entries added.
- Shared `src/lib/pricing.ts` for display math (4/8/12, 48h rule) matching the database.
- UI edits: booking page, profile bookings, agency bookings + dashboard, admin dashboard, passport badge, discover index; labels in ar/fr/en.
