import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import SalesPage from "./pages/SalesPage";
import SalesHistoryPage from "./pages/SalesHistoryPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceSearchPage from "./pages/InvoiceSearchPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/sales-history" element={<SalesHistoryPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoice-search" element={<InvoiceSearchPage />} />
              <Route path="/search" element={<InvoiceSearchPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
