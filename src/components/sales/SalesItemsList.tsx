
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Trash2, Edit3, Package2, Calculator } from "lucide-react"

interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  originalPrice: number
  customPrice?: boolean
}

interface SalesItemsListProps {
  items: SaleItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onUpdatePrice: (productId: string, price: number) => void
  onRemoveItem: (productId: string) => void
}

export function SalesItemsList({ items, onUpdateQuantity, onUpdatePrice, onRemoveItem }: SalesItemsListProps) {
  if (items.length === 0) {
    return (
      <Card className="card-brand animate-scale-in">
        <CardContent className="py-12">
          <div className="text-center">
            <Package2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">لا توجد أصناف مضافة</h3>
            <p className="text-muted-foreground">ابدأ بإضافة الأصناف لإنشاء المبيعة</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-brand animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-stone-800">
          <Calculator className="h-5 w-5 text-brand-accent" />
          أصناف المبيعة ({items.length} صنف)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div 
              key={item.productId} 
              className="p-4 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-stone-800">{item.productName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">
                      السعر الأساسي: {item.originalPrice.toFixed(2)} د.ل
                    </span>
                    {item.customPrice && (
                      <Badge variant="secondary" className="text-xs">
                        سعر مخصص
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.productId)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Unit Price */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => onUpdatePrice(item.productId, parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Quantity Label */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">الكمية:</span>
                  <div className="font-semibold">{item.quantity}</div>
                </div>

                {/* Total */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground">الإجمالي:</span>
                  <div className="text-xl font-bold text-brand-accent">
                    {item.total.toFixed(2)} د.ل
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
