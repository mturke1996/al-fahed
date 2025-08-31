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

// تعريف أنواع البيانات
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface SaleItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

interface Customer {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface SaleData {
  id: string;
  date: string;
  customerId: string;
  status: string;
}

interface Totals {
  subtotal: number;
  discount: number;
  taxAmount: number;
  total: number;
}

interface SaleConfig {
  taxRate: number;
  currency: string;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

interface InvoicePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  saleData: SaleData;
  customerData: Customer;
  products: SaleItem[];
  totals: Totals;
  saleConfig: SaleConfig;
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
    try {
      // فحص شامل للتاريخ
      if (
        !date ||
        date === "Invalid Date" ||
        date === "undefined" ||
        date === "null"
      ) {
        return new Date().toLocaleDateString("ar-LY");
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return new Date().toLocaleDateString("ar-LY");
      }

      return parsedDate.toLocaleDateString("ar-LY");
    } catch (error) {
      return new Date().toLocaleDateString("ar-LY");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    try {
      // إنشاء ملف HTML قابل للتحميل
      const invoiceContent = document.getElementById("invoice-content");
      if (invoiceContent) {
        const htmlContent = `
          <!DOCTYPE html>
          <html dir="rtl">
          <head>
            <meta charset="UTF-8">
            <title>فاتورة - شركة الفهد</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                direction: rtl;
                margin: 20px;
                background: white;
              }
              .invoice-content {
                max-width: 800px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: right;
              }
              th {
                background-color: #f8f9fa;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            ${invoiceContent.outerHTML}
          </body>
          </html>
        `;

        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `فاتورة-${saleData?.id || "INV-001"}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert("حدث خطأ في التحميل: " + error.message);
    }
  };

  // التحقق من وجود البيانات
  if (!saleData || !customerData || !products || !totals) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">خطأ في البيانات</p>
            <Button onClick={onClose}>إغلاق</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {/* ===== Simple Professional Header ===== */}
              <div className="mb-10">
                {/* Company Logo, Name and Invoice Title */}
                <div className="flex items-center justify-between mb-8">
                  {/* Company Logo and Name */}
                  <div className="flex items-center gap-4">
                    <img
                      src="/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png"
                      alt="شركة الفهد"
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h1 className="text-2xl font-bold text-amber-600 mb-1">
                        شركة الفهد للاستشارة الهندسية
                      </h1>
                      <p className="text-base text-gray-600">
                        ALFAHED Engineering Consultancy
                      </p>
                    </div>
                  </div>

                  {/* Invoice Title on the right */}
                  <h2 className="text-3xl font-bold text-amber-600">فاتورة</h2>
                </div>

                {/* Divider Line */}
                <div className="border-t-2 border-amber-200 mb-8"></div>

                {/* Customer Info and Invoice Details Row */}
                <div className="flex justify-between items-start">
                  {/* Right Side - Customer Info */}
                  <div className="flex-1 mr-8">
                    <div className="space-y-3">
                      <p className="text-xl font-bold text-gray-800">
                        {customerData?.name ||
                          "اسم العميل / الشركة / الجهة الحكومية"}
                      </p>
                      {customerData?.company && (
                        <p className="text-sm text-gray-600">
                          {customerData.company}
                        </p>
                      )}
                      {customerData?.email && (
                        <p className="text-xs text-gray-600">
                          ✉ {customerData.email}
                        </p>
                      )}
                      {customerData?.phone && (
                        <p className="text-xs text-gray-600">
                          📞 {customerData.phone}
                        </p>
                      )}
                      {customerData?.address && (
                        <p className="text-xs text-gray-600">
                          📍 {customerData.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Left Side - Invoice Details */}
                  <div className="text-right">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-28 text-left">
                          رقم الفاتورة:
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                          {saleData?.id?.slice(-8) || "INV-001"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 w-28 text-left">
                          التاريخ:
                        </span>
                        <span className="text-lg font-semibold text-gray-800">
                          {(() => {
                            const formattedDate = formatDate(saleData.date);
                            return formattedDate;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Products Table ===== */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-amber-700 mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" />
                  المنتجات والخدمات
                </h3>
                <div className="border rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                      <tr>
                        <th className="px-4 py-4 text-right font-bold">
                          المنتج
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          الكمية
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          السعر
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          الإجمالي
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products && products.length > 0 ? (
                        products.map((item, index) => {
                          // فحص البيانات وعرض معلومات التصحيح
                          return (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-amber-50"
                              }
                            >
                              <td className="px-4 py-4 font-semibold text-gray-800">
                                {item.product?.name || `منتج رقم ${index + 1}`}
                              </td>
                              <td className="px-4 py-4 text-center">
                                {item.quantity || 1}
                              </td>
                              <td className="px-4 py-4 text-center">
                                {(
                                  item.customPrice ||
                                  item.product?.price ||
                                  0
                                ).toLocaleString()}{" "}
                                د.ل
                              </td>
                              <td className="px-4 py-4 text-center font-bold text-amber-700">
                                {(
                                  (item.customPrice ||
                                    item.product?.price ||
                                    0) * (item.quantity || 1)
                                ).toLocaleString()}{" "}
                                د.ل
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            لا توجد منتجات في هذه الفاتورة
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ===== Totals ===== */}
              <div className="flex justify-end mb-6">
                <div className="w-80">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-700">
                        المجموع الفرعي:
                      </span>
                      <span className="font-bold text-gray-800">
                        {(totals.subtotal || 0).toLocaleString()} د.ل
                      </span>
                    </div>
                    {(totals.discount || 0) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-semibold">الخصم:</span>
                        <span className="font-bold">
                          -{(totals.discount || 0).toLocaleString()} د.ل
                        </span>
                      </div>
                    )}
                    {(totals.taxAmount || 0) > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span className="font-semibold">
                          الضريبة ({saleConfig?.taxRate || 15}%):
                        </span>
                        <span className="font-bold">
                          {(totals.taxAmount || 0).toLocaleString()} د.ل
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-xl font-bold text-amber-800">
                        <span>الإجمالي:</span>
                        <span>{(totals.total || 0).toLocaleString()} د.ل</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Signature ===== */}
              <div className="flex justify-end mb-10">
                <div className="w-80 text-center">
                  <div className="h-20 border-b-2 border-gray-300 border-dashed mb-2"></div>
                  <p className="text-sm text-gray-600">التوقيع</p>
                </div>
              </div>

              {/* ===== Simple Professional Footer ===== */}
              <div className="mt-12 border-t-2 border-gray-200 pt-8">
                <div className="flex flex-col items-center">
                  {/* Company Logo and Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src="/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png"
                      alt="شركة الفهد"
                      className="w-10 h-10 object-contain"
                    />
                    <div className="text-center">
                      <h3 className="text-base font-bold text-amber-700">
                        {saleConfig?.companyInfo?.name ||
                          "شركة الفهد للاستشارات الهندسية"}
                      </h3>
                      <p className="text-xs text-gray-600">
                        ALFAHED Engineering Consultancy
                      </p>
                    </div>
                  </div>

                  {/* Simple Contact Info */}
                  <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600 mb-4">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-amber-500" />
                      {saleConfig?.companyInfo?.address || "طرابلس، ليبيا"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-amber-500" />
                      {saleConfig?.companyInfo?.phone || "+218 910526323"}
                    </span>
                    <span className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-amber-500" />
                      {saleConfig?.companyInfo?.email || "info@alfahed.ly"}
                    </span>
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
