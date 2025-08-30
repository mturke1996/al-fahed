import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { database } from "@/lib/database";
import { QuickInvoiceView } from "../invoice/QuickInvoiceView";
import { Receipt, Eye, Calendar, User, DollarSign } from "lucide-react";

export function LatestInvoices() {
  const [recentSales, setRecentSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecentSales();
  }, []);

  const loadRecentSales = async () => {
    try {
      setIsLoading(true);
      const sales = await database.getSales();
      const recent = sales
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);
      setRecentSales(recent);
    } catch (error) {
      console.error("Error loading recent sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            آخر الفواتير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري التحميل...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          آخر الفواتير
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSales.map((sale) => (
            <div
              key={sale.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    فاتورة #{sale.id.slice(-6)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(sale.createdAt).toLocaleDateString("ar-LY")}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {sale.customer?.name || "عميل غير محدد"}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(sale.status)}`}
                >
                  {getStatusText(sale.status)}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-semibold text-foreground">
                    {sale.finalTotal.toLocaleString()} د.ل
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <QuickInvoiceView
                  saleData={{
                    id: sale.id,
                    createdAt: sale.createdAt,
                    status: sale.status,
                  }}
                  customerData={sale.customer}
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
                    paymentMethod: "cash",
                    taxRate: 15,
                    terms: "30 days",
                  }}
                  className="flex-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                >
                  <Eye className="h-4 w-4 ml-2" />
                  عرض الفاتورة
                </QuickInvoiceView>
              </div>
            </div>
          ))}
        </div>

        {recentSales.length === 0 && (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">لا توجد فواتير حديثة</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
