import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  BellIcon,
  StarIcon,
  UserCircleIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

// internal imports
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@stores/useSettingStore";
import { useAuth } from "@stores/useAuthStore";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { storeCustomization } = useSetting();
  const { user, logout } = useAuth();

  const dashboard = storeCustomization?.dashboard as Record<string, unknown> | undefined;
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleLogOut = (): void => {
    logout();
    Cookies.remove("couponInfo");
    navigate("/");
  };

  interface SidebarItem {
    title: string | undefined;
    href: string;
    icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  }

  const userSidebar: SidebarItem[] = [
    {
      title: String(dashboard?.dashboard_title ?? ''),
      href: "/user/dashboard",
      icon: Squares2X2Icon,
    },
    {
      title: String(dashboard?.my_order ?? ''),
      href: "/user/my-orders",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Notifications",
      href: "/user/notifications",
      icon: BellIcon,
    },
    {
      title: "My Review",
      href: "/user/my-reviews",
      icon: StarIcon,
    },
    {
      title: "My Account",
      href: "/user/my-account",
      icon: UserCircleIcon,
    },
    {
      title: String(dashboard?.update_profile ?? ''),
      href: "/user/update-profile",
      icon: UserCircleIcon,
    },
    {
      title: String(dashboard?.change_password ?? ''),
      href: "/user/change-password",
      icon: KeyIcon,
    },
  ];

  const navbarCustomization = storeCustomization?.navbar as Record<string, unknown> | undefined;

  return (
    <div>
      {/* Mobile Dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center cursor-pointer justify-between w-full p-3 bg-card rounded-lg border border-border transition-all"
        >
          <div className="flex flex-row items-center">
            <div className="relative w-10 h-10">
              <div className="relative rounded-full w-10 h-10 border-2 border-border flex items-center justify-center bg-muted overflow-hidden">
                {user?.image &&
                (user.image.startsWith("http://") ||
                  user.image.startsWith("https://")) ? (
                  <img
                    src={user.image}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full bg-muted"
                    alt={user?.name?.[0] || "U"}
                  />
                ) : (
                  <div className="flex items-center text-xl font-semibold justify-center">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <div className="ml-3">
              <h5 className="text-left text-md font-semibold leading-none text-foreground line-h">
                {user?.name}
              </h5>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          {isDropdownOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {isDropdownOpen && (
          <div className="mt-1 bg-card rounded-lg border border-border overflow-hidden">
            {userSidebar?.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="flex items-center px-4 py-3 hover:bg-muted border-b border-border text-sm font-medium text-muted-foreground cursor-pointer"
                onClick={() => setIsDropdownOpen(false)}
              >
                <item.icon className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
                {item.title}
              </Link>
            ))}
            <button
              onClick={() => {
                handleLogOut();
                setIsDropdownOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 hover:bg-muted text-sm font-medium cursor-pointer text-muted-foreground"
            >
              <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-3 text-muted-foreground shrink-0" />
              {String(navbarCustomization?.logout ?? '')}
            </button>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block shrink-0 w-full">
          <div className="rounded-xl sticky top-4 bg-card border border-border p-5">
            {/* Avatar Section */}
            <div className="flex flex-row items-center mb-6 pb-5 border-b border-border">
              <div className="relative w-16 h-16">
                <div className="relative w-16 h-16 rounded-full border-2 border-primary/20 flex items-center justify-center bg-muted overflow-hidden">
                  {user?.image &&
                  (user.image.startsWith("http://") ||
                    user.image.startsWith("https://")) ? (
                    <img
                      src={user.image}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full bg-muted"
                      alt={user?.name?.[0] || "U"}
                    />
                  ) : (
                    <div className="flex items-center text-xl font-semibold justify-center">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
              </div>
              <div className="ml-3">
                <div>
                  <h5 className="text-lg text-left font-semibold leading-none text-foreground line-h">
                    {user?.name}
                  </h5>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {userSidebar?.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  to={item.href}
                  key={item.title}
                  className={`inline-flex items-center rounded-md hover:bg-muted py-3 px-4 text-sm font-medium w-full mb-1 transition-colors ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`shrink-0 h-4 w-4 mr-3 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    aria-hidden={true}
                  />

                  {item.title}
                </Link>
              );
            })}

            {/* Logout Button */}
            <span className="p-3 px-4 flex items-center rounded-md hover:bg-red-50 w-full mt-2 pt-4 border-t border-border cursor-pointer group">
              <ArrowRightStartOnRectangleIcon className="shrink-0 h-4 w-4 text-muted-foreground group-hover:text-red-500" />
              <button
                onClick={handleLogOut}
                className="inline-flex items-center justify-between ml-3 text-sm font-medium w-full text-left cursor-pointer transition-colors text-muted-foreground group-hover:text-destructive"
              >
                {String(navbarCustomization?.logout ?? '')}
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
