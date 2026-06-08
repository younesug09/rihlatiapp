import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites(new Set());
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("favorites").select("destination_id").eq("user_id", user.id);
    setFavorites(new Set((data ?? []).map((r) => r.destination_id)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggle = useCallback(async (destinationId: string) => {
    if (!user) {
      toast.error("سجّل الدخول لحفظ المفضلة");
      return;
    }
    const isFav = favorites.has(destinationId);
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("destination_id", destinationId);
      setFavorites((s) => { const n = new Set(s); n.delete(destinationId); return n; });
      toast.success("تمت الإزالة من المفضلة");
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, destination_id: destinationId });
      setFavorites((s) => new Set(s).add(destinationId));
      toast.success("تمت الإضافة للمفضلة ❤️");
    }
  }, [user, favorites]);

  return { favorites, toggle, loading, refetch: fetchFavorites };
}
