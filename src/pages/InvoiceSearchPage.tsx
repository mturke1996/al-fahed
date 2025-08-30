import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { database, Invoice } from "../lib/database";
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
  FileText,
  Calendar,
  DollarSign,
  User,
  Eye,
  Download,
  Filter,
  Receipt,
} from "lucide-react";

export default function InvoiceSearchPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const invoicesData = await database.getInvoices();
      setInvoices(invoicesData);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "pending":
        return "قيد الانتظار";
      case "overdue":
        return "متأخر";
      default:
        return status;
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.sale?.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      invoice.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      new Date(invoice.dueDate)
        .toLocaleDateString("ar-LY")
        .includes(dateFilter);
    const matchesAmount =
      !amountFilter || invoice.total >= parseFloat(amountFilter);

    return matchesSearch && matchesStatus && matchesDate && matchesAmount;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              البحث في الفواتير
            </h1>
            <p className="text-muted-foreground">
              البحث والتصفية في جميع الفواتير
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الفواتير
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">فاتورة</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبلغ
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices
                  .reduce((sum, invoice) => sum + invoice.total, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الفواتير المدفوعة
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter((inv) => inv.status === "paid").length}
              </div>
              <p className="text-xs text-muted-foreground">فاتورة</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الفواتير المتأخرة
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter((inv) => inv.status === "overdue").length}
              </div>
              <p className="text-xs text-muted-foreground">فاتورة</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              فلاتر متقدمة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الفواتير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="تاريخ الاستحقاق"
              />

              <Input
                type="number"
                placeholder="الحد الأدنى للمبلغ"
                value={amountFilter}
                onChange={(e) => setAmountFilter(e.target.value)}
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>نتائج البحث</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد فواتير تطابق معايير البحث</p>
                </div>
              ) : (
                filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">
                          فاتورة #{invoice.id.slice(-8)}
                        </h3>
                        <Badge variant={getStatusColor(invoice.status) as any}>
                          {getStatusText(invoice.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>
                            {invoice.customer?.name || "عميل غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            تاريخ الاستحقاق:{" "}
                            {new Date(invoice.dueDate).toLocaleDateString(
                              "ar-LY"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{invoice.total.toLocaleString()} د.ل</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            رقم البيع:{" "}
                            {invoice.sale?.id?.slice(-8) || "غير محدد"}
                          </span>
                        </div>
                      </div>

                      {invoice.customer?.company && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {invoice.customer.company}
                        </p>
                      )}

                      {invoice.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ملاحظات: {invoice.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-1">
                      {/* زر عرض الفاتورة السريع */}
                      <QuickInvoiceView
                        saleData={{
                          id: invoice.id,
                          createdAt: invoice.createdAt,
                          status: invoice.status,
                        }}
                        customerData={
                          invoice.customer || {
                            name: "عميل غير محدد",
                            company: "",
                          }
                        }
                        products={[
                          {
                            product: {
                              name: "منتج",
                              description: "وصف المنتج",
                              price: invoice.total,
                              sku: "SKU-001",
                            },
                            quantity: 1,
                            customPrice: invoice.total,
                          },
                        ]}
                        totals={{
                          subtotal: invoice.total,
                          discount: invoice.discount || 0,
                          taxAmount: invoice.tax || 0,
                          total: invoice.total,
                        }}
                        saleConfig={{
                          paymentMethod: "cash",
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
