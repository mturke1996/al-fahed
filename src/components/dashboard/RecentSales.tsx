import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Eye, FileText, DollarSign } from "lucide-react";
import { database, Sale } from "@/lib/database";
import { QuickInvoiceView } from "@/components/invoice/QuickInvoiceView";

export function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const loadSales = async () => {
      const salesData = await database.getSales();
      setSales(salesData.slice(0, 5)); // عرض آخر 5 مبيعات فقط
    };
    loadSales();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          المبيعات الأخيرة
        </CardTitle>
        <CardDescription>آخر العمليات التي تمت في النظام</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد مبيعات حديثة
          </div>
        ) : (
          sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-all duration-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-primary">{sale.id}</span>
                  <Badge
                    variant={
                      sale.status === "completed"
                        ? "default"
                        : sale.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {sale.status === "completed"
                      ? "مكتملة"
                      : sale.status === "pending"
                      ? "قيد المعالجة"
                      : "ملغية"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {sale.paymentMethod === "cash"
                      ? "نقدي"
                      : sale.paymentMethod === "card"
                      ? "بطاقة"
                      : "تحويل"}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {sale.customerName}
                </p>
                {sale.customerPhone && (
                  <p className="text-xs text-muted-foreground">
                    {sale.customerPhone}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(sale.createdAt, {
                    addSuffix: true,
                    locale: ar,
                  })}
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  {sale.items.length} صنف
                </div>
              </div>
              <div className="text-left space-y-2">
                <p className="font-bold text-lg text-primary">
                  {sale.finalTotal.toFixed(2)} د.ل
                </p>
                <QuickInvoiceView
                  saleData={{
                    id: sale.id,
                    createdAt: sale.createdAt,
                    status: sale.status,
                  }}
                  customerData={{
                    name: sale.customerName,
                    company: sale.customerCompany || "",
                  }}
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
                    taxAmount: 0,
                    total: sale.finalTotal,
                  }}
                  saleConfig={{
                    paymentMethod: sale.paymentMethod,
                    taxRate: 15,
                    terms: "30 days",
                  }}
                  className="w-full bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  عرض الفاتورة
                </QuickInvoiceView>
              </div>
            </div>
          ))
        )}

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            عرض جميع المبيعات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
