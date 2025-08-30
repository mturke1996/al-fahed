import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package } from "lucide-react";
import { database, Product } from "@/lib/database";

interface ProductSelectorProps {
  onAddProduct: (
    productId: string,
    quantity: number,
    customPrice?: number
  ) => void;
}

export function ProductSelector({ onAddProduct }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  useEffect(() => {
    const loadProducts = async () => {
      const productsData = await database.getProducts();
      setProducts(productsData);
    };
    loadProducts();
  }, []);

  const categories = [
    "الكل",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "الكل" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleAddProduct = () => {
    if (!selectedProductId || quantity <= 0) return;

    const priceToUse = customPrice ? parseFloat(customPrice) : undefined;
    onAddProduct(selectedProductId, quantity, priceToUse);

    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setCustomPrice("");
  };

  return (
    <Card className="card-brand animate-slide-in-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-foreground">
          <Package className="h-5 w-5 text-primary" />
          إضافة الأصناف
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الأصناف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-primary hover:bg-primary/90"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Selection */}
        <div className="space-y-3">
          <div>
            <Label>اختر الصنف</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الصنف" />
              </SelectTrigger>
              <SelectContent>
                {filteredProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <div className="flex items-center gap-2 mr-4">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-sm font-semibold text-brand-accent">
                          {product.price.toFixed(2)} د.ل
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Details */}
          {selectedProduct && (
            <div className="p-3 bg-stone-50 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-stone-800">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedProduct.stock > 20 ? "default" : "destructive"
                  }
                >
                  المخزون: {selectedProduct.stock}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                السعر الأساسي:{" "}
                <span className="font-semibold text-primary">
                  {selectedProduct.price.toFixed(2)} د.ل
                </span>
              </div>
            </div>
          )}

          {/* Quantity and Custom Price */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="quantity">الكمية</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="customPrice">سعر مخصص (اختياري)</Label>
              <Input
                id="customPrice"
                type="number"
                step="0.01"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="السعر الافتراضي"
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAddProduct}
                disabled={!selectedProductId || quantity <= 0}
                className="w-full btn-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                إضافة
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
