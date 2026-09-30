export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agencies: {
        Row: {
          address: string | null
          commercial_name: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string
          phone: string | null
          slug: string
          social_links: Json
          updated_at: string
          verification_notes: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
          website: string | null
          wilaya: string | null
        }
        Insert: {
          address?: string | null
          commercial_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id: string
          phone?: string | null
          slug: string
          social_links?: Json
          updated_at?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          website?: string | null
          wilaya?: string | null
        }
        Update: {
          address?: string | null
          commercial_name?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string
          phone?: string | null
          slug?: string
          social_links?: Json
          updated_at?: string
          verification_notes?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
          website?: string | null
          wilaya?: string | null
        }
        Relationships: []
      }
      agency_documents: {
        Row: {
          agency_id: string
          created_at: string
          doc_type: string
          file_url: string
          id: string
        }
        Insert: {
          agency_id: string
          created_at?: string
          doc_type: string
          file_url: string
          id?: string
        }
        Update: {
          agency_id?: string
          created_at?: string
          doc_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_documents_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          label: string | null
          path: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          label?: string | null
          path?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          label?: string | null
          path?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      bookings: {
        Row: {
          agency_compensation: number | null
          agency_fee: number | null
          agency_id: string | null
          agency_payout: number | null
          base_price: number | null
          booking_ref: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          created_at: string
          decided_at: string | null
          decision_notes: string | null
          destination_id: string | null
          flexstay_status: string | null
          guests: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          penalty_amount: number | null
          platform_penalty_fee: number | null
          platform_revenue: number | null
          refund_amount: number | null
          service_fee: number | null
          status: string
          total_price: number
          traveler_name: string | null
          traveler_phone: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
          verification_token: string
        }
        Insert: {
          agency_compensation?: number | null
          agency_fee?: number | null
          agency_id?: string | null
          agency_payout?: number | null
          base_price?: number | null
          booking_ref?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in: string
          check_out: string
          created_at?: string
          decided_at?: string | null
          decision_notes?: string | null
          destination_id?: string | null
          flexstay_status?: string | null
          guests?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          penalty_amount?: number | null
          platform_penalty_fee?: number | null
          platform_revenue?: number | null
          refund_amount?: number | null
          service_fee?: number | null
          status?: string
          total_price: number
          traveler_name?: string | null
          traveler_phone?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
          verification_token?: string
        }
        Update: {
          agency_compensation?: number | null
          agency_fee?: number | null
          agency_id?: string | null
          agency_payout?: number | null
          base_price?: number | null
          booking_ref?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          check_in?: string
          check_out?: string
          created_at?: string
          decided_at?: string | null
          decision_notes?: string | null
          destination_id?: string | null
          flexstay_status?: string | null
          guests?: number
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string
          penalty_amount?: number | null
          platform_penalty_fee?: number | null
          platform_revenue?: number | null
          refund_amount?: number | null
          service_fee?: number | null
          status?: string
          total_price?: number
          traveler_name?: string | null
          traveler_phone?: string | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
          verification_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          caption: string
          created_at: string
          id: string
          image_url: string | null
          moderation_notes: string | null
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
          user_id: string
          wilaya: string | null
        }
        Insert: {
          caption: string
          created_at?: string
          id?: string
          image_url?: string | null
          moderation_notes?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id: string
          wilaya?: string | null
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          image_url?: string | null
          moderation_notes?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id?: string
          wilaya?: string | null
        }
        Relationships: []
      }
      destinations_catalog: {
        Row: {
          activities: string[]
          best_time: string | null
          created_at: string
          gallery: string[]
          id: string
          image_url: string | null
          is_published: boolean
          latitude: number | null
          longitude: number | null
          name: string
          overview: string | null
          recommended_duration: string | null
          short_description: string | null
          tourism_type: string
          updated_at: string
          wilaya: string
        }
        Insert: {
          activities?: string[]
          best_time?: string | null
          created_at?: string
          gallery?: string[]
          id: string
          image_url?: string | null
          is_published?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          overview?: string | null
          recommended_duration?: string | null
          short_description?: string | null
          tourism_type?: string
          updated_at?: string
          wilaya: string
        }
        Update: {
          activities?: string[]
          best_time?: string | null
          created_at?: string
          gallery?: string[]
          id?: string
          image_url?: string | null
          is_published?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          overview?: string | null
          recommended_duration?: string | null
          short_description?: string | null
          tourism_type?: string
          updated_at?: string
          wilaya?: string
        }
        Relationships: []
      }
      discount_vouchers: {
        Row: {
          code: string
          created_at: string
          id: string
          percent: number
          perks: string[]
          source: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          percent?: number
          perks?: string[]
          source?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          percent?: number
          perks?: string[]
          source?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          destination_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      flexstay_offers: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          offered_by: string | null
          responded_at: string | null
          shift_days: number
          status: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          offered_by?: string | null
          responded_at?: string | null
          shift_days?: number
          status?: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          offered_by?: string | null
          responded_at?: string | null
          shift_days?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "flexstay_offers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          booking_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          body: string
          booking_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          body?: string
          booking_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_level: string | null
          created_at: string
          full_name: string | null
          id: string
          language: string
          phone: string | null
          travel_preferences: string[]
          updated_at: string
          wilaya: string | null
        }
        Insert: {
          avatar_url?: string | null
          budget_level?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          language?: string
          phone?: string | null
          travel_preferences?: string[]
          updated_at?: string
          wilaya?: string | null
        }
        Update: {
          avatar_url?: string | null
          budget_level?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          language?: string
          phone?: string | null
          travel_preferences?: string[]
          updated_at?: string
          wilaya?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          agency_id: string | null
          booking_id: string | null
          comment: string | null
          created_at: string
          destination_id: string | null
          id: string
          rating: number
          rating_accommodation: number | null
          rating_guide: number | null
          rating_organization: number | null
          rating_transport: number | null
          rating_value: number | null
          trip_id: string | null
          updated_at: string
          user_id: string
          verified_trip: boolean
        }
        Insert: {
          agency_id?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          destination_id?: string | null
          id?: string
          rating: number
          rating_accommodation?: number | null
          rating_guide?: number | null
          rating_organization?: number | null
          rating_transport?: number | null
          rating_value?: number | null
          trip_id?: string | null
          updated_at?: string
          user_id: string
          verified_trip?: boolean
        }
        Update: {
          agency_id?: string | null
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          destination_id?: string | null
          id?: string
          rating?: number
          rating_accommodation?: number | null
          rating_guide?: number | null
          rating_organization?: number | null
          rating_transport?: number | null
          rating_value?: number | null
          trip_id?: string | null
          updated_at?: string
          user_id?: string
          verified_trip?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_days: {
        Row: {
          activity: string
          created_at: string
          day_number: number
          id: string
          image_url: string | null
          location: string | null
          notes: string | null
          sort_order: number
          time_label: string | null
          trip_id: string
        }
        Insert: {
          activity: string
          created_at?: string
          day_number: number
          id?: string
          image_url?: string | null
          location?: string | null
          notes?: string | null
          sort_order?: number
          time_label?: string | null
          trip_id: string
        }
        Update: {
          activity?: string
          created_at?: string
          day_number?: number
          id?: string
          image_url?: string | null
          location?: string | null
          notes?: string | null
          sort_order?: number
          time_label?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          accommodation: string | null
          activities: string[]
          agency_id: string
          cancellation_policy: string | null
          contact: string | null
          cover_url: string | null
          created_at: string
          currency: string
          departure_date: string | null
          departure_location: string | null
          description: string | null
          destination: string
          duration_days: number
          gallery: string[]
          id: string
          included: string[]
          not_included: string[]
          price: number
          return_date: string | null
          seats: number
          seats_booked: number
          status: Database["public"]["Enums"]["trip_status"]
          title: string
          transport: string | null
          updated_at: string
        }
        Insert: {
          accommodation?: string | null
          activities?: string[]
          agency_id: string
          cancellation_policy?: string | null
          contact?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          departure_date?: string | null
          departure_location?: string | null
          description?: string | null
          destination: string
          duration_days?: number
          gallery?: string[]
          id?: string
          included?: string[]
          not_included?: string[]
          price?: number
          return_date?: string | null
          seats?: number
          seats_booked?: number
          status?: Database["public"]["Enums"]["trip_status"]
          title: string
          transport?: string | null
          updated_at?: string
        }
        Update: {
          accommodation?: string | null
          activities?: string[]
          agency_id?: string
          cancellation_policy?: string | null
          contact?: string | null
          cover_url?: string | null
          created_at?: string
          currency?: string
          departure_date?: string | null
          departure_location?: string | null
          description?: string | null
          destination?: string
          duration_days?: number
          gallery?: string[]
          id?: string
          included?: string[]
          not_included?: string[]
          price?: number
          return_date?: string | null
          seats?: number
          seats_booked?: number
          status?: Database["public"]["Enums"]["trip_status"]
          title?: string
          transport?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_booking: {
        Args: { _booking_id: string; _user_id: string }
        Returns: boolean
      }
      cancel_booking: {
        Args: { _booking_id: string; _reason?: string }
        Returns: {
          agency_compensation: number | null
          agency_fee: number | null
          agency_id: string | null
          agency_payout: number | null
          base_price: number | null
          booking_ref: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          created_at: string
          decided_at: string | null
          decision_notes: string | null
          destination_id: string | null
          flexstay_status: string | null
          guests: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          penalty_amount: number | null
          platform_penalty_fee: number | null
          platform_revenue: number | null
          refund_amount: number | null
          service_fee: number | null
          status: string
          total_price: number
          traveler_name: string | null
          traveler_phone: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
          verification_token: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decide_booking: {
        Args: { _booking_id: string; _decision: string; _notes?: string }
        Returns: {
          agency_compensation: number | null
          agency_fee: number | null
          agency_id: string | null
          agency_payout: number | null
          base_price: number | null
          booking_ref: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          created_at: string
          decided_at: string | null
          decision_notes: string | null
          destination_id: string | null
          flexstay_status: string | null
          guests: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          penalty_amount: number | null
          platform_penalty_fee: number | null
          platform_revenue: number | null
          refund_amount: number | null
          service_fee: number | null
          status: string
          total_price: number
          traveler_name: string | null
          traveler_phone: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
          verification_token: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      offer_flexstay: {
        Args: { _booking_id: string }
        Returns: {
          booking_id: string
          created_at: string
          id: string
          offered_by: string | null
          responded_at: string | null
          shift_days: number
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "flexstay_offers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      respond_flexstay: {
        Args: { _accept: boolean; _offer_id: string }
        Returns: {
          booking_id: string
          created_at: string
          id: string
          offered_by: string | null
          responded_at: string | null
          shift_days: number
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "flexstay_offers"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_booking_payment_status: {
        Args: { _booking_id: string; _payment_status: string }
        Returns: {
          agency_compensation: number | null
          agency_fee: number | null
          agency_id: string | null
          agency_payout: number | null
          base_price: number | null
          booking_ref: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          check_in: string
          check_out: string
          created_at: string
          decided_at: string | null
          decision_notes: string | null
          destination_id: string | null
          flexstay_status: string | null
          guests: number
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string
          penalty_amount: number | null
          platform_penalty_fee: number | null
          platform_revenue: number | null
          refund_amount: number | null
          service_fee: number | null
          status: string
          total_price: number
          traveler_name: string | null
          traveler_phone: string | null
          trip_id: string | null
          updated_at: string
          user_id: string
          verification_token: string
        }
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verify_booking_token: {
        Args: { _token: string }
        Returns: {
          agency_name: string
          booking_ref: string
          check_in: string
          check_out: string
          guests: number
          payment_status: string
          status: string
          trip_title: string
        }[]
      }
    }
    Enums: {
      app_role: "customer" | "agency" | "admin"
      post_status: "pending" | "approved" | "rejected"
      trip_status:
        | "draft"
        | "pending_approval"
        | "published"
        | "paused"
        | "sold_out"
        | "completed"
        | "cancelled"
      verification_status:
        | "pending"
        | "under_review"
        | "verified"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "agency", "admin"],
      post_status: ["pending", "approved", "rejected"],
      trip_status: [
        "draft",
        "pending_approval",
        "published",
        "paused",
        "sold_out",
        "completed",
        "cancelled",
      ],
      verification_status: [
        "pending",
        "under_review",
        "verified",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
