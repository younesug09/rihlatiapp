import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifyBooking = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("verify_booking_token", { _token: data.id });
    if (error) throw error;
    const booking = rows?.[0];
    if (!booking) return { valid: false as const };

    return {
      valid: true as const,
      bookingRef: booking.booking_ref,
      status: booking.status,
      paymentStatus: booking.payment_status,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      travelers: booking.guests,
      agency: booking.agency_name,
      destination: booking.trip_title,
    };
  });
