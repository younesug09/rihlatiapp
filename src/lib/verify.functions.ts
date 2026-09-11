import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const verifyBooking = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(4).max(64) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("booking_ref, status, check_in, check_out, guests, agency_id, trip_id")
      .or(`booking_ref.eq.${data.id}`)
      .maybeSingle();

    if (!booking) return { valid: false as const };

    let agencyName: string | null = null;
    let destination: string | null = null;

    if (booking.agency_id) {
      const { data: a } = await supabaseAdmin
        .from("agencies")
        .select("name")
        .eq("id", booking.agency_id)
        .maybeSingle();
      agencyName = a?.name ?? null;
    }
    if (booking.trip_id) {
      const { data: tr } = await supabaseAdmin
        .from("trips")
        .select("destination, title")
        .eq("id", booking.trip_id)
        .maybeSingle();
      destination = tr?.destination ?? tr?.title ?? null;
    }

    return {
      valid: booking.status === "confirmed" || booking.status === "completed",
      bookingRef: booking.booking_ref,
      status: booking.status,
      checkIn: booking.check_in,
      checkOut: booking.check_out,
      travelers: booking.guests,
      agency: agencyName,
      destination,
    };
  });
