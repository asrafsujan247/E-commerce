import { BellIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Internal imports
import CartDrawer from "@components/drawer/CartDrawer";
import { useAuth } from "@stores/useAuthStore";
import { useCartStore } from "@stores/useCartStore";
import { loadNotifications } from "@services/NotificationServices";

interface NotifyIconProps {
  mode?: "full" | "cart-only";
}

const NotifyIcon = ({ mode = "full" }: NotifyIconProps) => {
  const { totalItems } = useCartStore();
  const { user } = useAuth();
  const location = useLocation();
  const [openCartDrawer, setOpenCartDrawer] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!user?.token) {
      setNotificationCount(0);
      return;
    }
    const unread = loadNotifications().filter(
      (n) => n.status === "unread",
    ).length;
    setNotificationCount(unread);
  }, [user?.token, location.pathname]);

  return (
    <>
      <CartDrawer open={openCartDrawer} setOpen={setOpenCartDrawer} />
      <button
        type="button"
        aria-label={isHydrated ? `Cart with ${totalItems} items` : "Cart"}
        onClick={() => setOpenCartDrawer(!openCartDrawer)}
        className={`relative shrink-0 rounded-full text-gray-600 hover:text-primary focus:outline-none ${mode === "full" ? "mx-2" : ""}`}
      >
        {isHydrated && totalItems > 0 && (
          <span className="absolute z-10 top-0 -right-1 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {totalItems}
          </span>
        )}
        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      {mode === "full" && (
        <>
          <Link
            to="/user/notifications"
            aria-label={
              notificationCount > 0
                ? `${notificationCount} unread notifications`
                : "Notifications"
            }
            className="relative shrink-0 rounded-full text-gray-600 p-1 mx-2 hover:text-primary focus:outline-none"
          >
            {notificationCount > 0 && (
              <span className="absolute z-10 top-0 -right-4 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </Link>

          <span
            className="mx-4 h-6 w-px bg-gray-300 lg:mx-6"
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
};

export default NotifyIcon;
