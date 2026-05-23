import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { AlignJustify, ChevronDownIcon } from "lucide-react";
import type { Category } from "@appTypes/index";

interface MegaMenuCategoryProps {
  categories?: Category[];
  categoryError?: string | null;
  storeLayout?: string;
}

const SIDEBAR_LIMIT = 15;

const MegaMenuCategory: React.FC<MegaMenuCategoryProps> = ({
  categories = [],
  categoryError,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const sidebarCats = categories.slice(0, SIDEBAR_LIMIT);
  const hasMore = categories.length > SIDEBAR_LIMIT;

  const catName = (cat: Category) =>
    String(cat.name ?? '') ||
    (cat.name as string);

  return (
    <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
      {/* Trigger */}
      <button className="inline-flex items-center gap-1.5 py-2 text-xs xl:text-sm font-semibold text-foreground hover:text-primary focus:outline-none transition-colors">
        <AlignJustify className="h-4 w-4 shrink-0" />
        <span>All Categories</span>
        <ChevronDownIcon
          className={`ml-0.5 h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown — plain category list */}
      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 w-60 bg-white shadow-xl border border-gray-200 rounded-sm py-1"
          onMouseEnter={cancelClose}
          onMouseLeave={closeMenu}
        >
          {categoryError ? (
            <p className="px-4 py-3 text-sm text-red-500">{categoryError}</p>
          ) : (
            <>
              {sidebarCats.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/search?_id=${cat._id}`}
                  className="block px-4 py-2 text-[13px] text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors truncate"
                >
                  {catName(cat)}
                </Link>
              ))}
              {hasMore && (
                <Link
                  to="/search"
                  className="block px-4 py-2 text-[13px] text-primary hover:underline border-t border-gray-100 mt-1 pt-2"
                >
                  More Categories &gt;
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MegaMenuCategory;
