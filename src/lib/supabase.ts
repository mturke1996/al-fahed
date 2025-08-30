import { createClient } from "@supabase/supabase-js";

// استخدام قيم افتراضية في حالة عدم وجود متغيرات البيئة
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://gkuxhpbyzrtqifkvxhzj.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdXhocGJ5enJ0cWlma3Z4aHpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzY0MjQsImV4cCI6MjA3MjA1MjQyNH0.j-Qqleb5ZLt4rYyoMkzQc8n9zQ_VXxVtlMCqHtQF7ek";

// تم إزالة عرض المفاتيح في الكونسول لأمان الموقع

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// أنواع البيانات لـ Supabase - جداول مترابطة
export interface Database {
  public: {
    Tables: {
      // جدول الفئات
      categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          color: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // جدول المنتجات
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          stock: number;
          image?: string;
          sku?: string;
          barcode?: string;
          weight?: number;
          dimensions?: string;
          supplier?: string;
          cost_price?: number;
          min_stock_level?: number;
          max_stock_level?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category_id: string;
          stock: number;
          image?: string;
          sku?: string;
          barcode?: string;
          weight?: number;
          dimensions?: string;
          supplier?: string;
          cost_price?: number;
          min_stock_level?: number;
          max_stock_level?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category_id?: string;
          stock?: number;
          image?: string;
          sku?: string;
          barcode?: string;
          weight?: number;
          dimensions?: string;
          supplier?: string;
          cost_price?: number;
          min_stock_level?: number;
          max_stock_level?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // جدول العملاء
      customers: {
        Row: {
          id: string;
          name: string;
          email?: string;
          phone?: string;
          address?: string;
          company?: string;
          tax_number?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string;
          phone?: string;
          address?: string;
          company?: string;
          tax_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string;
          company?: string;
          tax_number?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // جدول المبيعات
      sales: {
        Row: {
          id: string;
          customer_id: string;
          total: number;
          discount: number;
          final_total: number;
          payment_method: "cash" | "card" | "transfer";
          status: "pending" | "completed" | "cancelled";
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          total: number;
          discount: number;
          final_total: number;
          payment_method: "cash" | "card" | "transfer";
          status: "pending" | "completed" | "cancelled";
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          total?: number;
          discount?: number;
          final_total?: number;
          payment_method?: "cash" | "card" | "transfer";
          status?: "pending" | "completed" | "cancelled";
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // جدول تفاصيل المبيعات
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price: number;
          total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          quantity: number;
          price: number;
          total: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          quantity?: number;
          price?: number;
          total?: number;
          created_at?: string;
        };
      };

      // جدول الفواتير
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          sale_id: string;
          customer_id: string;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          status: "paid" | "pending" | "overdue";
          due_date: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_number: string;
          sale_id: string;
          customer_id: string;
          subtotal: number;
          tax: number;
          discount: number;
          total: number;
          status: "paid" | "pending" | "overdue";
          due_date: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_number?: string;
          sale_id?: string;
          customer_id?: string;
          subtotal?: number;
          tax?: number;
          discount?: number;
          total?: number;
          status?: "paid" | "pending" | "overdue";
          due_date?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // جدول المدفوعات
      payments: {
        Row: {
          id: string;
          invoice_id: string;
          amount: number;
          payment_method: "cash" | "card" | "transfer";
          payment_date: string;
          reference?: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          amount: number;
          payment_method: "cash" | "card" | "transfer";
          payment_date: string;
          reference?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          amount?: number;
          payment_method?: "cash" | "card" | "transfer";
          payment_date?: string;
          reference?: string;
          notes?: string;
          created_at?: string;
        };
      };

      // جدول المخزون
      inventory: {
        Row: {
          id: string;
          product_id: string;
          quantity: number;
          type: "in" | "out" | "adjustment";
          reference?: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quantity: number;
          type: "in" | "out" | "adjustment";
          reference?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quantity?: number;
          type?: "in" | "out" | "adjustment";
          reference?: string;
          notes?: string;
          created_at?: string;
        };
      };
    };
  };
}
