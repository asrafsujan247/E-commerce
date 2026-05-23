import React from "react";
import {
  CreditCard,
  MapPin,
  Package,
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

  return (
    <MainDrawer open={drawerOpen} onClose={closeDrawer}>
      <div className="flex flex-col w-full h-full bg-background rounded">
        <div className="overflow-y-scroll scrollbar-hide w-full max-h-full">
          <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-primary/5 border-border">
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg m-0 text-foreground flex items-center">
                Invoice No #{data?.invoice}
              </h2>

              <div className="text-sm">
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

            <button
              onClick={closeDrawer}
              className="inline-flex text-base items-center cursor-pointer justify-center text-muted-foreground p-2 focus:outline-none transition-opacity hover:text-red-400"
            >
              <X />
              <span className="font-sens text-sm text-muted-foreground hover:text-red-400 ml-1">
                Close
              </span>
            </button>
          </div>
          <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full px-3 sm:px-6 py-4">
            <div className="bg-accent rounded-md mb-5 px-4 py-3 hidden">
              <label>
                {String(dashboard?.invoice_message_first ?? '')}{" "}
                <span className="font-bold text-primary">
                  {data?.user_info?.name},
                </span>{" "}
                {String(dashboard?.invoice_message_last ?? '')}
              </label>
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
            <div className="border border-border mt-4 rounded-md">
              {(data?.status === "delivered" ||
                data?.status === "Delivered") && (
                <div className="flex items-center gap-3 p-4 border-b border-border">
                  <span>
                    <Truck
                      aria-hidden="true"
                      className="size-4 text-muted-foreground shrink-0"
                    />
                  </span>
                  <div className="items-center gap-4 flex justify-between flex-wrap">
                    <span className="font-semibold text-base">Delivery </span>
                    <span className="text-muted-foreground text-sm">
                      Estimated Delivery: <strong>Feb 8, 2025</strong>
                    </span>
                  </div>
                </div>
              )}
              <div className="flex flex-col text-muted-foreground p-4 text-sm">
                <span>{data?.user_info?.name}</span>
                <span>{data?.user_info?.email} </span>
                <span>
                  {data?.user_info?.address} {(data as Record<string, unknown>)?.city as string}{" "}
                  {(data as Record<string, unknown>)?.country as string}
                  {(data as Record<string, unknown>)?.zipCode as string}
                </span>
                <span className="font-medium">{data?.user_info?.contact}</span>
              </div>
            </div>
            <div className="mt-6 border border-border rounded-md">
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <span>
                  <CreditCard
                    aria-hidden="true"
                    className="size-4 text-muted-foreground shrink-0"
                  />
                </span>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h4 className="font-semibold text-base">Payment</h4>
                  <p className="text-muted-foreground text-sm">
                    Payment Method: <strong>{data?.paymentMethod}</strong>
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-muted-foreground p-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Shipping Cost</span>
                  <span className="text-foreground font-semibold">
                    {formatPrice(data.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Discount</span>
                  <span className="text-foreground font-semibold">
                    {formatPrice(data.discount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground bg-muted px-4 py-2">
                <span>Total Amount</span>
                <span className="text-red-500 font-bold text-base">
                  {formatPrice(data.total)}
                </span>
              </div>
            </div>

            {/* Tracking Info */}
            {data?.trackingId && (
              <div className="mt-4 border border-border rounded-md p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">Tracking Info</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking ID</span>
                    <span className="font-mono font-semibold text-primary">
                      {data.trackingId}
                    </span>
                  </div>
                  {data?.trackingStatus && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Tracking Status
                      </span>
                      <span className="capitalize font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                        {data.trackingStatus.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                  {data?.deliveryBoyName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Partner
                      </span>
                      <span className="font-medium">
                        {data.deliveryBoyName}
                      </span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/track/${data.trackingId}`}
                  onClick={closeDrawer}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <MapPin className="h-4 w-4" />
                  Track Order
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainDrawer>
  );
};

export default OrderDetailsDrawer;
