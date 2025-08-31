import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/layout/HeroSection";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <HeroSection />

        {/* Content Section */}
        <div
          className={`mx-auto px-4 py-16 ${
            isMobile ? "px-2 py-8" : "max-w-7xl px-4 sm:px-6 lg:px-8 py-16"
          }`}
        >
          <div className="text-center mb-12 dashboard-header">
            <h2
              className={`font-bold text-foreground mb-4 dashboard-title ${
                isMobile ? "text-2xl" : "text-3xl"
              }`}
            >
              لوحة التحكم الشاملة
            </h2>
            <p
              className={`text-muted-foreground mx-auto dashboard-description ${
                isMobile ? "text-sm max-w-lg" : "max-w-2xl"
              }`}
            >
              تابع أداء مبيعاتك وآخر العمليات من خلال الرسوم البيانية والتقارير
              المفصلة
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Charts and Recent Activity */}
          <div
            className={`grid gap-8 mb-12 ${
              isMobile
                ? "grid-cols-1 gap-6"
                : "grid-cols-1 xl:grid-cols-2 gap-8"
            }`}
          >
            <SalesChart />
            <RecentSales />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
