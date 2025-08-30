import { useState } from "react";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <main className="pt-20 px-4 sm:px-6 lg:px-8 pb-8">{children}</main>
      <footer className="bg-card border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 نظام إدارة المبيعات. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
