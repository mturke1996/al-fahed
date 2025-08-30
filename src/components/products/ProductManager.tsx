import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
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
} from "lucide-react";

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

interface ProductManagerProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onViewProduct: (product: Product) => void;
}

export function ProductManager({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
}: ProductManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category?.name === categoryFilter;

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

  const getCategoryColor = (categoryName: string) => {
    const category = products.find(
      (p) => p.category?.name === categoryName
    )?.category;
    return category?.color || "blue";
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category?.name).filter(Boolean))
  );

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
            <CardTitle className="text-sm font-medium">الفئات</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">فئة</p>
          </CardContent>
        </Card>
      </div>

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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
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
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const StockIcon = stockStatus.icon;

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
                          backgroundColor: `var(--${getCategoryColor(
                            product.category.name
                          )}-50)`,
                          borderColor: `var(--${getCategoryColor(
                            product.category.name
                          )}-200)`,
                          color: `var(--${getCategoryColor(
                            product.category.name
                          )}-700)`,
                        }}
                      >
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

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              لا توجد منتجات
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== "all"
                ? "جرب تعديل معايير البحث"
                : "ابدأ بإضافة منتجات جديدة"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
