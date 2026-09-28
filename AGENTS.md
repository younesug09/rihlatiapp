# Project decisions

- Keep `/wilayas` as a backward-compatible legacy discovery path while new discovery UX lives at `/discover`; this prevents existing links and saved URLs from breaking.
- Booking approval, seat allocation, payment-state changes, and role-sensitive user operations must run through protected database or server functions; this prevents client-side privilege escalation and overbooking.
- Keep dashboard navigation role-specific while reusing one responsive RTL dashboard shell; this preserves consistent mobile and desktop behavior.