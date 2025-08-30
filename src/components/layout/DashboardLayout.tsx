
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-white shadow-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-golden hover:text-golden-dark" />
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/4e30691b-6718-4b9f-85b9-8b64ef84fc5e.png" 
                  alt="شعار شركة الفهد" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-xl font-bold text-golden">شركة الفهد للاستشارات الهندسية</h1>
                  <p className="text-sm text-muted-foreground">نظام إدارة المبيعات والفواتير</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                المستخدم التجريبي
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
