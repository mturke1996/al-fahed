import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Package,
  Tag,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Building,
  HardHat,
  Wrench,
  Truck,
  Zap,
  Hammer,
  Layers,
  Box,
  Archive,
  FolderOpen,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: {
    name: string;
    color: string;
  };
  sku?: string;
  barcode?: string;
  supplier?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
}

interface AdvancedProductManagerProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

// تعريف القوائم الرئيسية
const MAIN_CATEGORIES: Category[] = [
  {
    id: "concrete",
    name: "الخرسانات",
    description: "جميع أنواع الخرسانات والمواد الأسمنتية",
    icon: Building,
    color: "blue",
    products: [],
  },
  {
    id: "steel",
    name: "الحديد والصلب",
    description: "حديد التسليح والهياكل المعدنية",
    icon: HardHat,
    color: "gray",
    products: [],
  },
  {
    id: "tools",
    name: "الأدوات والمعدات",
    description: "أدوات البناء والمعدات الهندسية",
    icon: Wrench,
    color: "orange",
    products: [],
  },
  {
    id: "electrical",
    name: "المواد الكهربائية",
    description: "الكابلات والمفاتيح واللوحات الكهربائية",
    icon: Zap,
    color: "yellow",
    products: [],
  },
  {
    id: "plumbing",
    name: "المواد الصحية",
    description: "أنابيب المياه والصرف الصحي",
    icon: Truck,
    color: "cyan",
    products: [],
  },
  {
    id: "finishing",
    name: "مواد التشطيب",
    description: "البلاط والدهانات والأخشاب",
    icon: Hammer,
    color: "purple",
    products: [],
  },
  {
    id: "insulation",
    name: "مواد العزل",
    description: "مواد العزل الحراري والصوتي",
    icon: Layers,
    color: "green",
    products: [],
  },
  {
    id: "aggregates",
    name: "الركام والحصى",
    description: "الرمل والحصى والزلط",
    icon: Box,
    color: "amber",
    products: [],
  },
];

export function AdvancedProductManager({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
}: AdvancedProductManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // تجميع المنتجات حسب الفئات
  const categorizedProducts = MAIN_CATEGORIES.map((category) => ({
    ...category,
    products: products.filter((p) => p.category?.name === category.name),
  }));

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || product.category?.name === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        case "category":
          return (a.category?.name || "").localeCompare(b.category?.name || "");
        default:
          return 0;
      }
    });

  const getStockStatus = (product: Product) => {
    const minStock = product.minStockLevel || 10;
    if (product.stock === 0) {
      return {
        status: "out",
        color: "destructive",
        text: "نفذ المخزون",
        icon: AlertTriangle,
      };
    }
    if (product.stock <= minStock) {
      return {
        status: "low",
        color: "destructive",
        text: "مخزون منخفض",
        icon: AlertTriangle,
      };
    }
    if (product.stock <= minStock * 2) {
      return {
        status: "medium",
        color: "warning",
        text: "مخزون متوسط",
        icon: CheckCircle,
      };
    }
    return {
      status: "good",
      color: "default",
      text: "مخزون جيد",
      icon: CheckCircle,
    };
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = MAIN_CATEGORIES.find((c) => c.name === categoryName);
    return category?.icon || Package;
  };

  const getCategoryColor = (categoryName: string) => {
    const category = MAIN_CATEGORIES.find((c) => c.name === categoryName);
    return category?.color || "blue";
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              إجمالي المنتجات
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">منتج</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي القيمة</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products
                .reduce((sum, p) => sum + p.price * p.stock, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">دينار ليبي</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              المنتجات منخفضة المخزون
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                products.filter((p) => p.stock <= (p.minStockLevel || 10))
                  .length
              }
            </div>
            <p className="text-xs text-muted-foreground">منتج</p>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الفئات النشطة</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{MAIN_CATEGORIES.length}</div>
            <p className="text-xs text-muted-foreground">فئة</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Categories Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            نظرة عامة على القوائم الرئيسية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MAIN_CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              const categoryProducts = products.filter(
                (p) => p.category?.name === category.name
              );
              const totalValue = categoryProducts.reduce(
                (sum, p) => sum + p.price * p.stock,
                0
              );

              return (
                <div
                  key={category.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                    activeCategory === category.name
                      ? `border-${category.color}-400 bg-${category.color}-50`
                      : `border-${category.color}-200 bg-white hover:border-${category.color}-300`
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center`}
                    >
                      <IconComponent
                        className={`h-6 w-6 text-${category.color}-600`}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المنتجات:</span>
                      <span className="font-bold text-foreground">
                        {categoryProducts.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">القيمة:</span>
                      <span className="font-bold text-foreground">
                        {totalValue.toLocaleString()} د.ل
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المنتجات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">جميع الفئات</option>
              {MAIN_CATEGORIES.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="name">ترتيب حسب الاسم</option>
              <option value="price">ترتيب حسب السعر</option>
              <option value="stock">ترتيب حسب المخزون</option>
              <option value="category">ترتيب حسب الفئة</option>
            </select>

            <div className="flex gap-1 border border-input rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Package className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            const StockIcon = stockStatus.icon;
            const CategoryIcon = getCategoryIcon(product.category?.name || "");
            const categoryColor = getCategoryColor(
              product.category?.name || ""
            );

            return (
              <Card
                key={product.id}
                className="hover:shadow-lg transition-shadow group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.category && (
                        <Badge
                          variant="outline"
                          className="text-xs mt-2"
                          style={{
                            backgroundColor: `var(--${categoryColor}-50)`,
                            borderColor: `var(--${categoryColor}-200)`,
                            color: `var(--${categoryColor}-700)`,
                          }}
                        >
                          <CategoryIcon className="h-3 w-3 ml-1" />
                          {product.category.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewProduct(product)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditProduct(product)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        السعر:
                      </span>
                      <span className="font-semibold text-foreground">
                        {product.price.toLocaleString()} د.ل
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        المخزون:
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            product.stock <= (product.minStockLevel || 10)
                              ? "text-destructive"
                              : "text-foreground"
                          }`}
                        >
                          {product.stock}
                        </span>
                        <StockIcon
                          className={`h-3 w-3 ${
                            stockStatus.status === "good"
                              ? "text-green-500"
                              : stockStatus.status === "medium"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    {product.sku && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          SKU:
                        </span>
                        <span className="text-xs font-mono text-foreground">
                          {product.sku}
                        </span>
                      </div>
                    )}

                    {product.supplier && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          المورد:
                        </span>
                        <span className="text-xs text-foreground">
                          {product.supplier}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-border">
                    <Badge
                      variant={stockStatus.color as any}
                      className="w-full justify-center text-xs"
                    >
                      {stockStatus.text}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product);
            const StockIcon = stockStatus.icon;
            const CategoryIcon = getCategoryIcon(product.category?.name || "");
            const categoryColor = getCategoryColor(
              product.category?.name || ""
            );

            return (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 bg-${categoryColor}-100 rounded-lg flex items-center justify-center`}
                      >
                        <CategoryIcon
                          className={`h-6 w-6 text-${categoryColor}-600`}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        {product.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          السعر
                        </div>
                        <div className="font-bold text-foreground">
                          {product.price.toLocaleString()} د.ل
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          المخزون
                        </div>
                        <div className="font-bold text-foreground">
                          {product.stock}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              لا توجد منتجات
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || activeCategory !== "all"
                ? "جرب تعديل معايير البحث"
                : "ابدأ بإضافة منتجات جديدة"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
