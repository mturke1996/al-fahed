import React, { useState } from "react";
import { Button } from "../ui/button";
import { Receipt, Eye, Download, Printer } from "lucide-react";
import { InvoicePreview } from "./InvoicePreview";

interface QuickInvoiceViewProps {
  saleData: any;
  customerData: any;
  products: any[];
  totals: any;
  saleConfig: any;
  className?: string;
}

export function QuickInvoiceView({
  saleData,
  customerData,
  products,
  totals,
  saleConfig,
  className = ""
}: QuickInvoiceViewProps) {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowInvoice(true)}
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
      >
        <Receipt className="h-4 w-4" />
        عرض الفاتورة
      </Button>

      <InvoicePreview
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        saleData={saleData}
        customerData={customerData}
        products={products}
        totals={totals}
        saleConfig={saleConfig}
      />
    </>
  );
}
