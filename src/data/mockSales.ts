
export interface Sale {
  id: string
  clientName: string
  clientCompany?: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  date: Date
  status: 'مكتملة' | 'قيد المعالجة' | 'ملغية'
  paymentMethod: 'نقدي' | 'شيك' | 'تحويل'
}

export const mockSales: Sale[] = [
  {
    id: "SAL-001",
    clientName: "أحمد محمد الزوي",
    clientCompany: "شركة النفط الليبية",
    products: [
      {
        productId: "PRD-001",
        productName: "خرسانة جاهزة عالية الجودة",
        quantity: 5,
        unitPrice: 450.00,
        total: 2250.00
      },
      {
        productId: "PRD-002", 
        productName: "حديد تسليح قطر 12 مم",
        quantity: 100,
        unitPrice: 2.85,
        total: 285.00
      }
    ],
    subtotal: 2535.00,
    tax: 126.75,
    total: 2661.75,
    date: new Date(2024, 7, 28, 10, 30),
    status: 'مكتملة',
    paymentMethod: 'تحويل'
  },
  {
    id: "SAL-002",
    clientName: "فاطمة أحمد سالم",
    clientCompany: "وزارة الإسكان والمرافق",
    products: [
      {
        productId: "PRD-003",
        productName: "بلوك إسمنتي 20x20x40",
        quantity: 500,
        unitPrice: 1.25,
        total: 625.00
      }
    ],
    subtotal: 625.00,
    tax: 31.25,
    total: 656.25,
    date: new Date(2024, 7, 27, 14, 15),
    status: 'مكتملة',
    paymentMethod: 'نقدي'
  },
  {
    id: "SAL-003",
    clientName: "محمد علي الفيتوري", 
    clientCompany: "شركة الخليج للمقاولات",
    products: [
      {
        productId: "PRD-005",
        productName: "بلاط سيراميك 60x60",
        quantity: 80,
        unitPrice: 15.75,
        total: 1260.00
      },
      {
        productId: "PRD-006",
        productName: "دهان خارجي مقاوم للطقس",
        quantity: 3,
        unitPrice: 85.00,
        total: 255.00
      }
    ],
    subtotal: 1515.00,
    tax: 75.75,
    total: 1590.75,
    date: new Date(2024, 7, 26, 11, 45),
    status: 'قيد المعالجة',
    paymentMethod: 'شيك'
  }
]
