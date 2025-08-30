import { MainLayout } from "@/components/layout/MainLayout";
import { HeroSection } from "@/components/layout/HeroSection";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { LatestInvoices } from "@/components/dashboard/LatestInvoices";

const Index = () => {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Hero Section */}
        <HeroSection />

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 dashboard-header">
            <h2 className="text-3xl font-bold text-foreground mb-4 dashboard-title">
              لوحة التحكم الشاملة
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto dashboard-description">
              تابع أداء مبيعاتك وآخر العمليات من خلال الرسوم البيانية والتقارير
              المفصلة
            </p>
          </div>

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
            <SalesChart />
            <RecentSales />
          </div>

          {/* Latest Invoices */}
          <LatestInvoices />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
