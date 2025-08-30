
export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  unit: string
  lastUpdated: Date
}

export const mockProducts: Product[] = [
  {
    id: "PRD-001",
    name: "خرسانة جاهزة عالية الجودة",
    category: "مواد البناء",
    price: 450.00,
    stock: 50,
    description: "خرسانة جاهزة عالية المقاومة مناسبة للمشاريع الكبيرة",
    unit: "متر مكعب",
    lastUpdated: new Date(2024, 7, 25)
  },
  {
    id: "PRD-002", 
    name: "حديد تسليح قطر 12 مم",
    category: "حديد التسليح",
    price: 2.85,
    stock: 200,
    description: "حديد تسليح عالي الجودة مطابق للمواصفات الليبية",
    unit: "متر طولي",
    lastUpdated: new Date(2024, 7, 26)
  },
  {
    id: "PRD-003",
    name: "بلوك إسمنتي 20x20x40",
    category: "مواد البناء",
    price: 1.25,
    stock: 1000,
    description: "بلوك إسمنتي عالي الجودة للبناء",
    unit: "قطعة",
    lastUpdated: new Date(2024, 7, 27)
  },
  {
    id: "PRD-004",
    name: "إسمنت بورتلاندي",
    category: "مواد البناء", 
    price: 28.50,
    stock: 80,
    description: "إسمنت بورتلاندي عالي الجودة",
    unit: "شيكارة 50 كجم",
    lastUpdated: new Date(2024, 7, 24)
  },
  {
    id: "PRD-005",
    name: "بلاط سيراميك 60x60",
    category: "التشطيبات",
    price: 15.75,
    stock: 300,
    description: "بلاط سيراميك فاخر للأرضيات",
    unit: "متر مربع",
    lastUpdated: new Date(2024, 7, 28)
  },
  {
    id: "PRD-006",
    name: "دهان خارجي مقاوم للطقس",
    category: "الدهانات",
    price: 85.00,
    stock: 45,
    description: "دهان خارجي عالي الجودة مقاوم لظروف الطقس",
    unit: "جالون 20 لتر",
    lastUpdated: new Date(2024, 7, 23)
  },
  {
    id: "PRD-007",
    name: "أنابيب PVC قطر 110 مم",
    category: "السباكة",
    price: 12.30,
    stock: 150,
    description: "أنابيب PVC للصرف الصحي",
    unit: "متر طولي",
    lastUpdated: new Date(2024, 7, 29)
  },
  {
    id: "PRD-008",
    name: "كابل كهربائي 2.5 مم",
    category: "الكهرباء",
    price: 3.20,
    stock: 500,
    description: "كابل كهربائي معزول عالي الجودة",
    unit: "متر طولي",
    lastUpdated: new Date(2024, 7, 22)
  }
]
