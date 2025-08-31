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
  Calendar,
  Receipt,
  DollarSign,
  Package,
  User,
  FileText,
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

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ar-LY");

  const handlePrint = () => window.print();
  const handleDownload = () => alert("ميزة التحميل PDF ستضاف قريباً");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <Card className="print:shadow-none print:border-0">
          {/* Header Actions */}
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

          {/* Invoice Content */}
          <CardContent className="p-0">
            <div
              className="bg-white text-gray-900 p-8 print:p-0"
              style={{ minHeight: "29.7cm", width: "21cm" }}
            >
              {/* Header with Logo + Info */}
              <div className="flex justify-between items-start mb-8 border-b-4 border-amber-600 pb-6">
                {/* Company Info */}
                <div className="flex items-center gap-6">
                  <img
                    src="/company-footer-logo.png"
                    alt="logo"
                    className="w-28 h-28 object-contain"
                  />
                  <div>
                    <h1 className="text-5xl font-bold text-amber-700">
                      شركة الفهد
                    </h1>
                    <p className="text-2xl text-amber-600 font-semibold">
                      للاستشارات الهندسية
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-amber-600">
                      <MapPin className="h-4 w-4" />
                      <span>طرابلس، ليبيا</span>
                    </div>
                    <div className="flex items-center gap-6 mt-2 text-sm text-amber-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>+218 21 XXX XXXX</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>info@alfahed.ly</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice Meta */}
                <div className="text-right">
                  <div className="text-6xl font-bold text-amber-700 mb-6">
                    فاتورة
                  </div>
                  <div className="bg-amber-50 p-6 rounded-2xl border">
                    <div className="text-lg mb-3">
                      رقم الفاتورة:{" "}
                      <span className="font-bold text-xl text-amber-700">
                        {saleData?.id?.slice(-8) || "INV-001"}
                      </span>
                    </div>
                    <div className="text-lg">
                      تاريخ الإصدار:{" "}
                      <span className="font-bold text-xl text-amber-700">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Sale Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-amber-50 p-5 rounded-xl border">
                  <h3 className="text-xl font-bold text-amber-800 mb-4">
                    معلومات العميل
                  </h3>
                  <p className="font-bold text-lg">
                    {customerData?.name || "اسم العميل"}
                  </p>
                  {customerData?.company && <p>{customerData.company}</p>}
                  {customerData?.email && <p>{customerData.email}</p>}
                  {customerData?.phone && <p>{customerData.phone}</p>}
                  {customerData?.address && <p>{customerData.address}</p>}
                </div>
                <div className="bg-orange-50 p-5 rounded-xl border">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">
                    تفاصيل البيع
                  </h3>
                  <p>رقم البيع: {saleData?.id?.slice(-8) || "SALE-001"}</p>
                  <p>تاريخ البيع: {formatDate(new Date().toISOString())}</p>
                  <p>طريقة الدفع: {saleConfig?.paymentMethod}</p>
                  {saleConfig?.deliveryDate && (
                    <p>تاريخ التسليم: {formatDate(saleConfig.deliveryDate)}</p>
                  )}
                  <p>شروط الدفع: {saleConfig?.terms}</p>
                </div>
              </div>

              {/* Products Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-amber-700 mb-6">
                  المنتجات والخدمات
                </h3>
                <table className="w-full border">
                  <thead className="bg-amber-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-right">المنتج/الخدمة</th>
                      <th className="px-4 py-3">الكمية</th>
                      <th className="px-4 py-3">السعر</th>
                      <th className="px-4 py-3">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-amber-50" : "bg-white"}
                      >
                        <td className="px-4 py-3">{item.product.name}</td>
                        <td className="px-4 py-3 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(item.customPrice || item.product.price).toLocaleString()}{" "}
                          د.ل
                        </td>
                        <td className="px-4 py-3 text-center">
                          {(
                            (item.customPrice || item.product.price) *
                            item.quantity
                          ).toLocaleString()}{" "}
                          د.ل
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-96 bg-amber-50 p-6 rounded-xl border">
                  <p className="flex justify-between">
                    <span>المجموع الفرعي:</span>
                    <span>{totals.subtotal.toLocaleString()} د.ل</span>
                  </p>
                  {totals.discount > 0 && (
                    <p className="flex justify-between text-green-600">
                      <span>الخصم:</span>
                      <span>-{totals.discount.toLocaleString()} د.ل</span>
                    </p>
                  )}
                  {totals.taxAmount > 0 && (
                    <p className="flex justify-between text-amber-700">
                      <span>الضريبة:</span>
                      <span>{totals.taxAmount.toLocaleString()} د.ل</span>
                    </p>
                  )}
                  <div className="border-t mt-3 pt-3 font-bold text-xl text-amber-800 flex justify-between">
                    <span>الإجمالي:</span>
                    <span>{totals.total.toLocaleString()} د.ل</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {saleConfig?.notes && (
                <div className="mb-6">
                  <h4 className="font-bold text-amber-800 mb-2">ملاحظات:</h4>
                  <p className="bg-amber-100 p-3 rounded">{saleConfig.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="mt-12 border-t-4 border-amber-300 pt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Logo + Motto */}
                  <div className="flex items-center gap-4">
                    <img
                      src="/company-footer-logo.png"
                      alt="Company Logo"
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-amber-800 font-bold text-lg leading-relaxed">
                      شركة الفهد للاستشارات الهندسية
                      <div className="text-sm text-amber-600">
                        الجودة والتميز في كل مشروع
                      </div>
                    </div>
                  </div>
                  {/* Contact */}
                  <div className="text-right text-amber-700">
                    <p>طرابلس، ليبيا</p>
                    <p>📞 +218 21 XXX XXXX</p>
                    <p>✉ info@alfahed.ly</p>
                    <p>🌍 www.alfahed.ly</p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full shadow-lg">
                    شكراً لثقتكم بنا
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