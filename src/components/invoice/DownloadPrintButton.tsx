import React from "react";

// internal imports
import Invoice from "@components/invoice/Invoice";
import { useSetting } from "@stores/useSettingStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import type { Order } from "@appTypes/index";

interface DownloadPrintButtonProps {
  data: Order;
}

const DownloadPrintButton: React.FC<DownloadPrintButtonProps> = ({ data }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const dashboard = storeCustomization?.dashboard as Record<string, unknown> | undefined;

  return (
    <>
      <div className="bg-accent rounded-md mb-5 px-4 py-3">
        <label>
          {String(dashboard?.invoice_message_first ?? '')}{" "}
          <span className="font-bold text-primary">
            {data?.user_info?.name},
          </span>{" "}
          {String(dashboard?.invoice_message_last ?? '')}
        </label>
      </div>

      <Invoice data={data} globalSetting={globalSetting} />
    </>
  );
};

export default DownloadPrintButton;
