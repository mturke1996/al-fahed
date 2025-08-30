import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { database, Product, Category } from "../lib/database";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { QuickInvoiceView } from "../components/invoice/QuickInvoiceView";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Search,
  Package,
  Tag,
  AlertTriangle,
  DollarSign,
  Trash2,
  Edit,
  Eye,
  Receipt,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0,
    totalValue: 0,
  });

  // نموذج إنشاء منتج جديد
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    stock: 0,
    sku: "",
    barcode: "",
    weight: 0,
    dimensions: "",
    supplier: "",
    costPrice: 0,
    minStockLevel: 10,
    maxStockLevel: 100,
  });

  // حالة التعديل
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // نموذج إنشاء فئة جديدة
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "blue",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        database.getProducts(),
        database.getCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);

      // حساب الإحصائيات
      const totalProducts = productsData.length;
      const totalCategories = categoriesData.length;
      const lowStockProducts = productsData.filter(
        (p) => p.stock <= (p.minStockLevel || 10)
      ).length;
      const totalValue = productsData.reduce(
        (sum, p) => sum + p.price * p.stock,
        0
      );

      setStats({
        totalProducts,
        totalCategories,
        lowStockProducts,
        totalValue,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      "blue",
      "green",
      "purple",
      "orange",
      "red",
      "yellow",
      "indigo",
      "teal",
      "pink",
      "gray",
      "cyan",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const createProduct = async () => {
    try {
      const result = await database.addProduct(newProduct);
      if (result) {
        setShowCreateProduct(false);
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          categoryId: "",
          stock: 0,
          sku: "",
          barcode: "",
          weight: 0,
          dimensions: "",
          supplier: "",
          costPrice: 0,
          minStockLevel: 10,
          maxStockLevel: 100,
        });
        loadData();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const createCategory = async () => {
    try {
      const result = await database.addCategory({
        ...newCategory,
        color: newCategory.color || getRandomColor(),
      });
      if (result) {
        setShowCreateCategory(false);
        setNewCategory({
          name: "",
          description: "",
          color: "blue",
        });
        loadData();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await database.deleteProduct(id);
        loadData();
        alert("تم حذف المنتج بنجاح");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("حدث خطأ أثناء حذف المنتج");
      }
    }
  };

  // وظائف التعديل
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId || "",
      stock: product.stock,
      sku: product.sku || "",
      barcode: product.barcode || "",
      weight: product.weight || 0,
      dimensions: product.dimensions || "",
      supplier: product.supplier || "",
      costPrice: product.costPrice || 0,
      minStockLevel: product.minStockLevel || 10,
      maxStockLevel: product.maxStockLevel || 100,
    });
    setIsEditing(true);
    setShowCreateProduct(true);
  };

  const updateProduct = async () => {
    if (!editingProduct) return;

    try {
      const updatedProduct = {
        ...editingProduct,
        ...newProduct,
      };

      await database.updateProduct(updatedProduct.id, updatedProduct);
      setIsEditing(false);
      setEditingProduct(null);
      setShowCreateProduct(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        categoryId: "",
        stock: 0,
        sku: "",
        barcode: "",
        weight: 0,
        dimensions: "",
        supplier: "",
        costPrice: 0,
        minStockLevel: 10,
        maxStockLevel: 100,
      });
      loadData();
      alert("تم تحديث المنتج بنجاح");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("حدث خطأ أثناء تحديث المنتج");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setShowCreateProduct(false);
    setNewProduct({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      stock: 0,
      sku: "",
      barcode: "",
      weight: 0,
      dimensions: "",
      supplier: "",
      costPrice: 0,
      minStockLevel: 10,
      maxStockLevel: 100,
    });
  };

  const deleteCategory = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      try {
        await database.deleteCategory(id);
        loadData();
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const getStockStatus = (product: Product) => {
    const minStock = product.minStockLevel || 10;
    if (product.stock === 0)
      return { status: "out", color: "destructive", text: "نفذ المخزون" };
    if (product.stock <= minStock)
      return { status: "low", color: "destructive", text: "مخزون منخفض" };
    if (product.stock <= minStock * 2)
      return { status: "medium", color: "warning", text: "مخزون متوسط" };
    return { status: "good", color: "default", text: "مخزون جيد" };
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "blue";
  };

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        !categoryFilter ||
        product.category?.name === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(filteredAndSortedProducts.map((p) => p.id));
  };

  const deleteSelectedProducts = async () => {
    if (selectedProducts.length === 0) return;
    if (confirm(`هل أنت متأكد من حذف ${selectedProducts.length} منتج؟`)) {
      try {
        await Promise.all(
          selectedProducts.map((id) => database.deleteProduct(id))
        );
        setSelectedProducts([]);
        loadData();
      } catch (error) {
        console.error("Error deleting products:", error);
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              إدارة الأصناف
            </h1>
            <p className="text-muted-foreground">
              إدارة المنتجات والفئات والمخزون
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => setShowCreateCategory(true)}
              variant="outline"
              size="sm"
            >
              <Tag className="h-4 w-4 ml-2" />
              إضافة فئة
            </Button>
            <Button onClick={() => setShowCreateProduct(true)} size="sm">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي المنتجات
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">منتج في النظام</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الفئات
              </CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">فئة مختلفة</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مخزون منخفض</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">يحتاج إعادة طلب</p>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي القيمة
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">دينار ليبي</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="جميع الفئات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الفئات</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">المنتجات</TabsTrigger>
            <TabsTrigger value="categories">الفئات</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            {/* Products List */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>قائمة المنتجات</CardTitle>
                  {selectedProducts.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllProducts}
                      >
                        تحديد الكل
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteSelectedProducts}
                      >
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف المحدد ({selectedProducts.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4"
                          />
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h3 className="font-semibold text-foreground">
                                {product.name}
                              </h3>
                              {product.category && (
                                <Badge
                                  variant="outline"
                                  style={{
                                    backgroundColor: `var(--${getCategoryColor(
                                      product.category.name
                                    )}-100)`,
                                  }}
                                >
                                  {product.category.name}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                              {product.sku && <span>SKU: {product.sku}</span>}
                              {product.barcode && (
                                <span>باركود: {product.barcode}</span>
                              )}
                              {product.supplier && (
                                <span>المورد: {product.supplier}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-right">
                            <div className="font-semibold text-foreground">
                              {product.price.toLocaleString()} د.ل
                            </div>
                            <div className="text-sm text-muted-foreground">
                              المخزون: {product.stock}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Badge variant={stockStatus.color as any}>
                              {stockStatus.text}
                            </Badge>

                            {/* زر عرض الفاتورة السريع */}
                            <QuickInvoiceView
                              saleData={{
                                id: `PROD-${product.id}`,
                                createdAt: new Date().toISOString(),
                                status: "completed",
                              }}
                              customerData={{
                                name: "عميل",
                                company: "شركة",
                              }}
                              products={[
                                {
                                  product: {
                                    name: product.name,
                                    description: product.description,
                                    price: product.price,
                                    sku: product.sku || "SKU-001",
                                  },
                                  quantity: 1,
                                  customPrice: product.price,
                                },
                              ]}
                              totals={{
                                subtotal: product.price,
                                discount: 0,
                                taxAmount: product.price * 0.15,
                                total: product.price * 1.15,
                              }}
                              saleConfig={{
                                paymentMethod: "cash",
                                taxRate: 15,
                                terms: "30 days",
                              }}
                              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            />

                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>قائمة الفئات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => {
                    const productCount = products.filter(
                      (p) => p.category?.id === category.id
                    ).length;
                    return (
                      <div
                        key={category.id}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            style={{
                              backgroundColor: `var(--${category.color}-100)`,
                            }}
                          >
                            {category.name}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {productCount} منتج
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تحليلات المخزون</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  سيتم إضافة التحليلات المتقدمة قريباً...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Product Modal */}
        {showCreateProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>
                  {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">اسم المنتج</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      placeholder="اسم المنتج"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">الفئة</label>
                    <Select
                      value={newProduct.categoryId}
                      onValueChange={(value) =>
                        setNewProduct({ ...newProduct, categoryId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفئة" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">السعر</label>
                    <Input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">المخزون</label>
                    <Input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">SKU</label>
                    <Input
                      value={newProduct.sku}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, sku: e.target.value })
                      }
                      placeholder="SKU-001"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">الباركود</label>
                    <Input
                      value={newProduct.barcode}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          barcode: e.target.value,
                        })
                      }
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">الوزن (كجم)</label>
                    <Input
                      type="number"
                      value={newProduct.weight}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          weight: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">الأبعاد</label>
                    <Input
                      value={newProduct.dimensions}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          dimensions: e.target.value,
                        })
                      }
                      placeholder="10cm × 5cm × 2cm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">المورد</label>
                    <Input
                      value={newProduct.supplier}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          supplier: e.target.value,
                        })
                      }
                      placeholder="اسم المورد"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">سعر التكلفة</label>
                    <Input
                      type="number"
                      value={newProduct.costPrice}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          costPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      الحد الأدنى للمخزون
                    </label>
                    <Input
                      type="number"
                      value={newProduct.minStockLevel}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          minStockLevel: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      الحد الأقصى للمخزون
                    </label>
                    <Input
                      type="number"
                      value={newProduct.maxStockLevel}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          maxStockLevel: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">الوصف</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    placeholder="وصف المنتج..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={
                      isEditing ? cancelEdit : () => setShowCreateProduct(false)
                    }
                  >
                    {isEditing ? "إلغاء التعديل" : "إلغاء"}
                  </Button>
                  <Button onClick={isEditing ? updateProduct : createProduct}>
                    {isEditing ? "تحديث المنتج" : "إضافة المنتج"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Category Modal */}
        {showCreateCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>إضافة فئة جديدة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">اسم الفئة</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="اسم الفئة"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">الوصف</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="وصف الفئة..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">اللون</label>
                  <Select
                    value={newCategory.color}
                    onValueChange={(value) =>
                      setNewCategory({ ...newCategory, color: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">أزرق</SelectItem>
                      <SelectItem value="green">أخضر</SelectItem>
                      <SelectItem value="purple">بنفسجي</SelectItem>
                      <SelectItem value="orange">برتقالي</SelectItem>
                      <SelectItem value="red">أحمر</SelectItem>
                      <SelectItem value="yellow">أصفر</SelectItem>
                      <SelectItem value="indigo">نيلي</SelectItem>
                      <SelectItem value="teal">فيروزي</SelectItem>
                      <SelectItem value="pink">وردي</SelectItem>
                      <SelectItem value="gray">رمادي</SelectItem>
                      <SelectItem value="cyan">سماوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateCategory(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={createCategory}>إضافة الفئة</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
