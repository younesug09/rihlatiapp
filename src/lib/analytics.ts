import { supabase } from "@/integrations/supabase/client";

export type AnalyticsEvent = "page_view" | "share" | "booking_start" | "booking_complete" | "search";

/**
 * Lightweight, privacy-friendly event logging used for the academic research
 * dashboard. No IP, no device fingerprint — only event type, path and label.
 */
export async function track(event: AnalyticsEvent, path?: string, label?: string) {
  try {
    const { data } = await supabase.auth.getSession();
    await supabase.from("analytics_events").insert({
      event_type: event,
      path: path ?? (typeof window !== "undefined" ? window.location.pathname : null),
      label: label ?? null,
      user_id: data.session?.user.id ?? null,
    });
  } catch {
    // analytics must never break the UI
  }
}
