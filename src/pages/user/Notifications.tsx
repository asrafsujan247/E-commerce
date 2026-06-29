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
  ChevronRight,
  CheckCheck,
} from "lucide-react";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
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
  const [filter, setFilter] = useState<"all" | "unread">("all");

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
  const visibleNotifications =
    filter === "unread"
      ? notifications.filter((n) => n.status === "unread")
      : notifications;

  if (loading) {
    return (
      <div className="overflow-hidden">
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="animate-pulse space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-lg bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-24 rounded bg-muted" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[72px] rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil((notifData?.totalDoc ?? 0) / 20);

  return (
    <div className="overflow-hidden">
      <div className="mx-auto max-w-screen-2xl">
        <div className="rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none text-foreground">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold leading-none text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread ${
                        unreadCount === 1 ? "notification" : "notifications"
                      }`
                    : "You're all caught up"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={isMarkingAll}
                className="self-start sm:self-auto"
              >
                <CheckCheck className="h-4 w-4" />
                {isMarkingAll ? "Marking..." : "Mark all as read"}
              </Button>
            )}
          </div>

          {/* Filter tabs */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-1 border-b border-border px-5 py-3 sm:px-6">
              <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
                {(["all", "unread"] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                      filter === key
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {key}
                    {key === "unread" && unreadCount > 0 && (
                      <span
                        className={cn(
                          "inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold leading-none",
                          filter === "unread"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted-foreground/20 text-muted-foreground",
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-3 sm:p-4">
            {fetchError ? (
              <div className="py-16 text-center">
                <p className="text-destructive">{fetchError}</p>
              </div>
            ) : visibleNotifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BellOff className="h-7 w-7 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-foreground">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications yet"}
                </h4>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
                  {filter === "unread"
                    ? "You've read everything. Switch to All to see your history."
                    : "You'll receive notifications when there are updates to your orders."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {visibleNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] ?? Bell;
                  const colorClass =
                    notificationColors[notification.type] ??
                    "text-gray-500 bg-gray-50";
                  const isUnread = notification.status === "unread";

                  return (
                    <div
                      key={notification._id}
                      className={cn(
                        "group relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all",
                        isUnread
                          ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                          : "border-border bg-card hover:border-primary/20 hover:bg-muted/50",
                      )}
                      onClick={() => {
                        if (isUnread) {
                          handleMarkRead(notification._id);
                        }
                        if (notification.trackingId) {
                          navigate(`/track/${notification.trackingId}`);
                        }
                      }}
                    >
                      {/* Unread accent bar */}
                      {isUnread && (
                        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                      )}

                      {/* Icon */}
                      <div
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                          colorClass,
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm text-foreground",
                              isUnread ? "font-semibold" : "font-medium",
                            )}
                          >
                            {notification.title}
                          </p>
                          {isUnread && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <time className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {dayjs(notification.createdAt).fromNow()}
                          </time>
                          {notification.trackingId && (
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                              {notification.trackingId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Navigable affordance */}
                      {notification.trackingId && (
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 border-t border-border p-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Link
                    key={page}
                    to={`?page=${page}`}
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      page === currentPage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:bg-muted",
                    )}
                  >
                    {page}
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
