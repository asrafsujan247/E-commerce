import type { Order } from "@appTypes/index";

const ORDERS_KEY = "kachabazar_orders";

function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

interface AddOrderResult {
  orderResponse?: Order;
  error?: string;
}

const addOrder = async (
  orderInfo: unknown,
  _token: string,
): Promise<AddOrderResult> => {
  const info = orderInfo as Partial<Order>;
  const orderResponse: Order = {
    _id: `order_${Date.now()}`,
    invoice: `INV-${Date.now()}`,
    user_info: info.user_info ?? { name: "", email: "", contact: "", address: "", city: "", country: "", zipCode: "" },
    cart: info.cart ?? [],
    paymentMethod: info.paymentMethod ?? "COD",
    shippingOption: info.shippingOption ?? "standard",
    shippingCost: info.shippingCost ?? 0,
    subTotal: info.subTotal ?? info.total ?? 0,
    discount: info.discount ?? 0,
    total: info.total ?? 0,
    status: "Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const orders = loadOrders();
  orders.unshift(orderResponse);
  saveOrders(orders);
  return { orderResponse };
};

interface AddGuestOrderResult {
  orderResponse?: Order;
  authInfo?: unknown;
  error?: string;
}

const addGuestOrder = async (orderInfo: unknown): Promise<AddGuestOrderResult> => {
  const { orderResponse } = await addOrder(orderInfo, "");
  return { orderResponse, authInfo: null };
};

interface GetOrderCustomerResult {
  data?: unknown;
  error?: string;
}

const getOrderCustomer = async (
  params: { page: number; limit: number },
  _token: string,
): Promise<GetOrderCustomerResult> => {
  const orders = loadOrders();
  const { page, limit } = params;
  const start = (page - 1) * limit;
  const paginated = orders.slice(start, start + limit);
  return { data: { orders: paginated, totalDoc: orders.length } };
};

interface GetOrderByIdResult {
  data?: unknown;
  error?: string;
}

const getOrderById = async (
  { id }: { id: string },
  _token: string,
): Promise<GetOrderByIdResult> => {
  const orders = loadOrders();
  const order = orders.find((o) => o._id === id);
  return { data: order ?? { _id: id, status: "Pending", cart: [], total: 0 } };
};

const sendEmailInvoiceToCustomer = async (
  _body: unknown,
  _token: string,
): Promise<unknown> => {
  return { message: "Invoice sent" };
};

export {
  addOrder,
  addGuestOrder,
  getOrderCustomer,
  getOrderById,
  sendEmailInvoiceToCustomer,
};
