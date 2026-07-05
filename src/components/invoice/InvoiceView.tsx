import React from "react";
import { Download, Printer } from "lucide-react";

// internal imports
import Invoice from "@components/invoice/Invoice";
import { useSetting } from "@stores/useSettingStore";
import type { Order } from "@appTypes/index";

interface InvoiceViewProps {
  data: Order;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ data }) => {
  const { globalSetting } = useSetting();

  return (
    <>
      {/* Invoice */}
      <Invoice data={data} globalSetting={globalSetting} />

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted focus:outline-none"
        >
          <Download className="size-4" />
          Download PDF
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none"
        >
          <Printer className="size-4" />
          Print
        </button>
      </div>
    </>
  );
};

export default InvoiceView;
