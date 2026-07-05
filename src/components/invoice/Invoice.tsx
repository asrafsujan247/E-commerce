import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Truck, MapPin, Package, ReceiptText, CreditCard } from "lucide-react";

// internal import
import OrderTable from "@components/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getLogoUrl } from "@utils/imageUtils";
import type { Order, GlobalSetting } from "@appTypes/index";

interface InvoiceProps {
  data: Order;
  globalSetting?: GlobalSetting | null;
}

const Invoice: React.FC<InvoiceProps> = ({ data, globalSetting }) => {
  const { formatPrice } = useUtilsFunction();
  const cartItems = (data as unknown as { cart?: unknown[] })?.cart ?? [];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b border-border bg-linear-to-r from-primary/10 to-primary/5 px-6 py-6 sm:px-8">
        <div className="flex flex-col justify-between gap-4 pb-6 sm:flex-row sm:items-start">
          {/* Left: icon chip + invoice no + status */}
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
              <ReceiptText className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Invoice
              </span>
              <h1 className="m-0 text-xl font-bold leading-tight text-foreground">
                #{data?.invoice}
              </h1>

              <div className="mt-1.5 text-sm">
                {data?.status === "Delivered" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data?.status}</span>
                  </span>
                )}
                {data?.status === "POS-Completed" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-primary/10 p-1 text-primary">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block">{data?.status}</span>
                  </span>
                )}
                {data?.status === "Pending" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-orange-400/10 p-1 text-orange-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data?.status}</span>
                  </span>
                )}
                {data?.status === "Cancel" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data?.status}</span>
                  </span>
                )}
                {data?.status === "Processing" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-indigo-400/10 p-1 text-indigo-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data?.status}</span>
                  </span>
                )}
                {data?.status === "Out-for-delivery" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-teal-400/10 p-1 text-teal-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">
                      {data?.status.replace(/-/g, " ")}
                    </span>
                  </span>
                )}
                {data?.status === "Deleted" && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-red-700/10 p-1 text-red-700">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block capitalize">{data?.status}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: logo + address */}
          <div className="text-left sm:text-right">
            <Link to="/" className="inline-block">
              <img
                width={110}
                height={40}
                src={getLogoUrl(
                  (globalSetting?.invoice_logo as string | undefined) ||
                    (globalSetting?.logo as string | undefined),
                  "/logo/logo-color.svg",
                )}
                alt="logo"
                className="object-contain w-27.5 h-10"
              />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {globalSetting?.address ||
                "Cecilia Chapman, 561-4535 Nulla LA, United States 96522"}
            </p>
          </div>
        </div>

        {/* Meta strip: Date | Invoice No | Invoice To */}
        <div className="flex flex-col justify-between gap-5 border-t border-border pt-5 sm:flex-row">
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </span>
            <span className="text-sm text-foreground">
              {data?.createdAt !== undefined && (
                <span>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</span>
              )}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Invoice No.
            </span>
            <span className="text-sm text-foreground">#{data?.invoice}</span>
          </div>
          <div className="flex flex-col sm:text-right">
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Invoice To.
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                {data?.user_info?.name}
              </span>{" "}
              <br />
              {data?.user_info?.email}{" "}
              <span className="ml-2">{data?.user_info?.contact}</span>
              <br />
              {data?.user_info?.address}
              <br />
              {(data as Record<string, unknown>)?.city as string}{" "}
              {(data as Record<string, unknown>)?.country as string}{" "}
              {(data as Record<string, unknown>)?.zipCode as string}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 sm:px-8">
        {/* Order Items */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-card">
                <tr className="text-xs">
                  <th
                    scope="col"
                    className="px-6 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Sr.
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Item Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <OrderTable
                data={
                  data as unknown as {
                    cart?: {
                      image?: string;
                      title?: string;
                      quantity?: number;
                      price?: number;
                      itemTotal?: number;
                    }[];
                  }
                }
              />
            </table>
          </div>
        </div>

        {/* Payment */}
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                {formatPrice(data?.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Discount</span>
              <span className="font-semibold text-foreground">
                {formatPrice(data?.discount)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              Total Amount
            </span>
            <span className="text-xl font-bold text-primary">
              {formatPrice(data?.total)}
            </span>
          </div>
        </div>

        {/* Tracking & Delivery Info */}
        {data?.trackingId && (
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
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
                  <span className="text-muted-foreground">Tracking Status</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                    {(data.trackingStatus ?? "").replace(/-/g, " ")}
                  </span>
                </div>
              )}
              {data?.deliveryBoyName && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Delivery Partner</span>
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Truck className="size-4 text-muted-foreground" />
                    {data.deliveryBoyName ?? ""}
                  </span>
                </div>
              )}
              <Link
                to={`/track/${data.trackingId}`}
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
  );
};

export default Invoice;
