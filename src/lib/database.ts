import { supabase } from "./supabase";

// أنواع البيانات المحدثة
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  category?: Category;
  stock: number;
  image?: string;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  supplier?: string;
  costPrice?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  company?: string;
  taxNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  customerId: string;
  customer?: Customer;
  total: number;
  discount: number;
  finalTotal: number;
  paymentMethod: "cash" | "card" | "transfer";
  status: "pending" | "completed" | "cancelled";
  notes?: string;
  items?: SaleItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  saleId: string;
  sale?: Sale;
  customerId: string;
  customer?: Customer;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "paid" | "pending" | "overdue";
  dueDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: "cash" | "card" | "transfer";
  paymentDate: Date;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface Inventory {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  type: "in" | "out" | "adjustment";
  reference?: string;
  notes?: string;
  createdAt: Date;
}

// فئة قاعدة البيانات المحدثة
class SupabaseDatabase {
  // تهيئة البيانات الافتراضية
  async initializeDefaultData() {
    try {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*");
      if (categoriesError) {
        console.error("خطأ في جلب الفئات:", categoriesError);
      }
      if (!categories || categories.length === 0) {
        await this.insertDefaultCategories();
      }

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*");
      if (productsError) {
        console.error("خطأ في جلب المنتجات:", productsError);
      }
      if (!products || products.length === 0) {
        await this.insertDefaultProducts();
      }

      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("*");
      if (customersError) {
        console.error("خطأ في جلب العملاء:", customersError);
      }
      if (!customers || customers.length === 0) {
        await this.insertDefaultCustomers();
      }
    } catch (error) {
      console.error("خطأ في تهيئة البيانات الافتراضية:", error);
    }
  }

