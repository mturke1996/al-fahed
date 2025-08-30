import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Package,
  FileText,
  Activity,
  Users,
  BarChart,
  Star,
} from "lucide-react";
import { database } from "@/lib/database";

export function StatsCards() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await database.getStats();
      setStats(statsData);
    };
    loadStats();
  }, []);

  const statsCards = [
    {
      title: "إجمالي الإيرادات",
      value: `${stats.totalRevenue.toFixed(2)} د.ل`,
      change: `${stats.totalSales} عملية`,
      changeType: "positive" as const,
      icon: DollarSign,
      gradient: "from-emerald-600 to-emerald-700",
      bgGradient: "from-slate-800 to-slate-900",
    },
    {
      title: "عدد الفواتير",
      value: stats.totalInvoices.toString(),
      change: `${stats.totalSales} مبيعة`,
      changeType: "positive" as const,
      icon: FileText,
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-slate-800 to-slate-900",
    },
    {
      title: "الأصناف المتاحة",
      value: stats.totalProducts.toString(),
      change: `${stats.lowStockProducts} منخفض المخزون`,
      changeType:
        stats.lowStockProducts > 0
          ? ("negative" as const)
          : ("positive" as const),
      icon: Package,
      gradient: "from-purple-600 to-purple-700",
      bgGradient: "from-slate-800 to-slate-900",
    },
    {
      title: "نمو المبيعات",
      value:
        stats.totalSales > 0
          ? `${(
              (stats.totalSales / Math.max(stats.totalSales - 1, 1)) * 100 -
              100
            ).toFixed(1)}%`
          : "0%",
      change: "مقارنة بالشهر الماضي",
      changeType: "positive" as const,
      icon: TrendingUp,
      gradient: "from-rose-600 to-rose-700",
      bgGradient: "from-slate-800 to-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsCards.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border border-border shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group animate-slide-in-right`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {/* زخرفة خلفية هادئة */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${stat.gradient} blur-xl`}
            />
          </div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold text-slate-300 leading-tight">
                {stat.title}
              </CardTitle>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div className="text-3xl font-bold text-slate-100">
                {stat.value}
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  className={`${
                    stat.changeType === "positive"
                      ? "bg-emerald-900/50 text-emerald-300 border-emerald-600"
                      : "bg-red-900/50 text-red-300 border-red-600"
                  } flex items-center gap-1 px-3 py-1 font-semibold`}
                >
                  <Activity className="h-3 w-3" />
                  {stat.change}
                </Badge>

                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-slate-400 fill-current" />
                  <span className="text-xs font-medium text-slate-400">
                    عالي
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
