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

export function DashboardStats() {
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
    <div className="mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {stat.description}
                </p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
