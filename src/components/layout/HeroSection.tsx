import { Card } from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Shield, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background via-card to-background text-foreground py-12 sm:py-16 lg:py-20 overflow-hidden hero-section">
      {/* خلفية هادئة متوافقة مع الوضع */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="relative max-w-7xl mx-auto mobile-padding">
        {/* رأس محسن */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex flex-col items-center justify-center gap-6 mb-8">
            <div className="relative">
              <img
                src="/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png"
                alt="شعار شركة الفهد"
                className="h-16 sm:h-20 w-auto animate-float drop-shadow-2xl"
              />
              <div className="absolute -top-2 -right-2 animate-bounce-slow">
                <Sparkles className="h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div className="text-center space-y-4 w-full">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="bg-card/90 backdrop-blur-sm border-primary text-primary font-semibold px-4 py-2"
                >
                  <Award className="h-4 w-4 mr-2" />
                  نظام متطور ومحدث
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight text-center w-full hero-title">
                شركة الفهد
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-semibold mb-6 text-center w-full hero-subtitle">
                للاستشارات الهندسية
              </p>

              <div className="flex items-center justify-center gap-4 flex-wrap w-full hero-badges">
                <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500 flex items-center gap-2 px-4 py-2 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-400">
                  <Shield className="h-4 w-4" />
                  آمن ومضمون
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-600 border-blue-500 flex items-center gap-2 px-4 py-2 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-400">
                  <TrendingUp className="h-4 w-4" />
                  نمو مستمر
                </Badge>
              </div>
            </div>
          </div>

          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 font-medium hero-description">
            نظام إدارة المبيعات والفواتير المتطور - حلول هندسية احترافية مع
            تقنيات حديثة
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold">
              {" "}
              لإدارة أعمالك بكفاءة عالية{" "}
            </span>
            ونتائج استثنائية
          </p>
        </div>

        {/* بطاقات الإحصائيات المحسنة */}
        <div className="mb-8 sm:mb-12">
          <StatsCards />
        </div>

        {/* الإجراءات السريعة المحسنة */}
        <QuickActions />
      </div>
    </section>
  );
}
