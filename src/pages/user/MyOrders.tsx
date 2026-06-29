import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@stores/useAuthStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import RecentOrder from "@components/order/RecentOrder";
import { getOrderCustomer } from "@services/OrderServices";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import type { StoreCustomizationSetting } from "@appTypes/index";

interface OrderData {
  [key: string]: unknown;
}

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [customization, setCustomization] =
    useState<StoreCustomizationSetting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const [settingsResult, ordersResult] = await Promise.all([
        getStoreCustomizationSetting(),
        user?.token
          ? getOrderCustomer({ page: currentPage, limit: 10 }, user.token)
          : Promise.resolve({ data: null, error: "Not authenticated" }),
      ]);

      if (settingsResult.storeCustomizationSetting) {
        setCustomization(settingsResult.storeCustomizationSetting);
      }

      if (ordersResult.error) {
        setOrderError(ordersResult.error);
      } else {
        setOrderData(ordersResult.data as OrderData);
      }

      setLoading(false);
    };

    fetchData();
  }, [user?.token, currentPage]);

  const dashboard = customization?.dashboard as
    | Record<string, Record<string, string>>
    | undefined;

  if (loading) {
    return (
      <div className="overflow-hidden">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <RecentOrder
        link
        data={orderData as unknown as { orders?: { _id?: string; [key: string]: unknown }[]; totalDoc?: number }}
        error={orderError ?? undefined}
        title={dashboard?.my_order}
      />
    </div>
  );
};

export default MyOrders;
