import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { database, Sale } from "../lib/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { QuickInvoiceView } from "../components/invoice/QuickInvoiceView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Search,
  Calendar,
  DollarSign,
  User,
  ShoppingCart,
  Eye,
  Download,
  Receipt,
} from "lucide-react";

export default function SalesHistoryPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const salesData = await database.getSales();
      setSales(salesData);
    } catch (error) {
      console.error("Error loading sales:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل";
      case "pending":
        return "قيد الانتظار";
      case "cancelled":
        return "ملغي";
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "نقدي";
      case "card":
        return "بطاقة";
      case "transfer":
        return "تحويل";
      default:
        return method;
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || !statusFilter || sale.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      new Date(sale.createdAt).toLocaleDateString("ar-LY").includes(dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              تاريخ المبيعات
            </h1>
            <p className="text-muted-foreground">
              عرض وإدارة جميع عمليات البيع السابقة
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبيعات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sales.length}</div>
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
                {sales
                  .reduce((sum, sale) => sum + sale.finalTotal, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">متوسط البيع</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sales.length > 0
                  ? (
                      sales.reduce((sum, sale) => sum + sale.finalTotal, 0) /
                      sales.length
                    ).toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في المبيعات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="cancelled">ملغي</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-[200px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sales List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSales.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد مبيعات</p>
                </div>
              ) : (
                filteredSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {sale.customer?.name || "عميل غير محدد"}
                        </h3>
                        <Badge variant={getStatusColor(sale.status) as any}>
                          {getStatusText(sale.status)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(sale.createdAt).toLocaleDateString(
                              "ar-LY"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{sale.finalTotal.toLocaleString()} د.ل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            {getPaymentMethodText(sale.paymentMethod)}
                          </span>
                        </div>
                      </div>
                      {sale.customer?.company && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {sale.customer.company}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {/* زر عرض الفاتورة السريع */}
                      <QuickInvoiceView
                        saleData={{
                          id: sale.id,
                          createdAt: sale.createdAt,
                          status: sale.status,
                        }}
                        customerData={
                          sale.customer || {
                            name: "عميل غير محدد",
                            company: "",
                          }
                        }
                        products={[
                          {
                            product: {
                              name: "منتج",
                              description: "وصف المنتج",
                              price: sale.finalTotal,
                              sku: "SKU-001",
                            },
                            quantity: 1,
                            customPrice: sale.finalTotal,
                          },
                        ]}
                        totals={{
                          subtotal: sale.finalTotal,
                          discount: 0,
                          taxAmount: sale.finalTotal * 0.15,
                          total: sale.finalTotal * 1.15,
                        }}
                        saleConfig={{
                          paymentMethod: sale.paymentMethod || "cash",
                          taxRate: 15,
                          terms: "30 days",
                        }}
                        className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        عرض الفاتورة
                      </QuickInvoiceView>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
