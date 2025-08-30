import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Package,
  FileText,
  BarChart3,
  Plus,
  Clock,
  ArrowRight,
  Zap,
} from "lucide-react";

export function QuickActions() {
  const quickActions = [
    {
      title: "مبيعة جديدة",
      description: "إنشاء مبيعة جديدة وإضافة الأصناف",
      icon: ShoppingCart,
      path: "/sales",
      color: "from-emerald-600 to-emerald-700",
      bgColor: "from-slate-800 to-slate-900",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-600",
    },
    {
      title: "إدارة الأصناف",
      description: "عرض وتعديل الأصناف المتاحة",
      icon: Package,
      path: "/products",
      color: "from-blue-600 to-blue-700",
      bgColor: "from-slate-800 to-slate-900",
      textColor: "text-blue-400",
      borderColor: "border-blue-600",
    },
    {
      title: "الفواتير",
      description: "عرض وإدارة جميع الفواتير",
      icon: FileText,
      path: "/invoices",
      color: "from-purple-600 to-purple-700",
      bgColor: "from-slate-800 to-slate-900",
      textColor: "text-purple-400",
      borderColor: "border-purple-600",
    },
    {
      title: "التقارير",
      description: "عرض تقارير المبيعات والإحصائيات",
      icon: BarChart3,
      path: "/reports",
      color: "from-rose-600 to-rose-700",
      bgColor: "from-slate-800 to-slate-900",
      textColor: "text-rose-400",
      borderColor: "border-rose-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* العنوان الرئيسي */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 quick-actions-title">
            الإجراءات السريعة
          </h2>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base quick-actions-description">
          اختر الإجراء المناسب لبدء العمل بسرعة وكفاءة
        </p>
      </div>

      {/* بطاقات الإجراءات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} to={action.path} className="group">
            <Card
              className={`h-full bg-gradient-to-br ${action.bgColor} border ${action.borderColor} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in group-hover:scale-105`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* خلفية متحركة */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <div
                  className={`w-full h-full bg-gradient-to-br ${action.color} rounded-xl`}
                />
              </div>

              <CardHeader className="text-center pb-4 relative z-10">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                >
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle
                  className={`text-lg font-bold ${action.textColor} mb-2 group-hover:text-slate-100 transition-colors`}
                >
                  {action.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-center relative z-10">
                <p className="text-slate-300 text-sm leading-relaxed mb-4 group-hover:text-slate-200 transition-colors">
                  {action.description}
                </p>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span>ابدأ الآن</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* تم إزالة الإحصائيات الوهمية لتجنب التكرار */}
    </div>
  );
}
