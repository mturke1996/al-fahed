import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { database, Product, Sale, Customer } from "../lib/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { InvoicePreview } from "../components/invoice/InvoicePreview";
import { QuickInvoiceView } from "../components/invoice/QuickInvoiceView";
import { AdvancedProductManager } from "../components/products/AdvancedProductManager";
import {
  Plus,
  Search,
  ShoppingCart,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit,
  Eye,
  Package,
  Tag,
  Calendar,
  CreditCard,
  Receipt,
  Printer,
  Download,
  Save,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Settings,
  Zap,
  Target,
  Shield,
  HardHat,
  Wrench,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SalesPage() {
  const isMobile = useIsMobile();

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{ product: Product; quantity: number; customPrice?: number }>
  >([]);
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [selectedSaleForInvoice, setSelectedSaleForInvoice] =
    useState<Sale | null>(null);
  const [activeTab, setActiveTab] = useState("sale");

  // إدارة الأصناف والفئات
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteItem, setDeleteItem] = useState<{
    type: "product" | "category";
    id: string;
    name: string;
  } | null>(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    totalCustomers: 0,
    todaySales: 0,
    monthlyRevenue: 0,
  });

  // نموذج إنشاء عميل جديد
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    taxNumber: "",
    website: "",
    notes: "",
  });

  // نموذج إنشاء بيع جديد
  const [newSale, setNewSale] = useState({
    paymentMethod: "cash" as "cash" | "card" | "transfer" | "check",
    discount: 0,
    taxRate: 15,
    notes: "",
    deliveryDate: "",
    terms: "30 days",
  });

  useEffect(() => {
    // تهيئة البيانات الافتراضية أولاً
    database.initializeDefaultData().then(() => {
      // ثم تحميل البيانات
      loadData();
    });
  }, []);

  // فحص حالة تحميل البيانات
  useEffect(() => {
    // يمكن إضافة منطق فحص البيانات هنا إذا لزم الأمر
  }, [products, customers, sales]);

  const loadData = async () => {
    try {
      const [productsData, customersData, salesData] = await Promise.all([
        database.getProducts(),
        database.getCustomers(),
        database.getSales(),
      ]);

      setProducts(productsData);
      setCustomers(customersData);
      setSales(salesData);

      // حساب الإحصائيات المتقدمة
      const totalSales = salesData.length;
      const totalRevenue = salesData.reduce(
        (sum, sale) => sum + sale.finalTotal,
        0
      );
      const totalCustomers = customersData.length;

      // حساب مبيعات اليوم
      const today = new Date();
      const todaySales = salesData.filter(
        (sale) =>
          new Date(sale.createdAt).toDateString() === today.toDateString()
      ).length;

      // حساب الإيرادات الشهرية
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthlyRevenue = salesData
        .filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return (
            saleDate.getMonth() === currentMonth &&
            saleDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, sale) => sum + sale.finalTotal, 0);

      setStats({
        totalSales,
        totalRevenue,
        totalInvoices: 0, // placeholder
        totalCustomers,
        todaySales,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const createCustomer = async () => {
    try {
      const result = await database.addCustomer(newCustomer);
      if (result) {
        setShowCreateCustomer(false);
        setNewCustomer({
          name: "",
          email: "",
          phone: "",
          address: "",
          company: "",
          taxNumber: "",
          website: "",
          notes: "",
        });
        loadData();
        alert("تم إنشاء العميل بنجاح");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      alert("حدث خطأ أثناء إنشاء العميل");
    }
  };

  const addProductToSale = (product: Product) => {
    const existingProduct = selectedProducts.find(
      (p) => p.product.id === product.id
    );
    if (existingProduct) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.product.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { product, quantity: 1, customPrice: product.price },
      ]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.product.id !== productId)
      );
    } else {
      setSelectedProducts((prev) =>
        prev.map((p) => (p.product.id === productId ? { ...p, quantity } : p))
      );
    }
  };

  const updateProductPrice = (productId: string, price: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.product.id === productId ? { ...p, customPrice: price } : p
      )
    );
  };

  const removeProductFromSale = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((p) => p.product.id !== productId)
    );
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce(
      (sum, item) =>
        sum + (item.customPrice || item.product.price) * item.quantity,
      0
    );
    const discount = newSale.discount;
    const taxAmount = (subtotal - discount) * (newSale.taxRate / 100);
    const total = subtotal - discount + taxAmount;

    return { subtotal, discount, taxAmount, total };
  };

  const createSale = async () => {
    if (!selectedCustomer || selectedProducts.length === 0) {
      alert("يرجى اختيار العميل والمنتجات");
      return;
    }

    try {
      const { subtotal, discount, taxAmount, total } = calculateTotal();

      const sale = await database.addSale({
        customerId: selectedCustomer,
        total: subtotal,
        discount,
        finalTotal: total,
        paymentMethod: newSale.paymentMethod,
        status: "completed",
        notes: newSale.notes,
      });

      if (sale) {
        // إضافة تفاصيل البيع
        for (const item of selectedProducts) {
          await database.addSaleItem({
            saleId: sale.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.customPrice || item.product.price,
            total: (item.customPrice || item.product.price) * item.quantity,
          });
        }

        // إعادة تعيين النموذج
        setSelectedCustomer("");
        setSelectedProducts([]);
        setNewSale({
          paymentMethod: "cash",
          discount: 0,
          taxRate: 15,
          notes: "",
          deliveryDate: "",
          terms: "30 days",
        });
        loadData();
        alert("تم إنشاء البيع بنجاح");
      }
    } catch (error) {
      console.error("Error creating sale:", error);
      alert("حدث خطأ أثناء إنشاء البيع");
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const { subtotal, discount, taxAmount, total } = calculateTotal();

  // طباعة معلومات التصحيح
  console.log("العملاء المتاحون:", customers);
  console.log("العميل المختار:", selectedCustomer);
  console.log("بيانات العميل المختار:", selectedCustomerData);
  console.log("المنتجات المختارة:", selectedProducts);

  const openInvoicePreview = () => {
    if (!selectedCustomer) {
      alert("يرجى اختيار العميل أولاً");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("يرجى إضافة منتجات أولاً");
      return;
    }

    setSelectedSaleForInvoice(null); // مبيعة جديدة
    setShowInvoicePreview(true);
  };

  const openSaleInvoice = (sale: Sale) => {
    setSelectedSaleForInvoice(sale);
    setShowInvoicePreview(true);
  };

  // دوال إدارة الأصناف والفئات
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowEditProduct(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowEditCategory(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    setDeleteItem({ type: "product", id, name });
    setShowDeleteConfirm(true);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    setDeleteItem({ type: "category", id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteItem) return;

    try {
      if (deleteItem.type === "product") {
        await database.deleteProduct(deleteItem.id);
        alert("تم حذف المنتج بنجاح");
      } else {
        await database.deleteCategory(deleteItem.id);
        alert("تم حذف الفئة بنجاح");
      }
      loadData();
    } catch (error) {
      alert("حدث خطأ أثناء الحذف");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteItem(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              إدارة المبيعات
            </h1>
            <p className="text-muted-foreground">
              إنشاء وإدارة عمليات البيع مع فواتير احترافية
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateCustomer(true)}
              variant="outline"
            >
              <User className="h-4 w-4 ml-2" />
              إضافة عميل
            </Button>
            <Button onClick={openInvoicePreview} variant="outline">
              <Receipt className="h-4 w-4 ml-2" />
              معاينة الفاتورة
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          className={`grid gap-4 mb-8 ${
            isMobile ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبيعات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">عملية بيع</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الإيرادات
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                مبيعات اليوم
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todaySales}</div>
              <p className="text-xs text-muted-foreground">عملية بيع</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الإيرادات الشهرية
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList
            className={`grid w-full ${
              isMobile ? "grid-cols-1" : "grid-cols-3"
            }`}
          >
            <TabsTrigger value="sale" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              {isMobile ? "إنشاء بيع" : "إنشاء بيع"}
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              {isMobile ? "الأصناف" : "الأصناف"}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {isMobile ? "التاريخ" : "تاريخ المبيعات"}
            </TabsTrigger>
          </TabsList>

          {/* Create Sale Tab */}
          <TabsContent value="sale" className="space-y-6">
            <div
              className={`grid gap-6 ${
                isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
              }`}
            >
              {/* Products Selection */}
              <div className={`${isMobile ? "w-full" : "lg:col-span-2"}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      اختيار المنتجات
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Enhanced Search with Quick Filters */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="البحث السريع في المنتجات..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {/* Quick Category Filters */}
                      <div
                        className={`flex flex-wrap gap-2 ${
                          isMobile ? "justify-center" : ""
                        }`}
                      >
                        <Button
                          variant={searchTerm === "" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSearchTerm("")}
                          className={isMobile ? "text-xs px-2 py-1" : ""}
                        >
                          <Target className="h-3 w-3 ml-1" />
                          الكل
                        </Button>
                        <Button
                          variant={
                            searchTerm === "خرسانة" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSearchTerm("خرسانة")}
                          className={isMobile ? "text-xs px-2 py-1" : ""}
                        >
                          <Building className="h-3 w-3 ml-1" />
                          خرسانة
                        </Button>
                        <Button
                          variant={
                            searchTerm === "حديد" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSearchTerm("حديد")}
                          className={isMobile ? "text-xs px-2 py-1" : ""}
                        >
                          <HardHat className="h-3 w-3 ml-1" />
                          حديد
                        </Button>
                        <Button
                          variant={
                            searchTerm === "أدوات" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSearchTerm("أدوات")}
                          className={isMobile ? "text-xs px-2 py-1" : ""}
                        >
                          <Wrench className="h-3 w-3 ml-1" />
                          أدوات
                        </Button>
                      </div>
                    </div>

                    {/* Products Grid with Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="border rounded-lg p-3 hover:bg-muted/50 transition-colors group relative"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-sm">
                                {product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {product.category?.name || "بدون فئة"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">
                              {product.price.toLocaleString()} د.ل
                            </span>
                            <span className="text-xs text-muted-foreground">
                              المخزون: {product.stock}
                            </span>
                          </div>
                          {product.sku && (
                            <p className="text-xs text-muted-foreground mt-1">
                              SKU: {product.sku}
                            </p>
                          )}

                          {/* Quick Action Buttons */}
                          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              onClick={() => addProductToSale(product)}
                              className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Stock Status Indicator */}
                          <div className="absolute top-2 right-2">
                            {product.stock <= 10 ? (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            ) : product.stock <= 20 ? (
                              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            ) : (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sale Details */}
              <div className="space-y-4">
                {/* Customer Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      معلومات العميل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>اختيار العميل</Label>
                      <Select
                        value={selectedCustomer}
                        onValueChange={setSelectedCustomer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العميل" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedCustomerData && (
                      <div className="p-3 border rounded-lg bg-muted/30">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {selectedCustomerData.name}
                            </span>
                          </div>
                          {selectedCustomerData.company && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedCustomerData.company}
                              </span>
                            </div>
                          )}
                          {selectedCustomerData.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedCustomerData.email}
                              </span>
                            </div>
                          )}
                          {selectedCustomerData.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedCustomerData.phone}
                              </span>
                            </div>
                          )}
                          {selectedCustomerData.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {selectedCustomerData.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sale Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      إعدادات البيع
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>طريقة الدفع</Label>
                      <Select
                        value={newSale.paymentMethod}
                        onValueChange={(
                          value: "cash" | "card" | "transfer" | "check"
                        ) => setNewSale({ ...newSale, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">نقدي</SelectItem>
                          <SelectItem value="card">بطاقة</SelectItem>
                          <SelectItem value="transfer">تحويل</SelectItem>
                          <SelectItem value="check">شيك</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>الخصم (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newSale.discount}
                          onChange={(e) =>
                            setNewSale({
                              ...newSale,
                              discount: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>الضريبة (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={newSale.taxRate}
                          onChange={(e) =>
                            setNewSale({
                              ...newSale,
                              taxRate: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="15"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>تاريخ التسليم</Label>
                      <Input
                        type="date"
                        value={newSale.deliveryDate}
                        onChange={(e) =>
                          setNewSale({
                            ...newSale,
                            deliveryDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label>شروط الدفع</Label>
                      <Select
                        value={newSale.terms}
                        onValueChange={(value) =>
                          setNewSale({ ...newSale, terms: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">فوري</SelectItem>
                          <SelectItem value="7 days">7 أيام</SelectItem>
                          <SelectItem value="15 days">15 يوم</SelectItem>
                          <SelectItem value="30 days">30 يوم</SelectItem>
                          <SelectItem value="60 days">60 يوم</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>ملاحظات</Label>
                      <Textarea
                        value={newSale.notes}
                        onChange={(e) =>
                          setNewSale({ ...newSale, notes: e.target.value })
                        }
                        placeholder="ملاحظات البيع..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      المنتجات المختارة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedProducts.map((item) => (
                        <div
                          key={item.product.id}
                          className="border rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-foreground text-sm">
                              {item.product.name}
                            </h4>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                removeProductFromSale(item.product.id)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <div
                            className={`grid gap-2 text-xs ${
                              isMobile ? "grid-cols-1" : "grid-cols-3"
                            }`}
                          >
                            <div>
                              <Label className="text-xs">الكمية</Label>
                              <Input
                                type="number"
                                min="1"
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={(e) =>
                                  updateProductQuantity(
                                    item.product.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">السعر</Label>
                              <Input
                                type="number"
                                min="0"
                                value={item.customPrice || item.product.price}
                                onChange={(e) =>
                                  updateProductPrice(
                                    item.product.id,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-8 text-xs"
                              />
                            </div>
                            <div className="text-center">
                              <Label className="text-xs">الإجمالي</Label>
                              <div className="font-medium text-foreground">
                                {(
                                  (item.customPrice || item.product.price) *
                                  item.quantity
                                ).toLocaleString()}{" "}
                                د.ل
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>المجموع الفرعي:</span>
                          <span>{subtotal.toLocaleString()} د.ل</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الخصم:</span>
                          <span>{discount.toLocaleString()} د.ل</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الضريبة ({newSale.taxRate}%):</span>
                          <span>{taxAmount.toLocaleString()} د.ل</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>الإجمالي:</span>
                          <span className="text-primary">
                            {total.toLocaleString()} د.ل
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Create Sale Button */}
                    <Button
                      onClick={createSale}
                      disabled={
                        !selectedCustomer || selectedProducts.length === 0
                      }
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      إنشاء البيع
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <AdvancedProductManager
              products={products}
              onAddProduct={(product) => addProductToSale(product)}
              onEditProduct={handleEditProduct}
              onDeleteProduct={handleDeleteProduct}
              onViewProduct={(product) => {
                // يمكن إضافة منطق العرض هنا
              }}
            />
          </TabsContent>

          {/* Sales History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  تاريخ المبيعات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`space-y-4 ${
                    isMobile ? "space-y-3" : "space-y-4"
                  }`}
                >
                  {sales.slice(0, 10).map((sale) => (
                    <div
                      key={sale.id}
                      className={`border rounded-lg hover:bg-muted/50 transition-colors ${
                        isMobile ? "p-3" : "p-4"
                      }`}
                    >
                      <div
                        className={`${
                          isMobile
                            ? "flex-col space-y-2"
                            : "flex items-center justify-between"
                        }`}
                      >
                        <div className="flex-1">
                          <h3
                            className={`font-semibold text-foreground ${
                              isMobile ? "text-sm" : "text-base"
                            }`}
                          >
                            {sale.customer?.name || "عميل غير محدد"}
                          </h3>
                          <p
                            className={`text-muted-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {new Date(sale.createdAt).toLocaleDateString(
                              "ar-LY"
                            )}
                          </p>
                          {sale.customer?.company && (
                            <p
                              className={`text-muted-foreground ${
                                isMobile ? "text-xs" : "text-sm"
                              }`}
                            >
                              {sale.customer.company}
                            </p>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-4 ${
                            isMobile ? "flex-col items-start space-y-2" : ""
                          }`}
                        >
                          <div className="text-right">
                            <div
                              className={`font-semibold text-foreground ${
                                isMobile ? "text-base" : "text-lg"
                              }`}
                            >
                              {sale.finalTotal.toLocaleString()} د.ل
                            </div>
                            <Badge
                              variant={
                                sale.status === "completed"
                                  ? "default"
                                  : "secondary"
                              }
                              className={isMobile ? "text-xs" : ""}
                            >
                              {sale.status === "completed"
                                ? "مكتمل"
                                : sale.status === "pending"
                                ? "قيد الانتظار"
                                : "ملغي"}
                            </Badge>
                          </div>

                          {/* زر عرض الفاتورة السريع */}
                          <Button
                            size={isMobile ? "sm" : "default"}
                            variant="outline"
                            onClick={() => openSaleInvoice(sale)}
                            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          >
                            <Eye
                              className={`${
                                isMobile ? "h-3 w-3" : "h-4 w-4"
                              } ml-1`}
                            />
                            {isMobile ? "عرض" : "عرض الفاتورة"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Customer Modal */}
        {showCreateCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card
              className={`w-full max-h-[90vh] overflow-y-auto ${
                isMobile ? "max-w-sm mx-2" : "max-w-2xl"
              }`}
            >
              <CardHeader>
                <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
                  إضافة عميل جديد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`grid gap-4 ${
                    isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  <div>
                    <Label>اسم العميل *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) =>
                        setNewCustomer({ ...newCustomer, name: e.target.value })
                      }
                      placeholder="اسم العميل"
                    />
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          email: e.target.value,
                        })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label>رقم الهاتف</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+218912345678"
                    />
                  </div>
                  <div>
                    <Label>اسم الشركة</Label>
                    <Input
                      value={newCustomer.company}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          company: e.target.value,
                        })
                      }
                      placeholder="اسم الشركة"
                    />
                  </div>
                  <div>
                    <Label>الرقم الضريبي</Label>
                    <Input
                      value={newCustomer.taxNumber}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          taxNumber: e.target.value,
                        })
                      }
                      placeholder="الرقم الضريبي"
                    />
                  </div>
                  <div>
                    <Label>الموقع الإلكتروني</Label>
                    <Input
                      value={newCustomer.website}
                      onChange={(e) =>
                        setNewCustomer({
                          ...newCustomer,
                          website: e.target.value,
                        })
                      }
                      placeholder="www.example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>العنوان</Label>
                  <Textarea
                    value={newCustomer.address}
                    onChange={(e) =>
                      setNewCustomer({
                        ...newCustomer,
                        address: e.target.value,
                      })
                    }
                    placeholder="عنوان العميل..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label>ملاحظات</Label>
                  <Textarea
                    value={newCustomer.notes}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, notes: e.target.value })
                    }
                    placeholder="ملاحظات إضافية..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateCustomer(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={createCustomer}>إضافة العميل</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoice Preview for New Sales */}
        {selectedCustomerData && !selectedSaleForInvoice && (
          <InvoicePreview
            isOpen={showInvoicePreview}
            onClose={() => setShowInvoicePreview(false)}
            saleData={{
              id: `SALE-${Date.now()}`,
              date: new Date().toISOString(),
              customerId: selectedCustomer,
              status: "completed",
            }}
            customerData={selectedCustomerData}
            products={selectedProducts}
            totals={calculateTotal()}
            saleConfig={{
              taxRate: newSale.taxRate,
              currency: "د.ل",
              companyInfo: {
                name: "شركة الفهد للاستشارة الهندسية",
                address: "طرابلس، ليبيا",
                phone: "+218912345678",
                email: "info@alfahad.ly",
                website: "www.alfahad.ly",
              },
            }}
          />
        )}

        {/* Edit Product Modal */}
        {showEditProduct && editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card
              className={`w-full max-h-[90vh] overflow-y-auto ${
                isMobile ? "max-w-sm mx-2" : "max-w-2xl"
              }`}
            >
              <CardHeader>
                <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
                  تعديل المنتج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`grid gap-4 ${
                    isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
                  }`}
                >
                  <div>
                    <Label>اسم المنتج *</Label>
                    <Input
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="اسم المنتج"
                    />
                  </div>
                  <div>
                    <Label>السعر *</Label>
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="السعر"
                    />
                  </div>
                  <div>
                    <Label>المخزون</Label>
                    <Input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="المخزون"
                    />
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={editingProduct.sku || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          sku: e.target.value,
                        })
                      }
                      placeholder="SKU"
                    />
                  </div>
                </div>
                <div>
                  <Label>الوصف</Label>
                  <Textarea
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="وصف المنتج..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditProduct(false);
                      setEditingProduct(null);
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await database.updateProduct(
                          editingProduct.id,
                          editingProduct
                        );
                        alert("تم تحديث المنتج بنجاح");
                        setShowEditProduct(false);
                        setEditingProduct(null);
                        loadData();
                      } catch (error) {
                        alert("حدث خطأ أثناء التحديث");
                      }
                    }}
                  >
                    حفظ التغييرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && deleteItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card
              className={`w-full ${isMobile ? "max-w-sm mx-2" : "max-w-md"}`}
            >
              <CardHeader>
                <CardTitle className={isMobile ? "text-lg" : "text-xl"}>
                  تأكيد الحذف
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className={isMobile ? "text-sm" : "text-base"}>
                  هل أنت متأكد من حذف{" "}
                  {deleteItem.type === "product" ? "المنتج" : "الفئة"}
                  <strong>"{deleteItem.name}"</strong>؟
                </p>
                <p
                  className={`text-muted-foreground ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div
                  className={`flex gap-2 justify-end ${
                    isMobile ? "flex-col" : ""
                  }`}
                >
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteItem(null);
                    }}
                    className={isMobile ? "w-full" : ""}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={confirmDelete}
                    className={isMobile ? "w-full" : ""}
                  >
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoice Preview for Saved Sales */}
        {selectedSaleForInvoice && (
          <InvoicePreview
            isOpen={showInvoicePreview}
            onClose={() => setShowInvoicePreview(false)}
            saleData={selectedSaleForInvoice}
            customerData={selectedSaleForInvoice.customer}
            products={selectedSaleForInvoice.items.map((item) => ({
              ...item.product,
              quantity: item.quantity,
              customPrice: item.price,
            }))}
            totals={{
              subtotal: selectedSaleForInvoice.total,
              discount: selectedSaleForInvoice.discount,
              taxAmount: selectedSaleForInvoice.taxAmount,
              total: selectedSaleForInvoice.finalTotal,
            }}
            saleConfig={{
              taxRate: selectedSaleForInvoice.taxRate,
              currency: "د.ل",
              companyInfo: {
                name: "شركة الفهد للاستشارة الهندسية",
                address: "طرابلس، ليبيا",
                phone: "+218912345678",
                email: "info@alfahad.ly",
                website: "www.alfahad.ly",
              },
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
