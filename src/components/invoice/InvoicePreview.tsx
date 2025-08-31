import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  X,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Building,
  Receipt,
  Package,
  User,
  FileText,
  Globe,
  Award,
  Shield,
} from "lucide-react";

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: any;
  customerData: any;
  products: any[];
  totals: any;
  saleConfig: any;
}

export function InvoicePreview({
  isOpen,
  onClose,
  saleData,
  customerData,
  products,
  totals,
  saleConfig,
}: InvoicePreviewProps) {
  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-LY");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("سيتم إضافة ميزة التحميل قريباً");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <Card className="print:shadow-none print:border-0">
          {/* ===== Header ===== */}
          <CardHeader className="print:hidden">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                معاينة الفاتورة
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={handlePrint} variant="outline" size="sm">
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 ml-2" />
                  تحميل
                </Button>
                <Button onClick={onClose} variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* ===== Invoice Content ===== */}
          <CardContent className="p-0">
            <div
              id="invoice-content"
              className="bg-white text-gray-900 p-8 print:p-0"
              style={{ minHeight: "29.7cm", width: "21cm" }}
            >
              {/* ===== Company Header ===== */}
              <div className="flex justify-between items-start mb-8 border-b-4 border-amber-600 pb-6">
                <div className="flex items-center gap-6">
                  {/* Logo */}
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        الفهد
                      </div>
                      <div className="text-xs text-amber-100">ALFAHED</div>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-amber-700">
                      شركة الفهد
                    </h1>
                    <p className="text-lg text-gray-600">
                      للاستشارات الهندسية
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-5xl font-bold text-amber-700 mb-4">
                    فاتورة
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border">
                    <p className="font-semibold text-gray-700">
                      رقم الفاتورة:{" "}
                      <span className="font-bold">
                        {saleData?.id?.slice(-8) || "INV-001"}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-700 mt-2">
                      تاريخ الإصدار: {formatDate(new Date().toISOString())}
                    </p>
                  </div>
                </div>
              </div>

{/* ===== Parties Info (Recipient / Our Company) ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
  {/* Recipient (عميل / شركة / جهة حكومية) */}
  <div>
    <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
      <User className="h-5 w-5 text-amber-600" />
      الجهة المصدّر لها الفاتورة
    </h3>
    <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
      <p className="font-semibold text-base">
        {customerData?.name || "اسم العميل / الشركة / الجهة الحكومية"}
      </p>
      {customerData?.company && <p>🏢 {customerData.company}</p>}
      {customerData?.email && <p>✉ {customerData.email}</p>}
      {customerData?.phone && <p>📞 {customerData.phone}</p>}
      {customerData?.address && <p>📍 {customerData.address}</p>}
    </div>
  </div>

  {/* Our Company */}
  <div>
    <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
      <Building className="h-5 w-5 text-orange-600" />
      شركة الفهد للاستشارات الهندسية
    </h3>
    <div className="space-y-1 text-sm text-gray-700 leading-relaxed">
      <p>📍 طرابلس، ليبيا</p>
      <p>📞 +218 21 XXX XXXX</p>
      <p>✉ info@alfahed.ly</p>
      <p>🌍 www.alfahed.ly</p>
    </div>
  </div>
</div>

                {/* Government */}
                <div className="p-5 border rounded-xl shadow-sm bg-gradient-to-b from-white to-gray-50">
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 border-b pb-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    الجهة الحكومية
                  </h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold">وزارة الاقتصاد والتجارة</p>
                    <p>📍 طرابلس، ليبيا</p>
                    <p>📞 +218 XX XXX XXXX</p>
                    <p>✉ gov@example.ly</p>
                    <p>🕘 الأحد - الخميس</p>
                  </div>
                </div>
              </div>

              {/* ===== Products Table ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  المنتجات والخدمات
                </h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-right">المنتج</th>
                        <th className="px-4 py-3 text-center">الكمية</th>
                        <th className="px-4 py-3 text-center">السعر</th>
                        <th className="px-4 py-3 text-center">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-amber-50"
                          }
                        >
                          {/* ✅ يظهر اسم المنتج المختار */}
                          <td className="px-4 py-3 font-semibold text-gray-800">
                            {item.product?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {(item.customPrice || item.product?.price)?.toLocaleString()}{" "}
                            د.ل
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {(
                              (item.customPrice || item.product?.price) *
                              item.quantity
                            ).toLocaleString()}{" "}
                            د.ل
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===== Totals ===== */}
              <div className="flex justify-end mb-10">
                <div className="w-80 bg-amber-50 p-6 rounded-xl border">
                  <div className="flex justify-between mb-2">
                    <span>المجموع الفرعي:</span>
                    <span>{totals.subtotal.toLocaleString()} د.ل</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>الخصم:</span>
                      <span>-{totals.discount.toLocaleString()} د.ل</span>
                    </div>
                  )}
                  {totals.taxAmount > 0 && (
                    <div className="flex justify-between mb-2 text-amber-700">
                      <span>
                        الضريبة ({saleConfig?.taxRate || 15}%):
                      </span>
                      <span>{totals.taxAmount.toLocaleString()} د.ل</span>
                    </div>
                  )}
                  <div className="border-t mt-3 pt-3 font-bold text-lg text-amber-800 flex justify-between">
                    <span>الإجمالي:</span>
                    <span>{totals.total.toLocaleString()} د.ل</span>
                  </div>
                </div>
              </div>
               {/* ===== Footer ===== */}
<div className="mt-12 border-t pt-6">
  <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
    {/* Logo small */}
    <div className="flex items-center gap-2 mb-4 md:mb-0">
      <img
        src="/company-footer-logo.png"
        alt="Company Logo"
        className="w-10 h-10 object-contain"
      />
      <span className="font-semibold text-gray-700">
        شركة الفهد للاستشارات الهندسية
      </span>
    </div>

    {/* New Tagline */}
    <div className="text-center text-amber-700 font-medium mb-4 md:mb-0 max-w-md">
      منذ عام 2021، تقدم شركة الفهد خدمات استشارية واختبارية هندسية
      بمستوى احترافي في مختلف أنحاء ليبيا.
    </div>

    {/* Contact Info */}
    <div className="text-right space-y-1">
      <p>📍 طرابلس، ليبيا</p>
      <p>📞 +218 21 XXX XXXX</p>
      <p>✉ info@alfahed.ly</p>
      <p>🌍 www.alfahed.ly</p>
    </div>
  </div>
</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}