  // إدارة الفئات
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (
        data?.map((item) => ({
          ...item,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async addCategory(
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name: category.name,
          description: category.description,
        })
        .select()
        .single();

      if (error) {
        console.error(`خطأ في إضافة الفئة ${category.name}:`, error);
        throw error;
      }

      if (data) {
        return {
          ...data,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
      } else {
        console.error(`لم يتم إرجاع بيانات للفئة ${category.name}`);
        return null;
      }
    } catch (error) {
      console.error(`خطأ في إضافة الفئة ${category.name}:`, error);
      return null;
    }
  }

  async updateCategory(
    id: string,
    updates: Partial<Category>
  ): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update({
          name: updates.name,
          description: updates.description,
          color: updates.color,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data
        ? {
            ...data,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        : null;
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }

  // إدارة المنتجات
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (
        data?.map((item) => ({
          ...item,
          categoryId: item.category_id,
          category: item.category
            ? {
                ...item.category,
                createdAt: new Date(item.category.created_at),
                updatedAt: new Date(item.category.updated_at),
              }
            : undefined,
          costPrice: item.cost_price,
          minStockLevel: item.min_stock_level,
          maxStockLevel: item.max_stock_level,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  async addProduct(
    product: Omit<Product, "id" | "createdAt" | "updatedAt" | "category">
  ): Promise<Product | null> {
    try {
      console.log(`محاولة إضافة المنتج: ${product.name}`);
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.categoryId,
          stock: product.stock,
          image: product.image,
          sku: product.sku,
          barcode: product.barcode,
          weight: product.weight,
          dimensions: product.dimensions,
          supplier: product.supplier,
          cost_price: product.costPrice,
          min_stock_level: product.minStockLevel,
          max_stock_level: product.maxStockLevel,
        })
        .select()
        .single();

      if (error) {
        console.error(`خطأ في إضافة المنتج ${product.name}:`, error);
        throw error;
      }

      if (data) {
        console.log(`تم إضافة المنتج ${product.name} بنجاح`);
        return {
          ...data,
          categoryId: data.category_id,
          costPrice: data.cost_price,
          minStockLevel: data.min_stock_level,
          maxStockLevel: data.max_stock_level,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
      } else {
        console.error(`لم يتم إرجاع بيانات للمنتج ${product.name}`);
        return null;
      }
    } catch (error) {
      console.error(`خطأ في إضافة المنتج ${product.name}:`, error);
      return null;
    }
  }

  async updateProduct(
    id: string,
    updates: Partial<Product>
  ): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({
          name: updates.name,
          description: updates.description,
          price: updates.price,
          category_id: updates.categoryId,
          stock: updates.stock,
          image: updates.image,
          sku: updates.sku,
          barcode: updates.barcode,
          weight: updates.weight,
          dimensions: updates.dimensions,
          supplier: updates.supplier,
          cost_price: updates.costPrice,
          min_stock_level: updates.minStockLevel,
          max_stock_level: updates.maxStockLevel,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data
        ? {
            ...data,
            categoryId: data.category_id,
            costPrice: data.cost_price,
            minStockLevel: data.min_stock_level,
            maxStockLevel: data.max_stock_level,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        : null;
    } catch (error) {
      console.error("Error updating product:", error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  // إدارة العملاء
  async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (
        data?.map((item) => ({
          ...item,
          taxNumber: item.tax_number,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
      return [];
    }
  }

  async addCustomer(
    customer: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer | null> {
    try {
      console.log(`محاولة إضافة العميل: ${customer.name}`);
      const { data, error } = await supabase
        .from("customers")
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          company: customer.company,
          tax_number: customer.taxNumber,
        })
        .select()
        .single();

      if (error) {
        console.error(`خطأ في إضافة العميل ${customer.name}:`, error);
        throw error;
      }

      if (data) {
        console.log(`تم إضافة العميل ${customer.name} بنجاح`);
        return {
          ...data,
          taxNumber: data.tax_number,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
        };
      } else {
        console.error(`لم يتم إرجاع بيانات للعميل ${customer.name}`);
        return null;
      }
    } catch (error) {
      console.error(`خطأ في إضافة العميل ${customer.name}:`, error);
      return null;
    }
  }

  // إدارة المبيعات
  async getSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select(
          `
          *,
          customer:customers(*),
          items:sale_items(
            *,
            product:products(*)
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (
        data?.map((item) => ({
          ...item,
          customerId: item.customer_id,
          finalTotal: item.final_total,
          paymentMethod: item.payment_method,
          customer: item.customer
            ? {
                ...item.customer,
                taxNumber: item.customer.tax_number,
                createdAt: new Date(item.customer.created_at),
                updatedAt: new Date(item.customer.updated_at),
              }
            : undefined,
          items:
            item.items?.map((saleItem: any) => ({
              ...saleItem,
              saleId: saleItem.sale_id,
              productId: saleItem.product_id,
              product: saleItem.product
                ? {
                    ...saleItem.product,
                    categoryId: saleItem.product.category_id,
                    costPrice: saleItem.product.cost_price,
                    minStockLevel: saleItem.product.min_stock_level,
                    maxStockLevel: saleItem.product.max_stock_level,
                    createdAt: new Date(saleItem.product.created_at),
                    updatedAt: new Date(saleItem.product.updated_at),
                  }
                : undefined,
              createdAt: new Date(saleItem.created_at),
            })) || [],
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching sales:", error);
      return [];
    }
  }

  async addSale(
    sale: Omit<Sale, "id" | "createdAt" | "updatedAt" | "customer" | "items">
  ): Promise<Sale | null> {
    try {
      const { data, error } = await supabase
        .from("sales")
        .insert({
          customer_id: sale.customerId,
          total: sale.total,
          discount: sale.discount,
          final_total: sale.finalTotal,
          payment_method: sale.paymentMethod,
          status: sale.status,
          notes: sale.notes,
        })
        .select()
        .single();

      if (error) throw error;

      return data
        ? {
            ...data,
            customerId: data.customer_id,
            finalTotal: data.final_total,
            paymentMethod: data.payment_method,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        : null;
    } catch (error) {
      console.error("Error adding sale:", error);
      return null;
    }
  }

  async addSaleItem(
    saleItem: Omit<SaleItem, "id" | "createdAt" | "product">
  ): Promise<SaleItem | null> {
    try {
      console.log(`محاولة إضافة عنصر البيع:`, saleItem);
      const { data, error } = await supabase
        .from("sale_items")
        .insert({
          sale_id: saleItem.saleId,
          product_id: saleItem.productId,
          quantity: saleItem.quantity,
          price: saleItem.price,
          total: saleItem.total,
        })
        .select()
        .single();

      if (error) {
        console.error(`خطأ في إضافة عنصر البيع:`, error);
        throw error;
      }

      if (data) {
        console.log(`تم إضافة عنصر البيع بنجاح:`, data);
        return {
          ...data,
          saleId: data.sale_id,
          productId: data.product_id,
          createdAt: new Date(data.created_at),
        };
      } else {
        console.error(`لم يتم إرجاع بيانات لعنصر البيع`);
        return null;
      }
    } catch (error) {
      console.error("Error adding sale item:", error);
      return null;
    }
  }

  // إدارة الفواتير
  async getInvoices(): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .select(
          `
          *,
          sale:sales(*),
          customer:customers(*)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (
        data?.map((item) => ({
          ...item,
          invoiceNumber: item.invoice_number,
          saleId: item.sale_id,
          customerId: item.customer_id,
          dueDate: new Date(item.due_date),
          sale: item.sale
            ? {
                ...item.sale,
                customerId: item.sale.customer_id,
                finalTotal: item.sale.final_total,
                paymentMethod: item.sale.payment_method,
                createdAt: new Date(item.sale.created_at),
                updatedAt: new Date(item.sale.updated_at),
              }
            : undefined,
          customer: item.customer
            ? {
                ...item.customer,
                taxNumber: item.customer.tax_number,
                createdAt: new Date(item.customer.created_at),
                updatedAt: new Date(item.customer.updated_at),
              }
            : undefined,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        })) || []
      );
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }
  }

  async addInvoice(
    invoice: Omit<
      Invoice,
      "id" | "createdAt" | "updatedAt" | "sale" | "customer"
    >
  ): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert({
          invoice_number: invoice.invoiceNumber,
          sale_id: invoice.saleId,
          customer_id: invoice.customerId,
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          discount: invoice.discount,
          total: invoice.total,
          status: invoice.status,
          due_date: invoice.dueDate.toISOString(),
          notes: invoice.notes,
        })
        .select()
        .single();

      if (error) throw error;

      return data
        ? {
            ...data,
            invoiceNumber: data.invoice_number,
            saleId: data.sale_id,
            customerId: data.customer_id,
            dueDate: new Date(data.due_date),
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
          }
        : null;
    } catch (error) {
      console.error("Error adding invoice:", error);
      return null;
    }
  }

  // إحصائيات
  async getStats() {
    try {
      const [products, sales, invoices, customers] = await Promise.all([
        this.getProducts(),
        this.getSales(),
        this.getInvoices(),
        this.getCustomers(),
      ]);

      const totalProducts = products.length;
      const totalSales = sales.length;
      const totalInvoices = invoices.length;
      const totalCustomers = customers.length;
      const totalRevenue = sales.reduce(
        (sum, sale) => sum + sale.finalTotal,
        0
      );
      const lowStockProducts = products.filter(
        (p) => p.stock <= (p.minStockLevel || 10)
      ).length;

      return {
        totalProducts,
        totalSales,
        totalInvoices,
        totalCustomers,
        totalRevenue,
        lowStockProducts,
      };
    } catch (error) {
      console.error("Error getting stats:", error);
      return {
        totalProducts: 0,
        totalSales: 0,
        totalInvoices: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        lowStockProducts: 0,
      };
    }
  }

  // إدخال البيانات الافتراضية
  private async insertDefaultCategories() {
    try {
      console.log("إضافة فئات افتراضية...");
      const defaultCategories = [
        {
          name: "مواسير",
          description: "جميع أنواع المواسير والأنابيب",
          color: "blue",
        },
        { name: "صمامات", description: "صمامات المياه والغاز", color: "green" },
        {
          name: "محابس",
          description: "محابس المياه المختلفة",
          color: "purple",
        },
        { name: "أدوات", description: "أدوات البناء واللحام", color: "orange" },
        { name: "عوازل", description: "مواد العزل الحراري", color: "red" },
        {
          name: "كهربائيات",
          description: "المواد الكهربائية",
          color: "yellow",
        },
        { name: "بناء", description: "مواد البناء الأساسية", color: "indigo" },
        { name: "حديد", description: "حديد التسليح والبناء", color: "teal" },
        {
          name: "أبواب ونوافذ",
          description: "الأبواب والنوافذ",
          color: "pink",
        },
        { name: "دهانات", description: "الدهانات والطلاء", color: "gray" },
        { name: "بلاط", description: "البلاط والسيراميك", color: "cyan" },
      ];

      for (const category of defaultCategories) {
        console.log(`محاولة إضافة الفئة: ${category.name}`);
        const result = await this.addCategory(category);
        if (result) {
          console.log(`تم إضافة الفئة: ${category.name}`);
        } else {
          console.error(`فشل في إضافة الفئة: ${category.name}`);
        }
      }
      console.log("تم إضافة جميع الفئات الافتراضية");
    } catch (error) {
      console.error("خطأ في إضافة الفئات الافتراضية:", error);
    }
  }

  private async insertDefaultProducts() {
    try {
      console.log("إضافة منتجات افتراضية...");
      const categories = await this.getCategories();
      const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

      const defaultProducts = [
        {
          name: "مواسير PVC",
          description: "مواسير PVC عالية الجودة للمشاريع الهندسية",
          price: 150.0,
          categoryId: categoryMap.get("مواسير") || "",
          stock: 100,
          image: "/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png",
          sku: "PVC-001",
          barcode: "1234567890",
          weight: 2.5,
          dimensions: "6m × 110mm",
          supplier: "شركة البناء الحديث",
          costPrice: 120.0,
          minStockLevel: 20,
          maxStockLevel: 200,
        },
        {
          name: "صمامات نحاسية",
          description: "صمامات نحاسية مقاومة للصدأ",
          price: 85.5,
          categoryId: categoryMap.get("صمامات") || "",
          stock: 50,
          image: "/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png",
          sku: "VALVE-001",
          barcode: "1234567891",
          weight: 0.5,
          dimensions: "1/2 inch",
          supplier: "مصنع الصمامات المتطور",
          costPrice: 65.0,
          minStockLevel: 10,
          maxStockLevel: 100,
        },
        {
          name: "محابس حديد",
          description: "محابس حديد مجلفن للمياه",
          price: 120.0,
          categoryId: categoryMap.get("محابس") || "",
          stock: 75,
          image: "/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png",
          sku: "TAP-001",
          barcode: "1234567892",
          weight: 1.2,
          dimensions: "3/4 inch",
          supplier: "شركة المحابس العالمية",
          costPrice: 90.0,
          minStockLevel: 15,
          maxStockLevel: 150,
        },
        {
          name: "أدوات لحام",
          description: "أدوات لحام احترافية",
          price: 250.0,
          categoryId: categoryMap.get("أدوات") || "",
          stock: 25,
          image: "/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png",
          sku: "WELD-001",
          barcode: "1234567893",
          weight: 3.0,
          dimensions: "30cm × 15cm",
          supplier: "مؤسسة الأدوات المهنية",
          costPrice: 180.0,
          minStockLevel: 5,
          maxStockLevel: 50,
        },
        {
          name: "عوازل حرارية",
          description: "عوازل حرارية للمباني",
          price: 180.0,
          categoryId: categoryMap.get("عوازل") || "",
          stock: 60,
          image: "/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png",
          sku: "INSUL-001",
          barcode: "1234567894",
          weight: 1.8,
          dimensions: "1m × 0.5m",
          supplier: "شركة العزل المتقدم",
          costPrice: 140.0,
          minStockLevel: 12,
          maxStockLevel: 120,
        },
      ];

      for (const product of defaultProducts) {
        const result = await this.addProduct(product);
        if (result) {
          console.log(`تم إضافة المنتج: ${product.name}`);
        } else {
          console.error(`فشل في إضافة المنتج: ${product.name}`);
        }
      }
      console.log("تم إضافة جميع المنتجات الافتراضية");
    } catch (error) {
      console.error("خطأ في إضافة المنتجات الافتراضية:", error);
    }
  }

  private async insertDefaultCustomers() {
    try {
      console.log("إضافة عملاء افتراضيين...");
      const defaultCustomers = [
        {
          name: "عميل 1",
          email: "client1@example.com",
          phone: "0123456789",
          address: "القاهرة",
          company: "شركة المستهلك",
          taxNumber: "123456789012345",
        },
        {
          name: "عميل 2",
          email: "client2@example.com",
          phone: "9876543210",
          address: "الجيزة",
          company: "شركة المستهلك",
          taxNumber: "123456789012346",
        },
        {
          name: "عميل 3",
          email: "client3@example.com",
          phone: "1122334455",
          address: "الإسكندرية",
          company: "شركة المستهلك",
          taxNumber: "123456789012347",
        },
        {
          name: "عميل 4",
          email: "client4@example.com",
          phone: "6677889900",
          address: "الأسكندرية",
          company: "شركة المستهلك",
          taxNumber: "123456789012348",
        },
        {
          name: "عميل 5",
          email: "client5@example.com",
          phone: "1231231234",
          address: "القاهرة",
          company: "شركة المستهلك",
          taxNumber: "123456789012349",
        },
        {
          name: "عميل 6",
          email: "client6@example.com",
          phone: "4564564567",
          address: "الجيزة",
          company: "شركة المستهلك",
          taxNumber: "123456789012350",
        },
        {
          name: "عميل 7",
          email: "client7@example.com",
          phone: "7897897890",
          address: "الإسكندرية",
          company: "شركة المستهلك",
          taxNumber: "123456789012351",
        },
        {
          name: "عميل 8",
          email: "client8@example.com",
          phone: "0123456789",
          address: "الأسكندرية",
          company: "شركة المستهلك",
          taxNumber: "123456789012352",
        },
        {
          name: "عميل 9",
          email: "client9@example.com",
          phone: "9876543210",
          address: "القاهرة",
          company: "شركة المستهلك",
          taxNumber: "123456789012353",
        },
        {
          name: "عميل 10",
          email: "client10@example.com",
          phone: "1122334455",
          address: "الجيزة",
          company: "شركة المستهلك",
          taxNumber: "123456789012354",
        },
      ];

      for (const customer of defaultCustomers) {
        const result = await this.addCustomer(customer);
        if (result) {
          console.log(`تم إضافة العميل: ${customer.name}`);
        } else {
          console.error(`فشل في إضافة العميل: ${customer.name}`);
        }
      }
      console.log("تم إضافة جميع العملاء الافتراضيين");
    } catch (error) {
      console.error("خطأ في إضافة العملاء الافتراضيين:", error);
    }
  }
}

// تصدير نسخة واحدة من قاعدة البيانات
export const database = new SupabaseDatabase();
