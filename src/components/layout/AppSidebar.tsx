
import { NavLink, useLocation } from "react-router-dom"
import { 
  Home, 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  Search,
  TrendingUp
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const items = [
  { 
    title: "لوحة التحكم", 
    url: "/", 
    icon: Home 
  },
  { 
    title: "إدارة الأصناف", 
    url: "/products", 
    icon: Package 
  },
  { 
    title: "تسجيل مبيعات", 
    url: "/sales", 
    icon: ShoppingCart 
  },
  { 
    title: "المبيعات السابقة", 
    url: "/sales-history", 
    icon: TrendingUp 
  },
  { 
    title: "إنشاء فاتورة", 
    url: "/invoices", 
    icon: FileText 
  },
  { 
    title: "البحث في الفواتير", 
    url: "/invoice-search", 
    icon: Search 
  },
  { 
    title: "تقارير المبيعات", 
    url: "/reports", 
    icon: BarChart3 
  }
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = (path: string) =>
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-sidebar-primary font-bold text-base mb-4">
            {!isCollapsed && "القائمة الرئيسية"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`${getNavCls(item.url)} rounded-lg transition-all duration-200`}
                  >
                    <NavLink 
                      to={item.url} 
                      end 
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
