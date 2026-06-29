import React, { useEffect, useState } from "react";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { LayoutDashboard } from "lucide-react";

import { useAuth } from "@stores/useAuthStore";
import { useSearchParams } from "react-router-dom";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Card from "@components/order-card/Card";
import RecentOrder from "@components/order/RecentOrder";
import { getOrderCustomer } from "@services/OrderServices";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import type { StoreCustomizationSetting } from "@appTypes/index";

interface OrderData {
  totalDoc?: number;
  pending?: number;
  processing?: number;
  delivered?: number;
  orders?: unknown[];
  [key: string]: unknown;
}

const Dashboard: React.FC = () => {
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
      <div className="overflow-hidden border-0">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="h-3 w-64 rounded bg-muted" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dashboardTitle = String(dashboard?.dashboard_title ?? "") || "Dashboard";

  return (
    <div className="overflow-hidden border-0">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-none text-foreground sm:text-xl">
            {dashboardTitle}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""} — here's your order
            overview.
          </p>
        </div>
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <Card
          title={
            String(dashboard?.total_order ?? '') ?? "Total Orders"
          }
          Icon={FiShoppingCart}
          quantity={orderData?.totalDoc}
          className="text-rose-600 bg-rose-100"
        />
        <Card
          title={
            String(dashboard?.pending_order ?? '') ?? "Pending Orders"
          }
          Icon={FiRefreshCw}
          quantity={orderData?.pending}
          className="text-amber-600 bg-amber-100"
        />
        <Card
          title={
            String(dashboard?.processing_order ?? '') ??
            "Processing Orders"
          }
          Icon={FiTruck}
          quantity={orderData?.processing}
          className="text-indigo-600 bg-indigo-100"
        />
        <Card
          title={
            String(dashboard?.complete_order ?? '') ??
            "Completed Orders"
          }
          Icon={FiCheck}
          quantity={orderData?.delivered}
          className="text-emerald-600 bg-emerald-100"
        />
      </div>
      <RecentOrder
        data={orderData as unknown as { orders?: { _id?: string; [key: string]: unknown }[]; totalDoc?: number }}
        error={orderError ?? undefined}
        title={dashboard?.recent_order}
      />
    </div>
  );
};

export default Dashboard;
