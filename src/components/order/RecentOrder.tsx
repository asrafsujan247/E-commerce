import { Eye } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoBagHandle } from "react-icons/io5";

import OrderHistory from "./OrderHistory";
import { useSidebarStore } from "@stores/useSidebarStore";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Pagination from "@components/pagination/Pagination";
import OrderDetailsDrawer from "@components/drawer/OrderDetailsDrawer";
import type { Order as FullOrder } from "@appTypes/index";

interface Order {
  _id?: string;
  [key: string]: unknown;
}

interface OrdersData {
  orders?: Order[];
  totalDoc?: number;
}

interface RecentOrderProps {
  data?: OrdersData;
  error?: string;
  link?: boolean;
  title?: Record<string, string> | string;
}

const RecentOrder: React.FC<RecentOrderProps> = ({ data, error, link, title }) => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<Order>({});
  const { setDrawerOpen } = useSidebarStore();

  const handleChangePage = (page: number) => {
    navigate(`?page=${page}`);
  };

  const handleOrderDetails = (order: Order) => {
    setOrderData(order);
    setDrawerOpen(true);
  };

  return (
    <>
      {orderData && <OrderDetailsDrawer data={orderData as unknown as FullOrder} />}
      <div className="max-w-screen-2xl mx-auto">
        <div className="rounded-md">
          {error ? (
            <h2 className="text-xl text-center my-10 mx-auto w-11/12 text-red-400">
              {error}
            </h2>
          ) : data?.orders?.length === 0 ? (
            <div className="text-center">
              <span className="flex justify-center my-30 pt-16 text-primary font-semibold text-6xl">
                <IoBagHandle />
              </span>
              <h2 className="font-medium text-md my-4 text-muted-foreground">
                You Have no order Yet!
              </h2>
            </div>
          ) : (
            <div className="flex flex-col">
              {title && (
                <h3 className="mb-5 text-lg font-semibold text-foreground">
                  {String(title ?? "")}
                </h3>
              )}
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pr-3 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:pl-6"
                        >
                          Order ID
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Order Time
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Method
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Shipping
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Shipping Cost
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                        >
                          Total
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pr-4 pl-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:pr-6"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {data?.orders?.map((order) => (
                        <tr
                          key={order._id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <OrderHistory order={order} />
                          <td className="py-3 pr-4 pl-3 text-right whitespace-nowrap sm:pr-6">
                            {link ? (
                              <Link
                                to={`/order/${order._id}`}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                aria-label="View order"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  handleOrderDetails(order);
                                  setDrawerOpen(true);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                                aria-label="View order"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data?.totalDoc !== undefined && data.totalDoc > 10 && (
                  <div className="border-t border-border px-4 pb-3 sm:px-6">
                    <Pagination
                      totalResults={data.totalDoc}
                      resultsPerPage={10}
                      onChange={handleChangePage}
                      label="Product Page Navigation"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentOrder;
