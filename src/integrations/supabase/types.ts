export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          contact: string | null
          created_at: string | null
          email: string
          id: string
          is_blocked: boolean | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_blocked?: boolean | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_blocked?: boolean | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          is_blocked: boolean | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_blocked?: boolean | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_blocked?: boolean | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          approved: boolean | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          permissions: Json | null
          phone: string | null
          position: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          permissions?: Json | null
          phone?: string | null
          position?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          permissions?: Json | null
          phone?: string | null
          position?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          areas: string[] | null
          attractions: string[] | null
          capacity: number
          classification: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          price: number
          title: string
          updated_at: string | null
        }
        Insert: {
          areas?: string[] | null
          attractions?: string[] | null
          capacity?: number
          classification?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          price?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          areas?: string[] | null
          attractions?: string[] | null
          capacity?: number
          classification?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          price?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      playlists: {
        Row: {
          active: boolean | null
          artist: string
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          active?: boolean | null
          artist: string
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          active?: boolean | null
          artist?: string
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          category: string | null
          circumference: string | null
          collar: string | null
          company: string | null
          company_id: string | null
          created_at: string | null
          created_by: string | null
          created_by_id: string | null
          custom_text: string | null
          customer: string | null
          customer_id: string | null
          date: string | null
          description: string | null
          id: string
          image: string | null
          is_blocked: boolean | null
          length: string | null
          logo_image: string | null
          logo_model: string | null
          logo_position: string | null
          name: string
          price: number | null
          qr_code: string | null
          sizes: Json | null
          sleeve: string | null
          text_position: string | null
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          circumference?: string | null
          collar?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_id?: string | null
          custom_text?: string | null
          customer?: string | null
          customer_id?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_blocked?: boolean | null
          length?: string | null
          logo_image?: string | null
          logo_model?: string | null
          logo_position?: string | null
          name: string
          price?: number | null
          qr_code?: string | null
          sizes?: Json | null
          sleeve?: string | null
          text_position?: string | null
        }
        Update: {
          barcode?: string | null
          category?: string | null
          circumference?: string | null
          collar?: string | null
          company?: string | null
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          created_by_id?: string | null
          custom_text?: string | null
          customer?: string | null
          customer_id?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_blocked?: boolean | null
          length?: string | null
          logo_image?: string | null
          logo_model?: string | null
          logo_position?: string | null
          name?: string
          price?: number | null
          qr_code?: string | null
          sizes?: Json | null
          sleeve?: string | null
          text_position?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      service_orders: {
        Row: {
          approval_status: string
          company: string
          company_id: string
          created_at: string | null
          created_by: string | null
          customer: string
          customer_id: string
          description: string
          end_date: string | null
          id: string
          last_modified_by: string | null
          notes: string | null
          order_number: string
          payment_barcode: string | null
          payment_qr_code: string | null
          priority: string
          products: Json
          start_date: string
          status: string
          technician: string
          total_value: number
          updated_at: string | null
        }
        Insert: {
          approval_status?: string
          company: string
          company_id: string
          created_at?: string | null
          created_by?: string | null
          customer: string
          customer_id: string
          description: string
          end_date?: string | null
          id?: string
          last_modified_by?: string | null
          notes?: string | null
          order_number: string
          payment_barcode?: string | null
          payment_qr_code?: string | null
          priority: string
          products?: Json
          start_date: string
          status: string
          technician: string
          total_value: number
          updated_at?: string | null
        }
        Update: {
          approval_status?: string
          company?: string
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          customer?: string
          customer_id?: string
          description?: string
          end_date?: string | null
          id?: string
          last_modified_by?: string | null
          notes?: string | null
          order_number?: string
          payment_barcode?: string | null
          payment_qr_code?: string | null
          priority?: string
          products?: Json
          start_date?: string
          status?: string
          technician?: string
          total_value?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tickets: {
        Row: {
          active: boolean | null
          area: string | null
          created_at: string | null
          event_id: string | null
          id: string
          price: number
          purchase_date: string | null
          security_code: string
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          area?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          price: number
          purchase_date?: string | null
          security_code: string
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          area?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          price?: number
          purchase_date?: string | null
          security_code?: string
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
