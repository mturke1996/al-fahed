
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, Building2, Phone, Mail, Calendar } from "lucide-react"

interface SalesFormProps {
  clientName: string
  setClientName: (name: string) => void
  clientCompany: string
  setClientCompany: (company: string) => void
  clientPhone: string
  setClientPhone: (phone: string) => void
  clientEmail: string
  setClientEmail: (email: string) => void
  notes: string
  setNotes: (notes: string) => void
  paymentMethod: string
  setPaymentMethod: (method: string) => void
}

export function SalesForm({
  clientName,
  setClientName,
  clientCompany,
  setClientCompany,
  clientPhone,
  setClientPhone,
  clientEmail,
  setClientEmail,
  notes,
  setNotes,
  paymentMethod,
  setPaymentMethod
}: SalesFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Client Information */}
      <Card className="card-brand animate-slide-in-right">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-stone-800 text-lg sm:text-xl">
            <User className="h-5 w-5 text-brand-accent" />
            معلومات العميل
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            أدخل المعلومات الأساسية للعميل
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4" />
                اسم العميل *
              </Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="أدخل اسم العميل"
                className="text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="flex items-center gap-2 text-sm sm:text-base">
                <Phone className="h-4 w-4" />
                رقم الهاتف
              </Label>
              <Input
                id="clientPhone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="أدخل رقم الهاتف"
                className="text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientCompany" className="flex items-center gap-2 text-sm sm:text-base">
                <Building2 className="h-4 w-4" />
                الشركة (اختياري)
              </Label>
              <Input
                id="clientCompany"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="أدخل اسم الشركة"
                className="text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="flex items-center gap-2 text-sm sm:text-base">
                <Mail className="h-4 w-4" />
                البريد الإلكتروني
              </Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                className="text-sm sm:text-base h-10 sm:h-12"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sale Details */}
      <Card className="card-brand animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-stone-800 text-lg sm:text-xl">
            <ShoppingCart className="h-5 w-5 text-brand-accent" />
            تفاصيل المبيعة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-sm sm:text-base">طريقة الدفع</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-10 sm:h-12">
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقدي">نقدي</SelectItem>
                  <SelectItem value="شيك">شيك</SelectItem>
                  <SelectItem value="تحويل">تحويل بنكي</SelectItem>
                  <SelectItem value="بطاقة">بطاقة ائتمان</SelectItem>
                  <SelectItem value="آجل">دفع آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-center lg:justify-end">
              <Badge variant="outline" className="px-4 py-2 text-sm sm:text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                التاريخ: {new Date().toLocaleDateString('ar')}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm sm:text-base">ملاحظات إضافية</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أدخل أي ملاحظات إضافية..."
              className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
