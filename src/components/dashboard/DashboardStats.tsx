import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { database } from "@/lib/database";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  Receipt,
  Calendar,
  Target,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function DashboardStats() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    todaySales: 0,
    monthlyRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [sales, customers, products] = await Promise.all([
        database.getSales(),
        database.getCustomers(),
        database.getProducts(),
      ]);

      const totalSales = sales.length;
      const totalRevenue = sales.reduce(
        (sum, sale) => sum + sale.finalTotal,
        0
      );
      const totalCustomers = customers.length;
      const totalProducts = products.length;

      // حساب مبيعات اليوم
      const today = new Date();
      const todaySales = sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);
        return saleDate.toDateString() === today.toDateString();
      }).length;

      // حساب الإيرادات الشهرية
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthlyRevenue = sales
        .filter((sale) => {
          const saleDate = new Date(sale.createdAt);
          return (
            saleDate.getMonth() === currentMonth &&
            saleDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, sale) => sum + sale.finalTotal, 0);

      // حساب متوسط قيمة الطلب
      const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

      // حساب معدل التحويل (مبيعات / عملاء)
      const conversionRate =
        totalCustomers > 0 ? (totalSales / totalCustomers) * 100 : 0;

      setStats({
        totalSales,
        totalRevenue,
        totalCustomers,
        totalProducts,
        todaySales,
        monthlyRevenue,
        averageOrderValue,
        conversionRate,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const statsCards = [
    {
      title: "إجمالي المبيعات",
      value: stats.totalSales,
      icon: ShoppingCart,
      color: "bg-blue-500",
      change: `+${stats.todaySales} اليوم`,
      description: "عدد المبيعات الإجمالي",
    },
    {
      title: "إجمالي الإيرادات",
      value: `${stats.totalRevenue.toLocaleString()} د.ل`,
      icon: DollarSign,
      color: "bg-green-500",
      change: `+${stats.monthlyRevenue.toLocaleString()} هذا الشهر`,
      description: "إجمالي الإيرادات",
    },
    {
      title: "العملاء",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-500",
      change: `+${stats.conversionRate.toFixed(1)}% تحويل`,
      description: "إجمالي العملاء",
    },
    {
      title: "المنتجات",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-orange-500",
      change: `متوسط ${stats.averageOrderValue.toFixed(0)} د.ل للطلب`,
      description: "إجمالي المنتجات",
    },
  ];

  return (
    <div className={`grid gap-4 mb-8 ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
      <Card className="stats-card">
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isMobile ? 'pb-1' : 'pb-2'}`}>
          <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            إجمالي المبيعات
          </CardTitle>
          <TrendingUp className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>1,234</div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>عملية بيع</p>
        </CardContent>
      </Card>

      <Card className="stats-card">
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isMobile ? 'pb-1' : 'pb-2'}`}>
          <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            إجمالي الإيرادات
          </CardTitle>
          <DollarSign className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            45,678
          </div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>دينار ليبي</p>
        </CardContent>
      </Card>

      <Card className="stats-card">
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isMobile ? 'pb-1' : 'pb-2'}`}>
          <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            مبيعات اليوم
          </CardTitle>
          <Calendar className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>23</div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>عملية بيع</p>
        </CardContent>
      </Card>

      <Card className="stats-card">
        <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2 ${isMobile ? 'pb-1' : 'pb-2'}`}>
          <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
            الإيرادات الشهرية
          </CardTitle>
          <TrendingUp className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
            12,345
          </div>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>دينار ليبي</p>
        </CardContent>
      </Card>
    </div>
  );
}
