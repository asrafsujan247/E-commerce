import type { Notification } from "@appTypes/index";

const NOTIFS_KEY = "kachabazar_notifications";

interface StoredNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  orderId?: string;
}

function loadNotifications(): StoredNotification[] {
  try {
    return JSON.parse(localStorage.getItem(NOTIFS_KEY) ?? "[]") as StoredNotification[];
  } catch {
    return [];
  }
}

interface AddNotificationResult {
  notification?: Notification;
  error?: string;
}

const addNotification = async (
  notificationData: unknown,
  _token: string,
): Promise<AddNotificationResult> => {
  const data = notificationData as { orderId?: string; message?: string };
  const item: StoredNotification = {
    _id: `notif_${Date.now()}`,
    type: "order-placed",
    title: "Order Placed Successfully",
    message: data.message ?? "Your order has been placed.",
    status: "unread",
    createdAt: new Date().toISOString(),
    orderId: data.orderId ? String(data.orderId) : undefined,
  };
  const notifs = loadNotifications();
  notifs.unshift(item);
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
  return { notification: item as unknown as Notification };
};

export { addNotification, loadNotifications, NOTIFS_KEY };
export type { StoredNotification };
