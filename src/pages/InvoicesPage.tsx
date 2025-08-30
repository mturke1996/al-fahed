import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { database, Invoice, Sale, Customer, Product } from "../lib/database";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Search,
  FileText,
  DollarSign,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  Receipt,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
  });

  // نموذج إنشاء فاتورة جديدة
  const [newInvoice, setNewInvoice] = useState({
    saleId: "",
    customerId: "",
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    status: "pending" as "paid" | "pending" | "overdue",
    dueDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // عناصر الفاتورة
  const [invoiceItems, setInvoiceItems] = useState<
    Array<{
      productId: string;
      quantity: number;
      price: number;
      total: number;
    }>
  >([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, salesData, customersData, productsData] =
        await Promise.all([
          database.getInvoices(),
          database.getSales(),
          database.getCustomers(),
          database.getProducts(),
        ]);

      setInvoices(invoicesData);
      setSales(salesData);
      setCustomers(customersData);
      setProducts(productsData);

      // حساب الإحصائيات
      const totalInvoices = invoicesData.length;
      const totalAmount = invoicesData.reduce(
        (sum, invoice) => sum + invoice.total,
        0
      );
      const paidInvoices = invoicesData.filter(
        (invoice) => invoice.status === "paid"
      ).length;
      const pendingInvoices = invoicesData.filter(
        (invoice) => invoice.status === "pending"
      ).length;

      setStats({
        totalInvoices,
        totalAmount,
        paidInvoices,
        pendingInvoices,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const addItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      {
        productId: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setInvoiceItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };

      // حساب الإجمالي
      if (field === "quantity" || field === "price") {
        newItems[index].total =
          newItems[index].quantity * newItems[index].price;
      }

      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.05; // 5% ضريبة
    const discount = 0; // يمكن إضافة خصم لاحقاً
    const total = subtotal + tax - discount;

    return { subtotal, tax, discount, total };
  };

  const createInvoice = async () => {
    if (
      !newInvoice.saleId ||
      !newInvoice.customerId ||
      invoiceItems.length === 0
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    try {
      const { subtotal, tax, discount, total } = calculateTotals();

      const invoice = await database.addInvoice({
        invoiceNumber: `INV-${Date.now()}`,
        saleId: newInvoice.saleId,
        customerId: newInvoice.customerId,
        subtotal,
        tax,
        discount,
        total,
        status: newInvoice.status,
        dueDate: new Date(newInvoice.dueDate),
        notes: newInvoice.notes,
      });

      if (invoice) {
        setShowCreateInvoice(false);
        setNewInvoice({
          saleId: "",
          customerId: "",
          subtotal: 0,
          tax: 0,
          discount: 0,
          total: 0,
          status: "pending",
          dueDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setInvoiceItems([]);
        loadData();
        alert("تم إنشاء الفاتورة بنجاح");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("حدث خطأ أثناء إنشاء الفاتورة");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return "✓";
      case "pending":
        return "⏳";
      case "overdue":
        return "⚠";
      default:
        return "•";
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              إدارة الفواتير
            </h1>
            <p className="text-muted-foreground">
              إنشاء وإدارة فواتير المبيعات
            </p>
          </div>
          <Button onClick={() => setShowCreateInvoice(true)}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء فاتورة
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الفواتير
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">فاتورة</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المبالغ
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الفواتير المدفوعة
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidInvoices}</div>
              <p className="text-xs text-muted-foreground">فاتورة مدفوعة</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                الفواتير المعلقة
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
              <p className="text-xs text-muted-foreground">فاتورة معلقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="البحث في الفواتير..."
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
                  <SelectItem value="paid">مدفوع</SelectItem>
                  <SelectItem value="pending">قيد الانتظار</SelectItem>
                  <SelectItem value="overdue">متأخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoices">قائمة الفواتير</TabsTrigger>
            <TabsTrigger value="create">إنشاء فاتورة</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            {/* Invoices List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة الفواتير</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {invoice.invoiceNumber}
                          </h3>
                          <Badge
                            variant={getStatusColor(invoice.status) as any}
                          >
                            {getStatusIcon(invoice.status)}{" "}
                            {getStatusText(invoice.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {invoice.customer?.name || "عميل غير محدد"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          تاريخ الاستحقاق:{" "}
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "ar-LY"
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-right">
                          <div className="font-semibold text-foreground">
                            {invoice.total.toLocaleString()} د.ل
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(invoice.createdAt).toLocaleDateString(
                              "ar-LY"
                            )}
                          </div>
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
                            <Eye className="h-3 w-3 ml-1" />
                            عرض
                          </QuickInvoiceView>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            {/* Create Invoice Form */}
            <Card>
              <CardHeader>
                <CardTitle>إنشاء فاتورة جديدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">اختيار البيع</label>
                    <Select
                      value={newInvoice.saleId}
                      onValueChange={(value) =>
                        setNewInvoice({ ...newInvoice, saleId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البيع" />
                      </SelectTrigger>
                      <SelectContent>
                        {sales.map((sale) => (
                          <SelectItem key={sale.id} value={sale.id}>
                            {sale.customer?.name || "عميل غير محدد"} -{" "}
                            {sale.finalTotal.toLocaleString()} د.ل
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">اختيار العميل</label>
                    <Select
                      value={newInvoice.customerId}
                      onValueChange={(value) =>
                        setNewInvoice({ ...newInvoice, customerId: value })
                      }
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
                  <div>
                    <label className="text-sm font-medium">
                      تاريخ الاستحقاق
                    </label>
                    <Input
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          dueDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">الحالة</label>
                    <Select
                      value={newInvoice.status}
                      onValueChange={(value: any) =>
                        setNewInvoice({ ...newInvoice, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="paid">مدفوع</SelectItem>
                        <SelectItem value="overdue">متأخر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">الملاحظات</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newInvoice.notes}
                    onChange={(e) =>
                      setNewInvoice({ ...newInvoice, notes: e.target.value })
                    }
                    placeholder="ملاحظات الفاتورة..."
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">
                      عناصر الفاتورة
                    </h3>
                    <Button size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 ml-1" />
                      إضافة عنصر
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {invoiceItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 border rounded-lg"
                      >
                        <Select
                          value={item.productId}
                          onValueChange={(value) => {
                            const product = products.find(
                              (p) => p.id === value
                            );
                            updateItem(index, "productId", value);
                            if (product) {
                              updateItem(index, "price", product.price);
                            }
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="اختر المنتج" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} -{" "}
                                {product.price.toLocaleString()} د.ل
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20"
                          placeholder="الكمية"
                        />
                        <Input
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-24"
                          placeholder="السعر"
                        />
                        <div className="w-20 text-center font-medium">
                          {item.total.toLocaleString()} د.ل
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>المجموع الفرعي:</span>
                      <span>
                        {calculateTotals().subtotal.toLocaleString()} د.ل
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>الضريبة (5%):</span>
                      <span>{calculateTotals().tax.toLocaleString()} د.ل</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الخصم:</span>
                      <span>
                        {calculateTotals().discount.toLocaleString()} د.ل
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>الإجمالي:</span>
                      <span>
                        {calculateTotals().total.toLocaleString()} د.ل
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateInvoice(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={createInvoice}>إنشاء الفاتورة</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Invoice Modal */}
        {showCreateInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>إنشاء فاتورة جديدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Modal content would be the same as the create tab */}
                <p className="text-muted-foreground">
                  سيتم إضافة نموذج إنشاء الفاتورة هنا...
                </p>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateInvoice(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
