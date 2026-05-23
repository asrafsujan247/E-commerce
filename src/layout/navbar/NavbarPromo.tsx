import { Link } from "react-router-dom";

//internal import
import MegaMenuCategory from "@components/mega-menu/MegaMenuCategory";
import { useSidebarStore } from "@stores/useSidebarStore";
import { ChevronDownIcon } from "lucide-react";
import { useSetting } from "@stores/useSettingStore";
import type { Category } from "@appTypes/index";

const NAV_LINKS = [
  { label: "SourcingAI", to: "/" },
  { label: "Secured Trading Service", to: "/" },
  { label: "Video Channel", to: "/" },
  { label: "Top-ranking Products", to: "/" },
] as const;

interface NavbarPromoProps {
  categories: Category[];
  categoryError: string | null;
  storeLayout?: string;
}

const NavbarPromo = ({
  categories,
  categoryError,
  storeLayout = "default",
}: NavbarPromoProps) => {
  const { isLoading, setIsLoading } = useSidebarStore();
  const { storeCustomization } = useSetting();

  const navbar = storeCustomization?.navbar as
    | Record<string, unknown>
    | undefined;

  return (
    <div
      suppressHydrationWarning
      className="hidden lg:flex xl:flex bg-white text-foreground shadow-sm"
    >
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-8 h-12 w-full flex justify-between items-center">
        {/* Left nav links */}
        <nav className="flex items-center gap-6">
          {!!navbar?.categories_menu_status && (
            <MegaMenuCategory
              categories={categories}
              categoryError={categoryError}
              storeLayout={storeLayout}
            />
          )}

          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsLoading(!isLoading)}
              className="py-2 text-xs xl:text-sm font-medium text-foreground hover:text-primary whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right dropdown links */}
        <div className="flex items-center gap-1 text-xs xl:text-sm font-medium text-foreground -mr-2.5">
          {(["Seller", "Buyer", "Help", "Apps"] as const).map((label) => (
            <button
              key={label}
              className="flex items-center gap-0.5 px-2 py-1.5 rounded hover:text-primary transition-colors"
            >
              {label}
              <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarPromo;
