import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Bell,
  BellOff,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  Star,
  Clock,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "@stores/useAuthStore";
import { loadNotifications, NOTIFS_KEY } from "@services/NotificationServices";
import type { StoredNotification } from "@services/NotificationServices";

dayjs.extend(relativeTime);

// ---- Notification types ----

type NotificationType =
  | "order-placed"
  | "order-confirmed"
  | "processing"
  | "delivery-assigned"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "delivery-failed"
  | "cancelled"
  | "status-update"
  | "rating-reminder";

interface NotificationItem {
  _id: string;
  type: NotificationType | string;
  title: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
  trackingId?: string;
}

interface NotificationsData {
  notifications: NotificationItem[];
  unreadCount: number;
  totalDoc: number;
}

// ---- Icon & color maps ----

const notificationIcons: Record<string, React.FC<{ className?: string }>> = {
  "order-placed": ShoppingBag,
  "order-confirmed": CheckCircle,
  processing: Clock,
  "delivery-assigned": Truck,
  "picked-up": Package,
  "in-transit": Truck,
  "out-for-delivery": MapPin,
  delivered: CheckCircle,
  "delivery-failed": XCircle,
  cancelled: XCircle,
  "status-update": Bell,
  "rating-reminder": Star,
};

const notificationColors: Record<string, string> = {
  "order-placed": "text-blue-500 bg-blue-50",
  "order-confirmed": "text-indigo-500 bg-indigo-50",
  processing: "text-yellow-500 bg-yellow-50",
  "delivery-assigned": "text-purple-500 bg-purple-50",
  "picked-up": "text-orange-500 bg-orange-50",
  "in-transit": "text-cyan-500 bg-cyan-50",
  "out-for-delivery": "text-teal-500 bg-teal-50",
  delivered: "text-green-500 bg-green-50",
  "delivery-failed": "text-red-500 bg-red-50",
  cancelled: "text-red-500 bg-red-50",
  "status-update": "text-gray-500 bg-gray-50",
  "rating-reminder": "text-yellow-500 bg-yellow-50",
};

// ---- Service helpers ----

const getCustomerNotifications = async (
  params: { page: number; limit: number },
  _token: string,
): Promise<{ data: NotificationsData | null; error: string | null }> => {
  const all = loadNotifications() as NotificationItem[];
  const { page, limit } = params;
  const start = (page - 1) * limit;
  const paginated = all.slice(start, start + limit);
  const unreadCount = all.filter((n) => n.status === "unread").length;
  return { data: { notifications: paginated, unreadCount, totalDoc: all.length }, error: null };
};

const markNotificationRead = async (
  notificationId: string,
  _token: string,
): Promise<void> => {
  const all = loadNotifications();
  const updated = all.map((n) =>
    n._id === notificationId ? { ...n, status: "read" as const } : n,
  );
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(updated));
};

const markAllNotificationsRead = async (_token: string): Promise<void> => {
  const all = loadNotifications();
  const updated = all.map((n) => ({ ...n, status: "read" as const }));
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(updated));
};

// ---- Component ----

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  const [notifData, setNotifData] = useState<NotificationsData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    const { data, error } = await getCustomerNotifications(
      { page: currentPage, limit: 20 },
      user.token,
    );
    if (error) {
      setFetchError(error);
    } else {
      setNotifData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    loadNotifications();
  }, [user?.token, currentPage]);

  const handleMarkRead = async (notificationId: string) => {
    if (!user?.token) return;
    await markNotificationRead(notificationId, user.token);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    if (!user?.token) return;
    setIsMarkingAll(true);
    await markAllNotificationsRead(user.token);
    setIsMarkingAll(false);
    loadNotifications();
  };

  const notifications = notifData?.notifications ?? [];
  const unreadCount = notifData?.unreadCount ?? 0;

  if (loading) {
    return (
      <div className="overflow-hidden">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isMarkingAll}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              {isMarkingAll ? "Marking..." : "Mark all as read"}
            </button>
          )}
        </div>

        {fetchError ? (
          <div className="text-center py-16">
            <p className="text-red-500">{fetchError}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium text-muted-foreground">
              No notifications yet
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              You'll receive notifications when there are updates to your
              orders.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] ?? Bell;
              const colorClass =
                notificationColors[notification.type] ??
                "text-gray-500 bg-gray-50";
              const isUnread = notification.status === "unread";

              return (
                <div
                  key={notification._id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                    isUnread
                      ? "bg-primary/5 border-primary/20"
                      : "bg-background border-border hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    if (isUnread) {
                      handleMarkRead(notification._id);
                    }
                    if (notification.trackingId) {
                      navigate(`/track/${notification.trackingId}`);
                    }
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          isUnread ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {notification.title}
                      </p>
                      {isUnread && (
                        <span className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <time className="text-xs text-muted-foreground">
                        {dayjs(notification.createdAt).fromNow()}
                      </time>
                      {notification.trackingId && (
                        <span className="text-xs font-mono text-primary">
                          {notification.trackingId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {(notifData?.totalDoc ?? 0) > 20 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from(
              { length: Math.ceil((notifData?.totalDoc ?? 0) / 20) },
              (_, i) => i + 1,
            ).map((page) => (
              <Link
                key={page}
                to={`?page=${page}`}
                className="inline-flex items-center justify-center h-8 w-8 text-sm rounded-md border border-border hover:bg-muted"
              >
                {page}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
