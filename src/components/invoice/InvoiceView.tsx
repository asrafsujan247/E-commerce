import React from "react";
import { Download, Printer, PartyPopper } from "lucide-react";

// internal imports
import Invoice from "@components/invoice/Invoice";
import { useSetting } from "@stores/useSettingStore";
import type { Order } from "@appTypes/index";

interface InvoiceViewProps {
  data: Order;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ data }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const dashboard = storeCustomization?.dashboard as
    | Record<string, unknown>
    | undefined;

  return (
    <>
      {/* Thank-you banner */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 shadow-sm">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <PartyPopper className="size-5" />
        </div>
        <p className="m-0 text-[15px] leading-relaxed text-foreground">
          {String(dashboard?.invoice_message_first ?? "")}{" "}
          <span className="font-bold text-primary">
            {data?.user_info?.name},
          </span>{" "}
          {String(dashboard?.invoice_message_last ?? "")}
        </p>
      </div>

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
