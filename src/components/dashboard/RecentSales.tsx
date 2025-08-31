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
import { Eye, FileText, DollarSign, Calendar, User } from "lucide-react";
import { database, Sale } from "@/lib/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { InvoicePreview } from "../invoice/InvoicePreview";

export function RecentSales() {
  const isMobile = useIsMobile();
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const loadSales = async () => {
      const salesData = await database.getSales();
      setSales(salesData.slice(0, 5)); // عرض آخر 5 مبيعات فقط
    };
    loadSales();
  }, []);

  const openInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle
            className={`text-primary flex items-center gap-2 ${
              isMobile ? "text-lg" : "text-xl"
            }`}
          >
            <DollarSign className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} />
            المبيعات الأخيرة
          </CardTitle>
          <CardDescription className={isMobile ? "text-sm" : "text-base"}>
            آخر العمليات التي تمت في النظام
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`space-y-4 ${isMobile ? "space-y-3" : "space-y-4"}`}
        >
          {sales.length === 0 ? (
            <div
              className={`text-center py-8 text-muted-foreground ${
                isMobile ? "py-6" : "py-8"
              }`}
            >
              لا توجد مبيعات حديثة
            </div>
          ) : (
            sales.map((sale) => (
              <div
                key={sale.id}
                className={`rounded-lg border border-border hover:bg-accent transition-all duration-200 ${
                  isMobile ? "p-3" : "p-4"
                }`}
              >
                {/* Header with ID and Status */}
                <div
                  className={`flex items-center justify-between mb-3 ${
                    isMobile ? "mb-2" : "mb-3"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold text-primary ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      #{sale.id.slice(-6)}
                    </span>
                    <Badge
                      variant={
                        sale.status === "completed"
                          ? "default"
                          : sale.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={isMobile ? "text-xs px-2 py-1" : "text-xs"}
                    >
                      {sale.status === "completed"
                        ? "مكتملة"
                        : sale.status === "pending"
                        ? "قيد المعالجة"
                        : "ملغية"}
                    </Badge>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${isMobile ? "px-2 py-1" : ""}`}
                  >
                    {sale.paymentMethod === "cash"
                      ? "نقدي"
                      : sale.paymentMethod === "card"
                      ? "بطاقة"
                      : "تحويل"}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className={`mb-3 ${isMobile ? "mb-2" : "mb-3"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <User
                      className={`text-muted-foreground ${
                        isMobile ? "h-3 w-3" : "h-4 w-4"
                      }`}
                    />
                    <span
                      className={`font-medium text-foreground ${
                        isMobile ? "text-sm" : "text-base"
                      }`}
                    >
                      {sale.customer?.name || "عميل غير محدد"}
                    </span>
                  </div>
                  {sale.customer?.company && (
                    <p
                      className={`text-muted-foreground ${
                        isMobile ? "text-xs" : "text-sm"
                      } mr-6`}
                    >
                      {sale.customer.company}
                    </p>
                  )}
                </div>

                {/* Date and Items */}
                <div
                  className={`flex items-center justify-between mb-3 ${
                    isMobile ? "mb-2" : "mb-3"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar
                      className={`text-muted-foreground ${
                        isMobile ? "h-3 w-3" : "h-4 w-4"
                      }`}
                    />
                    <span
                      className={`text-muted-foreground ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {new Date(sale.createdAt).toLocaleDateString("ar-LY")}
                    </span>
                  </div>
                  <div
                    className={`text-muted-foreground ${
                      isMobile ? "text-xs" : "text-sm"
                    }`}
                  >
                    {sale.items?.length || 0} صنف
                  </div>
                </div>

                {/* Total and Actions */}
                <div
                  className={`flex items-center justify-between ${
                    isMobile ? "flex-col items-start gap-2" : ""
                  }`}
                >
                  <div className="text-right">
                    <p
                      className={`font-bold text-primary ${
                        isMobile ? "text-lg" : "text-xl"
                      }`}
                    >
                      {sale.finalTotal.toLocaleString()} د.ل
                    </p>
                    <p
                      className={`text-muted-foreground ${
                        isMobile ? "text-xs" : "text-sm"
                      }`}
                    >
                      {formatDistanceToNow(sale.createdAt, {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </p>
                  </div>

                  <Button
                    size={isMobile ? "sm" : "default"}
                    variant="outline"
                    onClick={() => openInvoice(sale)}
                    className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                  >
                    <Eye
                      className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} ml-1`}
                    />
                    {isMobile ? "عرض الفاتورة" : "عرض الفاتورة"}
                  </Button>
                </div>
              </div>
            ))
          )}

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              <FileText
                className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} ml-2`}
              />
              عرض جميع المبيعات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Preview using InvoicePreview component */}
      {selectedSale && (
        <InvoicePreview
          isOpen={showInvoice}
          onClose={() => {
            setShowInvoice(false);
            setSelectedSale(null);
          }}
          saleData={{
            id: selectedSale.id,
            date: selectedSale.createdAt.toISOString(),
            customerId: selectedSale.customerId,
            status: selectedSale.status,
          }}
          customerData={selectedSale.customer!}
          products={
            selectedSale.items?.map((item) => ({
              product: item.product!,
              quantity: item.quantity,
              customPrice: item.price,
            })) || []
          }
          totals={{
            subtotal: selectedSale.total,
            discount: selectedSale.discount,
            taxAmount:
              selectedSale.finalTotal -
              selectedSale.total +
              selectedSale.discount,
            total: selectedSale.finalTotal,
          }}
          saleConfig={{
            taxRate: 15,
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
    </>
  );
}
