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
      additional_options: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string | null
          email: string | null
          footer_text: string | null
          id: string
          logo: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          website: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          footer_text?: string | null
          id?: string
          logo?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string | null
          email?: string | null
          footer_text?: string | null
          id?: string
          logo?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          chest_measurement: string | null
          city: string | null
          cnpj: string | null
          company: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          hip_measurement: string | null
          id: number
          length_measurement: string | null
          mobile: string | null
          name: string
          neck_measurement: string | null
          neighborhood: string | null
          notes: string | null
          phone: string | null
          shoulder_measurement: string | null
          sleeve_measurement: string | null
          state: string | null
          updated_at: string | null
          waist_measurement: string | null
          zipcode: string | null
        }
        Insert: {
          address?: string | null
          chest_measurement?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          hip_measurement?: string | null
          id?: number
          length_measurement?: string | null
          mobile?: string | null
          name: string
          neck_measurement?: string | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          shoulder_measurement?: string | null
          sleeve_measurement?: string | null
          state?: string | null
          updated_at?: string | null
          waist_measurement?: string | null
          zipcode?: string | null
        }
        Update: {
          address?: string | null
          chest_measurement?: string | null
          city?: string | null
          cnpj?: string | null
          company?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          hip_measurement?: string | null
          id?: number
          length_measurement?: string | null
          mobile?: string | null
          name?: string
          neck_measurement?: string | null
          neighborhood?: string | null
          notes?: string | null
          phone?: string | null
          shoulder_measurement?: string | null
          sleeve_measurement?: string | null
          state?: string | null
          updated_at?: string | null
          waist_measurement?: string | null
          zipcode?: string | null
        }
        Relationships: []
      }
      embroidery_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fabrics: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      measurements: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          additional_fee: number | null
          additional_fee_description: string | null
          additional_options: Json | null
          adjustments: Json | null
          chest_measurement: string | null
          created_at: string | null
          customer_id: number | null
          deadline: string | null
          deposit_value: number | null
          description: string | null
          discount: number | null
          hip_measurement: string | null
          id: number
          includes_logo: boolean | null
          includes_pocket: boolean | null
          length_measurement: string | null
          logo_custom_height: string | null
          logo_custom_width: string | null
          logo_description: string | null
          logo_positions: string[] | null
          logo_size: string | null
          neck_measurement: string | null
          needs_logo_creation: boolean | null
          order_name: string
          order_number: string | null
          payment_method: string | null
          payment_methods: Json | null
          payment_status: string
          remaining_balance: number | null
          shoulder_measurement: string | null
          sleeve_measurement: string | null
          special_instructions: string | null
          status: string
          total_price: number
          updated_at: string | null
          waist_measurement: string | null
        }
        Insert: {
          additional_fee?: number | null
          additional_fee_description?: string | null
          additional_options?: Json | null
          adjustments?: Json | null
          chest_measurement?: string | null
          created_at?: string | null
          customer_id?: number | null
          deadline?: string | null
          deposit_value?: number | null
          description?: string | null
          discount?: number | null
          hip_measurement?: string | null
          id?: number
          includes_logo?: boolean | null
          includes_pocket?: boolean | null
          length_measurement?: string | null
          logo_custom_height?: string | null
          logo_custom_width?: string | null
          logo_description?: string | null
          logo_positions?: string[] | null
          logo_size?: string | null
          neck_measurement?: string | null
          needs_logo_creation?: boolean | null
          order_name: string
          order_number?: string | null
          payment_method?: string | null
          payment_methods?: Json | null
          payment_status?: string
          remaining_balance?: number | null
          shoulder_measurement?: string | null
          sleeve_measurement?: string | null
          special_instructions?: string | null
          status?: string
          total_price?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Update: {
          additional_fee?: number | null
          additional_fee_description?: string | null
          additional_options?: Json | null
          adjustments?: Json | null
          chest_measurement?: string | null
          created_at?: string | null
          customer_id?: number | null
          deadline?: string | null
          deposit_value?: number | null
          description?: string | null
          discount?: number | null
          hip_measurement?: string | null
          id?: number
          includes_logo?: boolean | null
          includes_pocket?: boolean | null
          length_measurement?: string | null
          logo_custom_height?: string | null
          logo_custom_width?: string | null
          logo_description?: string | null
          logo_positions?: string[] | null
          logo_size?: string | null
          neck_measurement?: string | null
          needs_logo_creation?: boolean | null
          order_name?: string
          order_number?: string | null
          payment_method?: string | null
          payment_methods?: Json | null
          payment_status?: string
          remaining_balance?: number | null
          shoulder_measurement?: string | null
          sleeve_measurement?: string | null
          special_instructions?: string | null
          status?: string
          total_price?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_size_quantities: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          size_id: string
          size_name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          size_id: string
          size_name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          size_id?: string
          size_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_size_quantities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          additional_option: string | null
          chest_measurement: string | null
          created_at: string | null
          custom_measurements: Json | null
          description: string | null
          embroidery_type: string | null
          fabric_type: string | null
          hip_measurement: string | null
          id: string
          length_measurement: string | null
          neck_measurement: string | null
          order_id: number | null
          product_type: string | null
          quantity: number
          shirt_color: string | null
          shoulder_measurement: string | null
          size: string | null
          sleeve_measurement: string | null
          sleeve_type: string | null
          unit_cost: number
          updated_at: string | null
          waist_measurement: string | null
        }
        Insert: {
          additional_option?: string | null
          chest_measurement?: string | null
          created_at?: string | null
          custom_measurements?: Json | null
          description?: string | null
          embroidery_type?: string | null
          fabric_type?: string | null
          hip_measurement?: string | null
          id?: string
          length_measurement?: string | null
          neck_measurement?: string | null
          order_id?: number | null
          product_type?: string | null
          quantity?: number
          shirt_color?: string | null
          shoulder_measurement?: string | null
          size?: string | null
          sleeve_measurement?: string | null
          sleeve_type?: string | null
          unit_cost?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Update: {
          additional_option?: string | null
          chest_measurement?: string | null
          created_at?: string | null
          custom_measurements?: Json | null
          description?: string | null
          embroidery_type?: string | null
          fabric_type?: string | null
          hip_measurement?: string | null
          id?: string
          length_measurement?: string | null
          neck_measurement?: string | null
          order_id?: number | null
          product_type?: string | null
          quantity?: number
          shirt_color?: string | null
          shoulder_measurement?: string | null
          size?: string | null
          sleeve_measurement?: string | null
          sleeve_type?: string | null
          unit_cost?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_payments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          method: string
          service_order_id: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          method: string
          service_order_id?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          method?: string
          service_order_id?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_order_payments_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_order_products: {
        Row: {
          additional_option: string | null
          chest_measurement: string | null
          created_at: string | null
          custom_measurements: Json | null
          description: string | null
          embroidery_type: string | null
          fabric_type: string | null
          hip_measurement: string | null
          id: string
          length_measurement: string | null
          neck_measurement: string | null
          product_type: string | null
          quantity: number
          service_order_id: string | null
          shirt_color: string | null
          shoulder_measurement: string | null
          size: string | null
          sleeve_measurement: string | null
          sleeve_type: string | null
          unit_cost: number
          updated_at: string | null
          waist_measurement: string | null
        }
        Insert: {
          additional_option?: string | null
          chest_measurement?: string | null
          created_at?: string | null
          custom_measurements?: Json | null
          description?: string | null
          embroidery_type?: string | null
          fabric_type?: string | null
          hip_measurement?: string | null
          id?: string
          length_measurement?: string | null
          neck_measurement?: string | null
          product_type?: string | null
          quantity?: number
          service_order_id?: string | null
          shirt_color?: string | null
          shoulder_measurement?: string | null
          size?: string | null
          sleeve_measurement?: string | null
          sleeve_type?: string | null
          unit_cost?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Update: {
          additional_option?: string | null
          chest_measurement?: string | null
          created_at?: string | null
          custom_measurements?: Json | null
          description?: string | null
          embroidery_type?: string | null
          fabric_type?: string | null
          hip_measurement?: string | null
          id?: string
          length_measurement?: string | null
          neck_measurement?: string | null
          product_type?: string | null
          quantity?: number
          service_order_id?: string | null
          shirt_color?: string | null
          shoulder_measurement?: string | null
          size?: string | null
          sleeve_measurement?: string | null
          sleeve_type?: string | null
          unit_cost?: number
          updated_at?: string | null
          waist_measurement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_products_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          additional_fee: number | null
          additional_fee_description: string | null
          additional_options: Json | null
          adjustments: Json | null
          created_at: string | null
          customer_id: number | null
          deadline: string | null
          deposit_value: number | null
          description: string | null
          discount: number | null
          id: string
          includes_logo: boolean | null
          logo_custom_height: string | null
          logo_custom_width: string | null
          logo_description: string | null
          logo_positions: string[] | null
          logo_size: string | null
          needs_logo_creation: boolean | null
          payment_method: string | null
          payment_methods: Json | null
          payment_status: string
          remaining_balance: number | null
          service_name: string
          service_number: string | null
          special_instructions: string | null
          status: string
          total_price: number
          updated_at: string | null
        }
        Insert: {
          additional_fee?: number | null
          additional_fee_description?: string | null
          additional_options?: Json | null
          adjustments?: Json | null
          created_at?: string | null
          customer_id?: number | null
          deadline?: string | null
          deposit_value?: number | null
          description?: string | null
          discount?: number | null
          id?: string
          includes_logo?: boolean | null
          logo_custom_height?: string | null
          logo_custom_width?: string | null
          logo_description?: string | null
          logo_positions?: string[] | null
          logo_size?: string | null
          needs_logo_creation?: boolean | null
          payment_method?: string | null
          payment_methods?: Json | null
          payment_status?: string
          remaining_balance?: number | null
          service_name: string
          service_number?: string | null
          special_instructions?: string | null
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Update: {
          additional_fee?: number | null
          additional_fee_description?: string | null
          additional_options?: Json | null
          adjustments?: Json | null
          created_at?: string | null
          customer_id?: number | null
          deadline?: string | null
          deposit_value?: number | null
          description?: string | null
          discount?: number | null
          id?: string
          includes_logo?: boolean | null
          logo_custom_height?: string | null
          logo_custom_width?: string | null
          logo_description?: string | null
          logo_positions?: string[] | null
          logo_size?: string | null
          needs_logo_creation?: boolean | null
          payment_method?: string | null
          payment_methods?: Json | null
          payment_status?: string
          remaining_balance?: number | null
          service_name?: string
          service_number?: string | null
          special_instructions?: string | null
          status?: string
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_product_size_quantities: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          size_id: string
          size_name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          size_id: string
          size_name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          size_id?: string
          size_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_product_size_quantities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "service_order_products"
            referencedColumns: ["id"]
          },
        ]
      }
      sizes: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sleeve_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
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
