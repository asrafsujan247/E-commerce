import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DownloadPrintButton from "@components/invoice/DownloadPrintButton";
import { getOrderById } from "@services/OrderServices";
import { useAuth } from "@stores/useAuthStore";

import type { Order } from "@appTypes/index";

const Order = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const orderResult = await getOrderById({ id }, user?.token ?? "");

        if (orderResult.error) {
          setError(orderResult.error);
        } else {
          setData(orderResult.data as Order);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
      <DownloadPrintButton data={data} />
    </div>
  );
};

export default Order;
