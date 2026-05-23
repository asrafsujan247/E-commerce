import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

interface ServiceItem {
  status?: string;
  prices?: {
    price?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface UseFilterReturn {
  productData: ServiceItem[] | undefined;
  pending: ServiceItem[];
  processing: ServiceItem[];
  delivered: ServiceItem[];
  setSortedField: React.Dispatch<React.SetStateAction<string>>;
}

const useFilter = (data: ServiceItem[] | undefined): UseFilterReturn => {
  const [pending, setPending] = useState<ServiceItem[]>([]);
  const [processing, setProcessing] = useState<ServiceItem[]>([]);
  const [delivered, setDelivered] = useState<ServiceItem[]>([]);
  const [sortedField, setSortedField] = useState<string>("");
  const location = useLocation();

  const productData = useMemo(() => {
    let services = data;

    // Filter user order statuses when on the dashboard page
    if (location.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending",
      );
      setPending(orderPending ?? []);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing",
      );
      setProcessing(orderProcessing ?? []);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered",
      );
      setDelivered(orderDelivered ?? []);
    }

    // Service sorting with low and high price
    if (sortedField === "Low") {
      services = services?.slice().sort(
        (a, b) =>
          ((a.prices?.price ?? 0) < (b.prices?.price ?? 0) ? -1 : 1),
      );
    }
    if (sortedField === "High") {
      services = services?.slice().sort(
        (a, b) =>
          ((a.prices?.price ?? 0) > (b.prices?.price ?? 0) ? -1 : 1),
      );
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
  };
};

export default useFilter;
