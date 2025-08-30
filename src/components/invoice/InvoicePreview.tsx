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
  Globe,
  CreditCard,
  Clock,
  Star,
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "cash":
        return "نقدي";
      case "card":
        return "بطاقة";
      case "transfer":
        return "تحويل";
      case "check":
        return "شيك";
      default:
        return method;
    }
  };

  const getTermsText = (terms: string) => {
    switch (terms) {
      case "immediate":
        return "فوري";
      case "7 days":
        return "7 أيام";
      case "15 days":
        return "15 يوم";
      case "30 days":
        return "30 يوم";
      case "60 days":
        return "60 يوم";
      default:
        return terms;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // يمكن إضافة منطق التحميل هنا
    alert("سيتم إضافة ميزة التحميل قريباً");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <Card className="print:shadow-none print:border-0">
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

          <CardContent className="p-0">
            {/* Invoice Content - A4 Size with Professional Design */}
            <div
              className="bg-white text-gray-900 p-8 print:p-0"
              style={{ minHeight: "29.7cm", width: "21cm" }}
            >
              {/* Header with Company Logo */}
              <div className="flex justify-between items-start mb-8 border-b-4 border-amber-600 pb-6">
                <div className="flex items-center gap-6">
                  {/* Company Logo - تصميم مشابه للشعار الراقي */}
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-amber-300 relative overflow-hidden">
                      {/* خلفية متدرجة */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-300/20 to-orange-400/20"></div>

                      {/* تصميم الفهد */}
                      <div className="relative z-10 text-center">
                        <div className="text-4xl font-bold text-white mb-1 drop-shadow-lg">
                          الفهد
                        </div>
                        <div className="text-sm text-amber-100 font-semibold tracking-wide">
                          ALFAHED
                        </div>
                        <div className="text-xs text-amber-200 font-medium">
                          ENGINEERING
                        </div>
                      </div>

                      {/* لمسات سحرية */}
                      <div className="absolute top-2 right-2 w-3 h-3 bg-amber-200 rounded-full opacity-60"></div>
                      <div className="absolute bottom-3 left-3 w-2 h-2 bg-orange-300 rounded-full opacity-50"></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                      شركة الفهد
                    </h1>
                    <p className="text-2xl text-amber-700 font-semibold">
                      للاستشارات الهندسية
                    </p>
                    <div className="flex items-center gap-3 text-sm text-amber-600 mt-3">
                      <MapPin className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">طرابلس، ليبيا</span>
                    </div>
                    <div className="flex items-center gap-6 mt-3 text-sm text-amber-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">+218 21 XXX XXXX</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">info@alfahed.ly</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-6xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                    فاتورة
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-6 rounded-2xl border-2 border-amber-300 shadow-xl">
                    <div className="text-lg text-amber-800 mb-3 font-semibold">
                      رقم الفاتورة:{" "}
                      <span className="font-bold text-xl text-amber-700">
                        {saleData?.id?.slice(-8) || "INV-001"}
                      </span>
                    </div>
                    <div className="text-lg text-amber-800 font-semibold">
                      تاريخ الإصدار:{" "}
                      <span className="font-bold text-xl text-amber-700">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Sale Info with Enhanced Design */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-xl border-2 border-amber-200 shadow-lg">
                  <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    معلومات العميل
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="font-bold text-xl text-amber-800">
                        {customerData?.name || "اسم العميل"}
                      </span>
                    </div>
                    {customerData?.company && (
                      <div className="flex items-center gap-3 text-amber-700">
                        <Building className="h-5 w-5 text-amber-600" />
                        <span className="font-semibold text-lg">
                          {customerData.company}
                        </span>
                      </div>
                    )}
                    {customerData?.email && (
                      <div className="flex items-center gap-3 text-amber-700">
                        <Mail className="h-5 w-5 text-amber-600" />
                        <span>{customerData.email}</span>
                      </div>
                    )}
                    {customerData?.phone && (
                      <div className="flex items-center gap-2 text-amber-700">
                        <Phone className="h-4 w-4" />
                        <span>{customerData.phone}</span>
                      </div>
                    )}
                    {customerData?.address && (
                      <div className="flex items-center gap-2 text-amber-700">
                        <MapPin className="h-4 w-4" />
                        <span>{customerData.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-xl border-2 border-orange-200 shadow-lg">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    تفاصيل البيع
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">
                        رقم البيع:
                      </span>
                      <span className="font-bold text-lg text-orange-800">
                        {saleData?.id?.slice(-8) || "SALE-001"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">
                        تاريخ البيع:
                      </span>
                      <span className="font-bold text-lg text-orange-800">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">
                        طريقة الدفع:
                      </span>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-3 py-1">
                        {getPaymentMethodText(saleConfig?.paymentMethod)}
                      </Badge>
                    </div>
                    {saleConfig?.deliveryDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700 font-semibold">
                          تاريخ التسليم:
                        </span>
                        <span className="font-bold text-lg text-orange-800">
                          {formatDate(saleConfig.deliveryDate)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-orange-700 font-semibold">
                        شروط الدفع:
                      </span>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1">
                        {getTermsText(saleConfig?.terms)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Table with Professional Design */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-amber-700 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  المنتجات والخدمات
                </h3>
                <div className="border-2 border-amber-300 rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-amber-600 to-orange-600">
                      <tr>
                        <th className="px-6 py-5 text-right text-base font-bold text-white border-b border-amber-500">
                          المنتج/الخدمة
                        </th>
                        <th className="px-6 py-5 text-center text-base font-bold text-white border-b border-amber-500">
                          الكمية
                        </th>
                        <th className="px-6 py-5 text-center text-base font-bold text-white border-b border-amber-500">
                          السعر
                        </th>
                        <th className="px-6 py-5 text-center text-base font-bold text-white border-b border-amber-500">
                          الإجمالي
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-amber-50" : "bg-white"
                          }
                        >
                          <td className="px-6 py-5 text-sm text-gray-800 border-b border-amber-200">
                            <div>
                              <div className="font-bold text-lg text-amber-800 mb-2">
                                {item.product.name}
                              </div>
                              {item.product.description && (
                                <div className="text-sm text-amber-600 mb-1">
                                  {item.product.description}
                                </div>
                              )}
                              {item.product.sku && (
                                <div className="text-xs text-amber-500 font-mono bg-amber-100 px-2 py-1 rounded">
                                  SKU: {item.product.sku}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center text-lg font-bold text-amber-800 border-b border-amber-200">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-5 text-center text-lg font-bold text-amber-800 border-b border-amber-200">
                            {(
                              item.customPrice || item.product.price
                            ).toLocaleString()}{" "}
                            د.ل
                          </td>
                          <td className="px-6 py-5 text-center text-lg font-bold text-amber-800 border-b border-amber-200">
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
              </div>

              {/* Totals with Enhanced Design */}
              <div className="flex justify-end mb-8">
                <div className="w-96 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 p-8 rounded-2xl border-2 border-amber-300 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 font-semibold text-lg">
                        المجموع الفرعي:
                      </span>
                      <span className="font-bold text-amber-800 text-xl">
                        {totals.subtotal.toLocaleString()} د.ل
                      </span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-green-600 font-semibold text-lg">
                          الخصم:
                        </span>
                        <span className="font-bold text-green-600 text-xl">
                          -{totals.discount.toLocaleString()} د.ل
                        </span>
                      </div>
                    )}
                    {totals.taxAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-amber-600 font-semibold text-lg">
                          الضريبة ({saleConfig?.taxRate || 15}%):
                        </span>
                        <span className="font-bold text-amber-600 text-xl">
                          {totals.taxAmount.toLocaleString()} د.ل
                        </span>
                      </div>
                    )}
                    <div className="border-t-2 border-amber-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-3xl font-bold text-amber-800">
                          الإجمالي:
                        </span>
                        <span className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          {totals.total.toLocaleString()} د.ل
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Terms with Professional Design */}
              {saleConfig?.notes && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    ملاحظات:
                  </h4>
                  <div className="bg-amber-100 p-4 rounded-xl border border-amber-200">
                    <p className="text-amber-800">{saleConfig.notes}</p>
                  </div>
                </div>
              )}

              {/* Signature Section */}
              <div className="mb-8 flex justify-between items-end">
                <div className="w-56">
                  <div className="border-t-3 border-amber-500 pt-3">
                    <p className="text-base font-semibold text-amber-700 text-center">
                      التوقيع
                    </p>
                    <p className="text-sm text-amber-600 text-center mt-1">
                      العميل
                    </p>
                  </div>
                </div>
                <div className="w-56">
                  <div className="border-t-3 border-amber-500 pt-3">
                    <p className="text-base font-semibold text-amber-700 text-center">
                      ختم الشركة
                    </p>
                    <p className="text-sm text-amber-600 text-center mt-1">
                      شركة الفهد
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer with Company Information */}
              <div className="border-t-4 border-amber-300 pt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border-2 border-amber-200 shadow-lg">
                    <h4 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      معلومات الشركة
                    </h4>
                    <div className="space-y-3 text-amber-700">
                      <div className="font-bold text-lg">
                        شركة الفهد للاستشارات الهندسية
                      </div>
                      <div className="font-medium">طرابلس، ليبيا</div>
                      <div className="font-medium">هاتف: +218 21 XXX XXXX</div>
                      <div className="font-medium">
                        بريد إلكتروني: info@alfahed.ly
                      </div>
                      <div className="font-medium">
                        موقع إلكتروني: www.alfahed.ly
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 shadow-lg">
                      <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-3 justify-end">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        شكراً لتعاملكم معنا
                      </h4>
                      <div className="text-orange-700 space-y-2">
                        <div className="font-medium">
                          نحن نقدر ثقتكم ونعمل على تقديم
                        </div>
                        <div className="font-medium">
                          أفضل الخدمات والمنتجات
                        </div>
                        <div className="mt-3 text-base font-semibold">
                          مع ضمان الجودة والموثوقية
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Motto */}
                <div className="text-center mt-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full shadow-xl">
                    <Award className="h-6 w-6" />
                    <span className="font-bold text-lg">
                      الجودة والتميز في كل مشروع
                    </span>
                    <Shield className="h-6 w-6" />
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
