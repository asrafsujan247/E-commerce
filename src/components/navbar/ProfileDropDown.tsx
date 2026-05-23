import React from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import {
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  StarIcon,
  UserCircleIcon,
  BellIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { ElementType } from "react";

// Internal imports
import { useAuth } from "@stores/useAuthStore";
import { isValidImageUrl } from "@utils/imageUtils";

// Types
interface AccountMenuItem {
  name: string;
  href: string;
  Icon: ElementType;
}

const accountMenuItems: AccountMenuItem[] = [
  { name: "Dashboard", href: "/user/dashboard", Icon: Squares2X2Icon },
  {
    name: "My Orders",
    href: "/user/my-orders",
    Icon: ClipboardDocumentListIcon,
  },
  { name: "My Reviews", href: "/user/my-reviews", Icon: StarIcon },
  { name: "My Account", href: "/user/my-account", Icon: UserCircleIcon },
  {
    name: "Update Profile",
    href: "/user/update-profile",
    Icon: UserCircleIcon,
  },
  { name: "Notifications", href: "/user/notifications", Icon: BellIcon },
  { name: "Change Password", href: "/user/change-password", Icon: KeyIcon },
];

const ProfileDropDown: React.FC = () => {
  const { user: userInfo, logout } = useAuth();
  const hasValidImage = isValidImageUrl(userInfo?.image);

  return (
    <>
      {userInfo?.email ? (
        <div className="relative group">
          {/* Trigger */}
          <button className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>

            {hasValidImage && userInfo.image ? (
              <img
                src={userInfo.image}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-muted object-cover ring-2 ring-white"
                alt={userInfo?.name?.[0] || "U"}
              />
            ) : (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-xl font-bold text-center border-2 border-white/80 border-rounded-full">
                {userInfo?.name?.charAt(0) || "U"}
              </div>
            )}
          </button>

          {/* Hover dropdown panel */}
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute right-0 top-full mt-2 z-50 w-64 transition-all duration-200 ease-in-out">
            {/* Triangle arrow */}
            <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 bg-white dark:bg-gray-800 z-10" />

            {/* Panel */}
            <div className="relative z-20 overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg">
              {/* Header — user info */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {hasValidImage && userInfo.image ? (
                  <img
                    src={userInfo.image}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                    alt={userInfo?.name || "User"}
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {userInfo?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userInfo?.email}
                  </div>
                </div>
              </div>

              {/* Nav items */}
              <div className="py-1.5">
                {accountMenuItems.map(({ name, href, Icon }) => (
                  <Link
                    key={name}
                    to={href}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Icon className="h-[18px] w-[18px] text-gray-400 dark:text-gray-500 shrink-0" />
                    {name}
                  </Link>
                ))}
              </div>

              {/* Sign out */}
              <div className="border-t border-gray-100 dark:border-gray-700 py-1.5">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <ArrowRightStartOnRectangleIcon className="h-[18px] w-[18px] text-gray-400 dark:text-gray-500 shrink-0" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link to="/auth/login" className="-m-1.5 flex items-center p-1.5">
          <span className="sr-only">Open user menu</span>

          <FiUser
            className="h-6 w-6 text-gray-600"
            aria-hidden="true"
          />
        </Link>
      )}
    </>
  );
};

export default ProfileDropDown;
