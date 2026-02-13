export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'manager' | 'user';
          seller_reference: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: 'admin' | 'manager' | 'user';
          seller_reference?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'admin' | 'manager' | 'user';
          seller_reference?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          reference: string;
          description: string | null;
          category: string | null;
          base_unit: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          reference: string;
          description?: string | null;
          category?: string | null;
          base_unit: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          reference?: string;
          description?: string | null;
          category?: string | null;
          base_unit?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string;
          unit_type: string;
          conversion_ratio: number | null;
          purchase_price: number;
          manager_sale_price: number;
          stock_quantity: number;
          stock_alert_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku: string;
          unit_type: string;
          conversion_ratio?: number | null;
          purchase_price: number;
          manager_sale_price: number;
          stock_quantity?: number;
          stock_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          sku?: string;
          unit_type?: string;
          conversion_ratio?: number | null;
          purchase_price?: number;
          manager_sale_price?: number;
          stock_quantity?: number;
          stock_alert_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          postal_code: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          postal_code?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string | null;
          invoice_type: string;
          status: string;
          created_by: string;
          validated_by: string | null;
          client_id: string;
          invoice_date: string;
          due_date: string | null;
          subtotal: number;
          discount_amount: number;
          delivery_fee: number;
          tax_amount: number;
          total_amount: number;
          margin_amount: number;
          margin_percentage: number;
          notes: string | null;
          internal_notes: string | null;
          seller_reference: string | null;
          created_at: string;
          updated_at: string;
          validated_at: string | null;
        };
        Insert: {
          id?: string;
          invoice_number?: string | null;
          invoice_type: string;
          status?: string;
          created_by: string;
          validated_by?: string | null;
          client_id: string;
          invoice_date: string;
          due_date?: string | null;
          subtotal: number;
          discount_amount?: number;
          delivery_fee?: number;
          tax_amount?: number;
          total_amount: number;
          margin_amount: number;
          margin_percentage: number;
          notes?: string | null;
          internal_notes?: string | null;
          seller_reference?: string | null;
          created_at?: string;
          updated_at?: string;
          validated_at?: string | null;
        };
        Update: {
          id?: string;
          invoice_number?: string | null;
          invoice_type?: string;
          status?: string;
          created_by?: string;
          validated_by?: string | null;
          client_id?: string;
          invoice_date?: string;
          due_date?: string | null;
          subtotal?: number;
          discount_amount?: number;
          delivery_fee?: number;
          tax_amount?: number;
          total_amount?: number;
          margin_amount?: number;
          margin_percentage?: number;
          notes?: string | null;
          internal_notes?: string | null;
          seller_reference?: string | null;
          created_at?: string;
          updated_at?: string;
          validated_at?: string | null;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          product_variant_id: string;
          product_name: string;
          variant_name: string;
          quantity: number;
          unit_type: string;
          unit_price: number;
          discount_percentage: number;
          discount_amount: number;
          subtotal: number;
          notes: string | null;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          product_variant_id: string;
          product_name: string;
          variant_name: string;
          quantity: number;
          unit_type: string;
          unit_price: number;
          discount_percentage?: number;
          discount_amount?: number;
          subtotal: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          product_variant_id?: string;
          product_name?: string;
          variant_name?: string;
          quantity?: number;
          unit_type?: string;
          unit_price?: number;
          discount_percentage?: number;
          discount_amount?: number;
          subtotal?: number;
          notes?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read: boolean;
          action_url: string | null;
          metadata: any;
          created_at: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          is_read?: boolean;
          action_url?: string | null;
          metadata?: any;
          created_at?: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          action_url?: string | null;
          metadata?: any;
          created_at?: string;
          read_at?: string | null;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          entity_type: string;
          entity_id: string;
          description: string;
          metadata: any;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          entity_type: string;
          entity_id: string;
          description: string;
          metadata?: any;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          entity_type?: string;
          entity_id?: string;
          description?: string;
          metadata?: any;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
