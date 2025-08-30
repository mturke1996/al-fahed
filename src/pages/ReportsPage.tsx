import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Star,
  Smartphone,
  Monitor,
  Tablet,
  Receipt,
} from "lucide-react";
import { database } from "@/lib/database";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { QuickInvoiceView } from "@/components/invoice/QuickInvoiceView";

interface ReportData {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  salesByMonth: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportData>({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topSellingProducts: [],
    salesByMonth: [],
    recentActivity: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  useEffect(() => {
    loadReportData();
    // تحديد وضع العرض بناءً على حجم الشاشة
    const handleResize = () => {
      setViewMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [selectedPeriod, selectedCategory]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const sales = await database.getSales();
      const products = await database.getProducts();

      // حساب الإحصائيات الأساسية
      const totalSales = sales.length;
      const totalRevenue = sales.reduce(
        (sum, sale) => sum + sale.finalTotal,
        0
      );
      const totalProducts = products.length;
      const uniqueCustomers = new Set(sales.map((sale) => sale.customerName))
        .size;
      const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      // تحليل المنتجات الأكثر مبيعاً
      const productSales = new Map();
      sales.forEach((sale) => {
        sale.items.forEach((item: any) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            const existing = productSales.get(product.id) || {
              name: product.name,
              quantity: 0,
              revenue: 0,
            };
            existing.quantity += item.quantity;
            existing.revenue += item.quantity * item.price;
            productSales.set(product.id, existing);
          }
        });
      });

      const topSellingProducts = Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // تحليل المبيعات الشهرية
      const salesByMonth = sales.reduce((acc, sale) => {
        const month = format(sale.createdAt, "MMMM yyyy", { locale: ar });
        const existing = acc.find((item) => item.month === month);
        if (existing) {
          existing.sales += 1;
          existing.revenue += sale.finalTotal;
        } else {
          acc.push({ month, sales: 1, revenue: sale.finalTotal });
        }
        return acc;
      }, [] as Array<{ month: string; sales: number; revenue: number }>);

      // النشاط الأخير
      const recentActivity = sales.slice(0, 10).map((sale) => ({
        id: sale.id,
        type: "sale",
        amount: sale.finalTotal,
        date: format(sale.createdAt, "dd/MM/yyyy", { locale: ar }),
        status: sale.status,
      }));

      setReportData({
        totalSales,
        totalRevenue,
        totalProducts,
        totalCustomers: uniqueCustomers,
        averageOrderValue,
        topSellingProducts,
        salesByMonth,
        recentActivity,
      });
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 text-emerald-600 border-emerald-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 border-yellow-500";
      case "cancelled":
        return "bg-red-500/20 text-red-600 border-red-500";
      default:
        return "bg-gray-500/20 text-gray-600 border-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتملة";
      case "pending":
        return "قيد المعالجة";
      case "cancelled":
        return "ملغية";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل التقارير...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
              التقارير والإحصائيات
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground">
              تحليل شامل لأداء المبيعات والأعمال
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">تصدير التقرير</span>
            </Button>
            <Button size="sm" className="gap-1 sm:gap-2">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">تصفية</span>
            </Button>
          </div>
        </div>

        {/* Filters - Mobile Optimized */}
        <Card>
          <CardContent className="p-4 sm:pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <Label className="text-xs sm:text-sm">الفترة الزمنية</Label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">آخر 7 أيام</SelectItem>
                    <SelectItem value="30">آخر 30 يوم</SelectItem>
                    <SelectItem value="90">آخر 3 أشهر</SelectItem>
                    <SelectItem value="365">آخر سنة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">الفئة</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    <SelectItem value="electronics">الإلكترونيات</SelectItem>
                    <SelectItem value="clothing">الملابس</SelectItem>
                    <SelectItem value="books">الكتب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs sm:text-sm">البحث</Label>
                <div className="relative">
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <Input
                    placeholder="البحث في التقارير..."
                    className="pr-8 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    إجمالي المبيعات
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">
                    {reportData.totalSales}
                  </p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm text-emerald-600">
                      +12.5%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    إجمالي الإيرادات
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-foreground">
                    {reportData.totalRevenue.toFixed(0)} د.ل
                  </p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm text-emerald-600">
                      +8.3%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    متوسط قيمة الطلب
                  </p>
                  <p className="text-lg sm:text-3xl font-bold text-foreground">
                    {reportData.averageOrderValue.toFixed(0)} د.ل
                  </p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm text-emerald-600">
                      +5.2%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Target className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    العملاء النشطين
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-foreground">
                    {reportData.totalCustomers}
                  </p>
                  <div className="flex items-center gap-1 mt-1 sm:mt-2">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
                    <span className="text-xs sm:text-sm text-emerald-600">
                      +15.7%
                    </span>
                  </div>
                </div>
                <div className="h-8 w-8 sm:h-12 sm:w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports Tabs - Mobile Optimized */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              نظرة عامة
            </TabsTrigger>
            <TabsTrigger value="products" className="text-xs sm:text-sm">
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="sales" className="text-xs sm:text-sm">
              المبيعات
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs sm:text-sm">
              النشاط
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Top Selling Products - Mobile Optimized */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                    المنتجات الأكثر مبيعاً
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    أفضل 5 منتجات من حيث الكمية المباعة
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {reportData.topSellingProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm sm:text-base">
                              {product.name}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {product.quantity} قطعة
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm sm:text-base">
                            {product.revenue.toFixed(0)} د.ل
                          </p>
                          <p className="text-xs text-muted-foreground">
                            إيرادات
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Sales Chart - Mobile Optimized */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                    <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />
                    المبيعات الشهرية
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    تحليل المبيعات والإيرادات الشهرية
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {reportData.salesByMonth.map((month, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">
                            {month.month}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {month.sales} عملية
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm sm:text-base">
                            {month.revenue.toFixed(0)} د.ل
                          </p>
                          <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-2 bg-primary rounded-full"
                              style={{
                                width: `${
                                  (month.revenue /
                                    Math.max(
                                      ...reportData.salesByMonth.map(
                                        (m) => m.revenue
                                      )
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                  تحليل المنتجات
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  إحصائيات مفصلة عن المنتجات والمخزون
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <Package className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">
                    سيتم إضافة تحليل المنتجات هنا...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  تحليل المبيعات
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  تفاصيل شاملة عن عمليات البيع
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">
                    سيتم إضافة تحليل المبيعات هنا...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  النشاط الأخير
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  آخر العمليات والأنشطة في النظام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {reportData.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm sm:text-base">
                            عملية بيع #{activity.id}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-primary text-sm sm:text-base">
                            {activity.amount.toFixed(0)} د.ل
                          </p>
                          <Badge
                            className={`${getStatusColor(
                              activity.status
                            )} text-xs`}
                          >
                            {getStatusText(activity.status)}
                          </Badge>
                        </div>

                        {/* زر عرض الفاتورة السريع */}
                        <QuickInvoiceView
                          saleData={{
                            id: activity.id,
                            createdAt: activity.date,
                            status: activity.status,
                          }}
                          customerData={{
                            name: "عميل",
                            company: "شركة",
                          }}
                          products={[
                            {
                              product: {
                                name: "منتج",
                                description: "وصف المنتج",
                                price: activity.amount,
                                sku: "SKU-001",
                              },
                              quantity: 1,
                              customPrice: activity.amount,
                            },
                          ]}
                          totals={{
                            subtotal: activity.amount,
                            discount: 0,
                            taxAmount: 0,
                            total: activity.amount,
                          }}
                          saleConfig={{
                            paymentMethod: "cash",
                            taxRate: 15,
                            terms: "30 days",
                          }}
                          className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ReportsPage;
