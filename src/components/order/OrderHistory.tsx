import React from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { cn } from "@lib/utils";

interface Order {
  _id?: string;
  trackingId?: string;
  createdAt?: string;
  paymentMethod?: string;
  status?: string;
  shippingOption?: string;
  shippingCost?: number;
  total?: number;
}

interface OrderHistoryProps {
  order: Order;
}

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancel: "bg-rose-100 text-rose-700",
  processing: "bg-primary/10 text-primary",
  "out-for-delivery": "bg-teal-100 text-teal-700",
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ order }) => {
  const { formatPrice } = useUtilsFunction();

  const status = order.status ?? "";
  const statusStyle =
    STATUS_STYLES[status.toLowerCase()] ?? "bg-muted text-muted-foreground";

  return (
    <>
      <td className="py-3 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
        <span className="font-medium uppercase text-foreground">
          {order?._id?.slice(-6).toUpperCase()}
        </span>
        {order?.trackingId && (
          <Link
            to={`/track/${order.trackingId}`}
            className="mt-0.5 block font-mono text-xs text-primary hover:underline"
          >
            {order.trackingId}
          </Link>
        )}
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {dayjs(order.createdAt).format("MMMM D, YYYY")}
      </td>

      <td className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {order.paymentMethod}
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap">
        {status && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize",
              statusStyle,
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status.replace(/-/g, " ")}
          </span>
        )}
      </td>

      <td className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {order.shippingOption}
      </td>
      <td className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {formatPrice(order.shippingCost ?? 0)}
      </td>
      <td className="px-3 py-3 text-sm font-semibold whitespace-nowrap text-foreground">
        {formatPrice(order?.total ?? 0)}
      </td>
    </>
  );
};

export default OrderHistory;
