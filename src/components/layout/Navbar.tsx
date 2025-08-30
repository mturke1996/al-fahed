import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  X,
  Home,
  ShoppingCart,
  Package,
  FileText,
  BarChart3,
  Search,
  Settings,
  Smartphone,
  Sparkles,
  Bell,
  User,
} from "lucide-react";

export function Navbar({
  onMobileMenuToggle,
  isMobileMenuOpen,
}: {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}) {
  const location = useLocation();

  const navItems = [
    { name: "الرئيسية", path: "/", icon: Home, color: "text-emerald-400" },
    {
      name: "المبيعات",
      path: "/sales",
      icon: ShoppingCart,
      color: "text-blue-400",
    },
    {
      name: "الأصناف",
      path: "/products",
      icon: Package,
      color: "text-purple-400",
    },
    {
      name: "الفواتير",
      path: "/invoices",
      icon: FileText,
      color: "text-rose-400",
    },
    {
      name: "التقارير",
      path: "/reports",
      icon: BarChart3,
      color: "text-slate-400",
    },
    { name: "البحث", path: "/search", icon: Search, color: "text-teal-400" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* شعار محسن */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            <div className="relative">
              <img
                src="/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png"
                alt="شعار شركة الفهد"
                className="h-8 sm:h-10 w-auto group-hover:scale-105 transition-transform drop-shadow-lg"
              />
              <div className="absolute -top-1 -right-1 animate-bounce-slow">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <div className="font-bold text-lg sm:text-xl text-foreground">
                شركة الفهد
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                للاستشارات الهندسية
              </div>
            </div>

            <div className="sm:hidden">
              <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 px-2 py-1">
                <Smartphone className="h-3 w-3" />
                <span className="text-xs font-semibold">موبايل</span>
              </Badge>
            </div>
          </Link>

          {/* شريط التنقل المحسن */}
          <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative group ${
                    isActive(item.path)
                      ? "bg-primary text-primary-foreground shadow-lg scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${
                      isActive(item.path)
                        ? "text-primary-foreground"
                        : item.color
                    } transition-colors duration-300`}
                  />
                  {item.name}
                  {isActive(item.path) && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* الإعدادات والإجراءات */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-xs sm:text-sm hover:bg-accent rounded-xl text-muted-foreground"
            >
              <Bell className="h-4 w-4" />
              <Badge className="bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-2 text-xs sm:text-sm hover:bg-accent rounded-xl text-muted-foreground"
            >
              <Settings className="h-4 w-4" />
              الإعدادات
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-xs sm:text-sm hover:bg-accent rounded-xl text-muted-foreground"
            >
              <User className="h-4 w-4" />
              المدير
            </Button>

            {/* زر القائمة المحمولة */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 hover:bg-accent rounded-xl text-muted-foreground"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* قائمة الهاتف المحسنة */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md animate-fade-in-mobile rounded-b-2xl shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onMobileMenuToggle}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold transition-all duration-300 relative ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent hover:shadow-lg"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        isActive(item.path) ? "text-primary-foreground" : item.color
                      }`}
                    />
                    {item.name}
                    {isActive(item.path) && (
                      <div className="absolute left-4">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                      </div>
                    )}
                  </Link>
                );
              })}

              <div className="px-4 py-4 border-t border-border mt-4 space-y-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 hover:bg-accent rounded-xl py-3 text-muted-foreground"
                >
                  <Bell className="h-4 w-4" />
                  الإشعارات
                  <Badge className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full mr-auto">
                    3
                  </Badge>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 hover:bg-accent rounded-xl py-3 text-muted-foreground"
                >
                  <Settings className="h-4 w-4" />
                  الإعدادات
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 hover:bg-accent rounded-xl py-3 text-muted-foreground"
                >
                  <User className="h-4 w-4" />
                  الملف الشخصي
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
