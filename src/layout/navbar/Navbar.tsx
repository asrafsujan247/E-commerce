import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignalIcon, CameraIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { FiMessageSquare, FiAlignLeft } from "react-icons/fi";

import NavbarPromo from "@layout/navbar/NavbarPromo";
import SearchInput from "@components/navbar/SearchInput";
import NotifyIcon from "@components/navbar/NotifyIcon";
import ProfileDropDown from "@components/navbar/ProfileDropDown";
import PagesDrawer from "@components/drawer/PagesDrawer";
import { getShowingCategory } from "@services/CategoryService";
import type { NavbarProps, Category } from "@appTypes/index";
import { getLogoUrl } from "@utils/imageUtils";

const Navbar = ({
  globalSetting,
  storeCustomization,
  storeLayout: layoutProp,
}: NavbarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getShowingCategory().then((catResult) => {
      setCategories(catResult.categories);
      setCategoryError(catResult.error);
    });
  }, []);

  const storeLayout = layoutProp || globalSetting?.store_layout || "default";
  const logoSrc = getLogoUrl(
    storeCustomization?.navbar?.logo,
    "/logo/logo-dark.svg",
  );

  const handleMobileSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(
      mobileSearch
        ? `/search?query=${encodeURIComponent(mobileSearch)}`
        : "/search",
    );
    setMobileSearch("");
  };

  return (
    <div className="sticky z-40 top-0 w-full">
      {/* ── Mobile header (< md) ── */}
      <div className="md:hidden bg-white border-b border-gray-200 shadow-sm">
        {/* Row 1: hamburger | logo centered | profile */}
        <div className="relative flex items-center justify-between px-4 h-14">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 text-gray-700 hover:text-primary transition-colors"
          >
            <FiAlignLeft className="h-6 w-6" />
          </button>

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center"
          >
            <img
              className="h-8 w-auto max-w-30 object-contain"
              src={logoSrc}
              alt="logo"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/logo/logo-dark.svg";
              }}
            />
          </Link>

          <ProfileDropDown />
        </div>

        {/* Row 2: search bar */}
        <form onSubmit={handleMobileSearch} className="px-4 pb-3">
          <div className="flex items-center h-10 bg-gray-100 rounded-full px-4 gap-2.5">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              placeholder="Search Products"
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
            />
            <button
              type="button"
              aria-label="Search by image"
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* ── Tablet / Desktop header (md+) ── */}
      <header className="hidden md:block bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-19 gap-4 lg:gap-6">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center">
              <img
                className="h-9 lg:h-10 w-auto max-w-35 lg:max-w-40 object-contain"
                src={logoSrc}
                alt="logo"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/logo/logo-dark.svg";
                }}
              />
            </Link>

            {/* Search */}
            <div className="flex-1 min-w-0">
              <SearchInput />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4 lg:gap-7 shrink-0">
              {/* RFQ – lg+ only */}
              <Link
                to="/rfq"
                className="hidden lg:flex flex-col items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <SignalIcon className="h-6 w-6" />
                <span className="text-xs xl:text-sm font-medium whitespace-nowrap">
                  Post My RFQ
                </span>
              </Link>

              {/* Messages */}
              <Link
                to="/user/notifications"
                className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary transition-colors"
              >
                <FiMessageSquare className="h-6 w-6" />
                <span className="hidden lg:block text-xs xl:text-sm font-medium">
                  Messages
                </span>
              </Link>

              {/* Cart */}
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <NotifyIcon mode="cart-only" />
                <span className="hidden lg:block text-xs xl:text-sm font-medium">
                  Inquiry Basket
                </span>
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center gap-1 text-gray-600">
                <ProfileDropDown />
                <span className="hidden lg:block text-xs xl:text-sm font-medium">
                  Sign in
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <NavbarPromo
        categories={categories}
        categoryError={categoryError}
        storeLayout={storeLayout}
      />

      {/* Mobile navigation drawer */}
      <PagesDrawer
        open={drawerOpen}
        setOpen={setDrawerOpen}
        categories={categories}
        categoryError={categoryError}
      />
    </div>
  );
};

export default Navbar;
