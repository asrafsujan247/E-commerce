import React from "react";
import {
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  Truck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// Internal imports
import MainDrawer from "./MainDrawer";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSidebar } from "@stores/useSidebarStore";
import { useSetting } from "@stores/useSettingStore";
import OrderItems from "@components/order/OrderItems";
import type { Order } from "@appTypes/index";

// Types
interface OrderDetailsDrawerProps {
  data: Order;
}

const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ data }) => {
  const { drawerOpen, closeDrawer } = useSidebar();
  const { storeCustomization } = useSetting();
  const { formatPrice } = useUtilsFunction();

  const dashboard = storeCustomization?.dashboard as
    | {
        invoice_message_first?: Record<string, string>;
        invoice_message_last?: Record<string, string>;
      }
    | undefined;

  const isDelivered = String(data?.status ?? "").toLowerCase() === "delivered";
  const cartItems = (data as unknown as { cart?: unknown[] })?.cart ?? [];

  return (
    <MainDrawer open={drawerOpen} onClose={closeDrawer}>
      <div className="flex flex-col w-full h-full bg-card">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-linear-to-r from-primary/10 to-primary/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <ReceiptText className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Invoice
              </span>
              <h2 className="m-0 text-lg font-bold leading-tight text-foreground">
                #{data?.invoice}
              </h2>

              <div className="mt-1 text-sm">
                {(data.status === "Delivered" ||
                  data?.status === "delivered") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data.status}</span>
                  </span>
                )}
                {(data.status === "Pending" || data?.status === "pending") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-orange-400/10 p-1 text-orange-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data.status}</span>
                  </span>
                )}
                {(data.status === "Cancel" || data.status === "cancel") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data.status}</span>
                  </span>
                )}
                {(data.status === "Processing" ||
                  data.status === "processing") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-primary/10 p-1 text-primary">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data.status}</span>
                  </span>
                )}
                {(data.status === "Out-for-delivery" ||
                  data.status === "out-for-delivery") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-teal-400/10 p-1 text-teal-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">
                      {data.status.replace(/-/g, " ")}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={closeDrawer}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500 focus:outline-none"
          >
            <X className="size-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 py-5 sm:px-6">
          <div className="bg-accent rounded-md mb-5 px-4 py-3 hidden">
            <label>
              {String(dashboard?.invoice_message_first ?? '')}{" "}
              <span className="font-bold text-primary">
                {data?.user_info?.name},
              </span>{" "}
              {String(dashboard?.invoice_message_last ?? '')}
            </label>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-border bg-card px-4 pt-3 pb-2 shadow-sm">
            <div className="mb-2 flex items-center gap-2 border-b border-border pb-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                Order Items
              </span>
              <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </span>
            </div>

            <OrderItems
              drawer
              data={
                data as unknown as {
                  cart?: {
                    image?: string;
                    title?: string;
                    quantity?: number;
                    price?: number;
                  }[];
                }
              }
            />
          </div>

          {/* Customer & Shipping */}
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {isDelivered && (
              <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Truck aria-hidden="true" className="size-4" />
                </span>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    Delivery
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Estimated Delivery:{" "}
                    <strong className="text-foreground">Feb 8, 2025</strong>
                  </span>
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Customer &amp; Shipping
                </span>
              </div>
              <div className="flex flex-col gap-1 pl-10 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {data?.user_info?.name}
                </span>
                <span>{data?.user_info?.email}</span>
                <span>
                  {data?.user_info?.address}{" "}
                  {(data as Record<string, unknown>)?.city as string}{" "}
                  {(data as Record<string, unknown>)?.country as string}
                  {(data as Record<string, unknown>)?.zipCode as string}
                </span>
                <span className="font-medium text-foreground">
                  {data?.user_info?.contact}
                </span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CreditCard aria-hidden="true" className="size-4" />
              </span>
              <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
                <h4 className="m-0 text-sm font-semibold text-foreground">
                  Payment
                </h4>
                <span className="text-xs text-muted-foreground">
                  Payment Method:{" "}
                  <strong className="text-foreground">
                    {data?.paymentMethod}
                  </strong>
                </span>
              </div>
            </div>
            <div className="space-y-2.5 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping Cost</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(data.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(data.discount)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-3">
              <span className="text-sm font-semibold text-foreground">
                Total Amount
              </span>
              <span className="text-lg font-bold text-primary">
                {formatPrice(data.total)}
              </span>
            </div>
          </div>

          {/* Tracking Info */}
          {data?.trackingId && (
            <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Package className="size-4" />
                </span>
                <span className="text-sm font-semibold text-foreground">
                  Tracking Info
                </span>
              </div>
              <div className="space-y-2.5 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tracking ID</span>
                  <span className="font-mono font-semibold text-primary">
                    {data.trackingId}
                  </span>
                </div>
                {data?.trackingStatus && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Tracking Status
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                      {data.trackingStatus.replace(/-/g, " ")}
                    </span>
                  </div>
                )}
                {data?.deliveryBoyName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Delivery Partner
                    </span>
                    <span className="font-medium text-foreground">
                      {data.deliveryBoyName}
                    </span>
                  </div>
                )}
                <Link
                  to={`/track/${data.trackingId}`}
                  onClick={closeDrawer}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <MapPin className="size-4" />
                  Track Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainDrawer>
  );
};

export default OrderDetailsDrawer;
