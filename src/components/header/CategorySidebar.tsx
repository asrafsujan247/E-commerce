import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AlignJustify, ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import type { Category, Product } from "@appTypes/index";
import { getShowingStoreProducts } from "@services/ProductServices";

interface CategorySidebarProps {
  categories: Category[];
  categoryError?: string | null;
}

const SLIDER_SIZE = 3;

const getInitialShow = () => {
  if (typeof window === "undefined") return 13;
  if (window.innerWidth >= 1536) return 17;
  if (window.innerWidth >= 1280) return 15;
  if (window.innerWidth >= 1024) return 12;
  if (window.innerWidth >= 900) return 11;
  return 9;
};

const CategorySidebar = ({
  categories,
  categoryError,
}: CategorySidebarProps) => {
  const [initialShow, setInitialShow] = useState(getInitialShow);
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [expandedPanelStyle, setExpandedPanelStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 0,
  });
  const [hoveredCat, setHoveredCat] = useState<Category | null>(null);
  const [flyoutStyle, setFlyoutStyle] = useState({
    top: 0,
    left: 0,
    maxHeight: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [sliderPage, setSliderPage] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFetchedId = useRef<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const expandedPanelRef = useRef<HTMLDivElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setHoveredCat(null);
      lastFetchedId.current = null;
    }, 150);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setHoveredCat(null);
      lastFetchedId.current = null;
      setExpandedPanel(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const onResize = () => setInitialShow(getInitialShow());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleCatEnter = useCallback(
    (cat: Category, el: HTMLElement, fromExtraPanel = false) => {
      cancelClose();
      if (lastFetchedId.current === cat._id) return;
      lastFetchedId.current = cat._id;
      const itemRect = el.getBoundingClientRect();
      const containerEl = fromExtraPanel
        ? expandedPanelRef.current
        : sidebarRef.current;
      const containerTop =
        containerEl?.getBoundingClientRect().top ?? itemRect.top;
      const maxHeight = window.innerHeight - containerTop - 8;
      setFlyoutStyle({ top: containerTop, left: itemRect.right, maxHeight });
      setHoveredCat(cat);
      setSliderPage(0);
      getShowingStoreProducts({ category: cat._id }).then((res) => {
        const items =
          res.products.length >= SLIDER_SIZE
            ? res.products
            : res.popularProducts;
        setProducts(items.slice(0, 6));
      });
    },
    [cancelClose],
  );

  const handleToggleExpandedPanel = () => {
    if (expandedPanel) {
      setExpandedPanel(false);
      setHoveredCat(null);
      lastFetchedId.current = null;
    } else {
      const rect = sidebarRef.current?.getBoundingClientRect();
      if (rect) {
        setExpandedPanelStyle({
          top: rect.top,
          left: rect.right,
          width: rect.width,
          maxHeight: window.innerHeight - rect.top - 8,
        });
      }
      setExpandedPanel(true);
    }
  };

  const catName = (cat: Category) =>
    String(cat.name ?? '') ||
    String(cat.name);

  const groups = (hoveredCat?.children ?? []).filter(
    (c) => (c as Category & { isGroup?: boolean }).isGroup,
  );
  const hotKeywords =
    ((hoveredCat as Record<string, unknown>)?.hotKeywords as string[]) ?? [];
  const totalPages = Math.max(1, Math.ceil(products.length / SLIDER_SIZE));
  const visibleProducts = products.slice(
    sliderPage * SLIDER_SIZE,
    (sliderPage + 1) * SLIDER_SIZE,
  );

  const renderCategoryItem = (cat: Category, fromExtraPanel = false) => {
    const name = catName(cat);
    const hasChildren = (cat.children?.length ?? 0) > 0;
    return (
      <li key={cat._id}>
        <div
          onMouseEnter={(e) =>
            hasChildren
              ? handleCatEnter(cat, e.currentTarget, fromExtraPanel)
              : cancelClose()
          }
          className={`flex items-center justify-between px-4 py-1.5 text-[12.5px] transition-colors leading-snug cursor-pointer ${
            hoveredCat?._id === cat._id
              ? "text-primary bg-gray-50"
              : "text-gray-500 hover:text-primary hover:bg-gray-50"
          }`}
        >
          <Link to={`/search?_id=${cat._id}`} className="flex-1 truncate">
            {name}
          </Link>
          {hasChildren && (
            <ChevronRightIcon className="h-3 w-3 shrink-0 text-gray-400 ml-1" />
          )}
        </div>
      </li>
    );
  };

  const flyout = hoveredCat ? (
    <div
      style={{
        position: "fixed",
        top: flyoutStyle.top,
        left: flyoutStyle.left,
        maxHeight: flyoutStyle.maxHeight,
        zIndex: 9999,
      }}
      className="w-150 bg-white shadow-xl border border-gray-200 rounded-r-sm overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
    >
      {/* Category heading */}
      <div className="px-5 pt-4 pb-2">
        <h3 className="font-bold text-gray-900 text-[13px] mb-3">
          {catName(hoveredCat)}
        </h3>

        {groups.length > 0 ? (
          <div className="columns-3 gap-x-6">
            {groups.map((group) => (
              <div key={group._id} className="break-inside-avoid mb-4">
                <h4 className="font-bold text-gray-900 text-[12.5px] mb-1.5">
                  {catName(group)}
                </h4>
                <ul className="space-y-1">
                  {(group.children ?? []).map((item) => (
                    <li key={item._id}>
                      <Link
                        to={`/search?_id=${item._id}`}
                        className="text-[12.5px] text-gray-500 hover:text-primary block leading-snug"
                      >
                        {catName(item)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-3 gap-x-6">
            {(hoveredCat.children ?? []).map((item) => (
              <div key={item._id} className="break-inside-avoid mb-1.5">
                <Link
                  to={`/search?_id=${item._id}`}
                  className="text-[12.5px] text-gray-500 hover:text-primary block leading-snug"
                >
                  {catName(item)}
                </Link>
              </div>
            ))}
          </div>
        )}

        <Link
          to={`/search?_id=${hoveredCat._id}`}
          className="inline-block mt-2 text-[12.5px] text-primary hover:underline"
        >
          More Categories
        </Link>
      </div>

      {/* Product slider */}
      {products.length > 0 && (
        <>
          <div className="border-t border-gray-100 mx-5" />
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSliderPage((p) => Math.max(0, p - 1))}
                disabled={sliderPage === 0}
                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 shrink-0 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeftIcon className="h-3.5 w-3.5" />
              </button>

              <div className="flex-1 grid grid-cols-3 gap-3">
                {visibleProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="flex flex-col items-center text-center group/card"
                  >
                    <div className="w-14 h-14 flex items-center justify-center mb-1.5">
                      <img
                        src={
                          Array.isArray(product.image)
                            ? product.image[0]
                            : (product.image as string | undefined)
                        }
                        alt={String(product.title ?? '')}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/placeholder.png";
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-600 group-hover/card:text-primary line-clamp-2 leading-snug">
                      {String(product.title ?? '')}
                    </p>
                  </Link>
                ))}
              </div>

              <button
                onClick={() =>
                  setSliderPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={sliderPage >= totalPages - 1}
                className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 shrink-0 transition-colors"
                aria-label="Next"
              >
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </button>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-1.5 mt-2.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSliderPage(i)}
                    className={`rounded-full transition-all ${
                      i === sliderPage
                        ? "w-3.5 h-1.5 bg-primary"
                        : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Page ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Hot keywords */}
      {hotKeywords.length > 0 && (
        <>
          <div className="border-t border-gray-100" />
          <div className="px-5 py-2.5 text-[11.5px] text-gray-500 leading-snug">
            <span className="font-semibold text-gray-700">Hot Products : </span>
            {hotKeywords.map((kw, i) => (
              <span key={kw}>
                <Link
                  to={`/search?title=${encodeURIComponent(kw)}`}
                  className="hover:text-primary hover:underline"
                >
                  {kw}
                </Link>
                {i < hotKeywords.length - 1 && (
                  <span className="mx-1.5 text-gray-300">·</span>
                )}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  ) : null;

  const extraPanel =
    expandedPanel && categories.length > initialShow
      ? createPortal(
          <div
            ref={expandedPanelRef}
            style={{
              position: "fixed",
              top: expandedPanelStyle.top,
              left: expandedPanelStyle.left,
              width: expandedPanelStyle.width,
              maxHeight: expandedPanelStyle.maxHeight,
              zIndex: 9998,
            }}
            className="bg-white shadow-xl border border-l-0 border-gray-200 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <ul>
              {categories
                .slice(initialShow)
                .map((cat) => renderCategoryItem(cat, true))}
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <div
      ref={sidebarRef}
      className="flex flex-col h-full"
      onMouseLeave={scheduleClose}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <AlignJustify className="h-3.75 w-3.75 text-gray-800 shrink-0" />
        <span className="font-bold text-gray-900 text-[14px] leading-tight">
          Categories
        </span>
      </div>

      {categoryError ? (
        <p className="px-4 py-2 text-xs text-red-500">{categoryError}</p>
      ) : (
        <>
          <ul className="flex-1">
            {categories
              .slice(0, initialShow)
              .map((cat) => renderCategoryItem(cat, false))}
          </ul>

          {categories.length > initialShow && (
            <button
              onClick={handleToggleExpandedPanel}
              className="px-4 py-2.5 text-[12.5px] text-primary font-medium text-left hover:underline"
            >
              {expandedPanel ? "Less Categories" : "More Categories >"}
            </button>
          )}
        </>
      )}

      {flyout && createPortal(flyout, document.body)}
      {extraPanel}
    </div>
  );
};

export default CategorySidebar;
