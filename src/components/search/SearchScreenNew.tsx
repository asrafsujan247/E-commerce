import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import {
  IoGridOutline,
  IoListOutline,
  IoFilterOutline,
  IoCloseOutline,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

import useFilter from "@hooks/useFilter";
import ProductCard from "@components/product/ProductCard";
import { Button } from "@components/ui/button";
import type { Product, Category, ProductAttribute } from "@appTypes/index";
import categoriesData from "@localdata/categories.json";

// ── Category data types ───────────────────────────────────────────────────────
interface SubCat { _id: string; name: string; slug: string; }
interface CatEntry { _id: string; name: string; slug: string; children: SubCat[]; }
interface DeptEntry { _id: string; name: string; slug: string; categories: CatEntry[]; }

const deptData = categoriesData as unknown as DeptEntry[];

// ── Sub-components ────────────────────────────────────────────────────────────
const FilterSection = ({
  title, isOpen, onToggle, children,
}: {
  title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode;
}) => (
  <div className="border-b border-border last:border-0">
    <button
      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      onClick={onToggle}
    >
      {title}
      <IoChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
    </button>
    {isOpen && <div className="pb-3">{children}</div>}
  </div>
);

const FilterOption = ({
  label, active, onClick,
}: {
  label: string; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left text-sm py-1.5 px-2 rounded-md transition-colors ${active ? "text-primary font-medium bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
  >
    <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${active ? "border-primary" : "border-border"}`}>
      {active && <span className="w-2 h-2 rounded-full bg-primary" />}
    </span>
    <span className="truncate">{label}</span>
  </button>
);

// ── Props ─────────────────────────────────────────────────────────────────────
interface SearchScreenNewProps {
  products?: Product[];
  attributes?: ProductAttribute[];
  categories?: Category[];
  searchQuery?: string;
  selectedCategory?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
const SearchScreenNew = ({
  products = [],
  attributes = [],
  categories = [],
  searchQuery = "",
  selectedCategory = "",
}: SearchScreenNewProps) => {
  const navigate = useNavigate();

  // View / sort
  const [visibleProduct, setVisibleProduct] = useState(24);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");

  // Category slider
  const [sliderOffset, setSliderOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Filter panel
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedFilterCat, setSelectedFilterCat] = useState("");
  const [selectedSubCat, setSelectedSubCat] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(500);
  const [expanded, setExpanded] = useState({
    department: true,
    category: true,
    subcategory: true,
    brand: false,
    supplier: false,
    price: true,
  });

  const { setSortedField, productData } = useFilter(products as unknown as Product[]);

  // ── Slider ──────────────────────────────────────────────────────────────────
  const updateMax = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    setMaxOffset(Math.max(0, inner.scrollWidth - outer.clientWidth));
  }, []);

  useEffect(() => {
    const t = setTimeout(updateMax, 100);
    window.addEventListener("resize", updateMax);
    return () => { clearTimeout(t); window.removeEventListener("resize", updateMax); };
  }, [updateMax]);

  const slide = (dir: "left" | "right") => {
    const step = 200;
    setSliderOffset((prev) =>
      dir === "right" ? Math.min(prev + step, maxOffset) : Math.max(prev - step, 0)
    );
  };

  // ── Filter data derivations ─────────────────────────────────────────────────
  const availableCats = useMemo<CatEntry[]>(() => {
    if (!selectedDept) return deptData.flatMap((d) => d.categories);
    return deptData.find((d) => d._id === selectedDept)?.categories ?? [];
  }, [selectedDept]);

  const availableSubCats = useMemo<SubCat[]>(() => {
    if (!selectedFilterCat) return [];
    return deptData.flatMap((d) => d.categories).find((c) => c._id === selectedFilterCat)?.children ?? [];
  }, [selectedFilterCat]);

  const allBrands = useMemo(() =>
    [...new Set((products as any[]).map((p) => p.brand).filter(Boolean))].sort() as string[],
    [products]
  );

  const allSuppliers = useMemo(() =>
    [...new Set((products as any[]).map((p) => p.supplier).filter(Boolean))].sort() as string[],
    [products]
  );

  const globalPriceMax = useMemo(() => {
    const prices = (products as any[]).map((p) => p.prices?.price ?? 0);
    return Math.ceil(Math.max(...prices, 500));
  }, [products]);

  // ── Filter logic ────────────────────────────────────────────────────────────
  const filteredProducts = useMemo<Product[]>(() => {
    let result = [...(productData as unknown as Product[])];

    // Price
    result = result.filter((p) => {
      const price = (p as any).prices?.price ?? 0;
      return price >= priceMin && price <= priceMax;
    });

    // Brand
    if (selectedBrand) {
      result = result.filter((p) => (p as any).brand === selectedBrand);
    }

    // Supplier
    if (selectedSupplier) {
      result = result.filter((p) => (p as any).supplier === selectedSupplier);
    }

    // Subcategory → category → department (most specific wins)
    if (selectedSubCat) {
      result = result.filter((p) =>
        (p as any).categories?.some((c: any) => c._id === selectedSubCat)
      );
    } else if (selectedFilterCat) {
      const subIds = availableSubCats.map((s) => s._id);
      result = result.filter((p) =>
        (p as any).categories?.some((c: any) => c._id === selectedFilterCat || subIds.includes(c._id))
      );
    } else if (selectedDept) {
      const dept = deptData.find((d) => d._id === selectedDept);
      if (dept) {
        const allIds = dept.categories.flatMap((c) => [c._id, ...c.children.map((s) => s._id)]);
        result = result.filter((p) =>
          (p as any).categories?.some((c: any) => allIds.includes(c._id))
        );
      }
    }

    return result;
  }, [productData, priceMin, priceMax, selectedBrand, selectedSupplier,
    selectedSubCat, selectedFilterCat, selectedDept, availableSubCats]);

  const activeFilterCount = [selectedDept, selectedFilterCat, selectedSubCat, selectedBrand, selectedSupplier]
    .filter(Boolean).length + (priceMin > 0 || priceMax < globalPriceMax ? 1 : 0);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setSortedField(value);
  };

  const clearAllFilters = () => {
    setSelectedDept("");
    setSelectedFilterCat("");
    setSelectedSubCat("");
    setSelectedBrand("");
    setSelectedSupplier("");
    setPriceMin(0);
    setPriceMax(globalPriceMax);
  };

  const toggleExpanded = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const displayProducts = filteredProducts.slice(0, visibleProduct);

  // ── Filter content (shared mobile + desktop) ────────────────────────────────
  const filterContent = (
    <div className="p-4">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-sm text-foreground uppercase tracking-wide">Filters</span>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-primary hover:underline font-semibold">
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Department */}
      <FilterSection title="Department" isOpen={expanded.department} onToggle={() => toggleExpanded("department")}>
        <FilterOption label="All Departments" active={!selectedDept} onClick={() => { setSelectedDept(""); setSelectedFilterCat(""); setSelectedSubCat(""); }} />
        {deptData.map((dept) => (
          <FilterOption
            key={dept._id}
            label={dept.name}
            active={selectedDept === dept._id}
            onClick={() => { setSelectedDept(dept._id); setSelectedFilterCat(""); setSelectedSubCat(""); }}
          />
        ))}
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" isOpen={expanded.category} onToggle={() => toggleExpanded("category")}>
        <FilterOption label="All Categories" active={!selectedFilterCat} onClick={() => { setSelectedFilterCat(""); setSelectedSubCat(""); }} />
        {availableCats.map((cat) => (
          <FilterOption
            key={cat._id}
            label={cat.name}
            active={selectedFilterCat === cat._id}
            onClick={() => { setSelectedFilterCat(cat._id); setSelectedSubCat(""); setExpanded((p) => ({ ...p, subcategory: true })); }}
          />
        ))}
      </FilterSection>

      {/* Subcategory — only when a category is selected */}
      {availableSubCats.length > 0 && (
        <FilterSection title="Subcategory" isOpen={expanded.subcategory} onToggle={() => toggleExpanded("subcategory")}>
          <FilterOption label="All Subcategories" active={!selectedSubCat} onClick={() => setSelectedSubCat("")} />
          {availableSubCats.map((sub) => (
            <FilterOption
              key={sub._id}
              label={sub.name}
              active={selectedSubCat === sub._id}
              onClick={() => setSelectedSubCat(sub._id)}
            />
          ))}
        </FilterSection>
      )}

      {/* Brand */}
      {allBrands.length > 0 && (
        <FilterSection title="Brand" isOpen={expanded.brand} onToggle={() => toggleExpanded("brand")}>
          <FilterOption label="All Brands" active={!selectedBrand} onClick={() => setSelectedBrand("")} />
          {allBrands.map((b) => (
            <FilterOption key={b} label={b} active={selectedBrand === b} onClick={() => setSelectedBrand(b)} />
          ))}
        </FilterSection>
      )}

      {/* Supplier */}
      {allSuppliers.length > 0 && (
        <FilterSection title="Supplier" isOpen={expanded.supplier} onToggle={() => toggleExpanded("supplier")}>
          <FilterOption label="All Suppliers" active={!selectedSupplier} onClick={() => setSelectedSupplier("")} />
          {allSuppliers.map((s) => (
            <FilterOption key={s} label={s} active={selectedSupplier === s} onClick={() => setSelectedSupplier(s)} />
          ))}
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range" isOpen={expanded.price} onToggle={() => toggleExpanded("price")}>
        <div className="space-y-3 pt-1">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Min ($)</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!isNaN(v) && v >= 0) setPriceMin(Math.min(v, priceMax));
                }}
                className="w-full border border-border rounded-md px-2.5 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <span className="text-muted-foreground pb-2 shrink-0">—</span>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Max ($)</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!isNaN(v) && v >= 0) setPriceMax(Math.max(v, priceMin));
                }}
                className="w-full border border-border rounded-md px-2.5 py-1.5 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground">${priceMin} — ${priceMax}</p>
        </div>
      </FilterSection>
    </div>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">

      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Search</span>
          {searchQuery && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span>"{searchQuery}"</span>
            </>
          )}
        </nav>
      </div>

      {/* Category slider */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 mb-4">
        <div className="flex items-center gap-2">
          {sliderOffset > 0 && (
            <button
              onClick={() => slide("left")}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded border border-border bg-background text-foreground shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <IoChevronBack className="w-4 h-4" />
            </button>
          )}
          <div ref={outerRef} className="overflow-hidden flex-1">
            <div
              ref={innerRef}
              className="flex gap-2 transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${sliderOffset}px)` }}
            >
              <button
                onClick={() => navigate("/search")}
                className={`shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors ${!selectedCategory ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/search?category=${cat.slug}`)}
                  className={`shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedCategory === cat.slug ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                >
                  {String(cat.name ?? "") ?? cat.slug}
                </button>
              ))}
            </div>
          </div>
          {sliderOffset < maxOffset && (
            <button
              onClick={() => slide("right")}
              className="shrink-0 flex items-center justify-center w-8 h-8 rounded border border-border bg-background text-foreground shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <IoChevronForward className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile: backdrop + slide-in drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${showFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowFilters(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-background z-50 overflow-y-auto shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
          <span className="font-bold text-foreground">Filters</span>
          <button onClick={() => setShowFilters(false)} className="p-1 rounded hover:bg-muted transition-colors">
            <IoCloseOutline className="w-5 h-5" />
          </button>
        </div>
        {filterContent}
      </div>

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 pb-10">
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {displayProducts.length} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border border-border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`}
            >
              <IoGridOutline className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`}
            >
              <IoListOutline className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`relative flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 transition-colors ${showFilters ? "border-primary text-primary" : "border-border hover:border-primary"}`}
            >
              <IoFilterOutline className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop: inline sidebar */}
          {showFilters && (
            <aside className="hidden md:block w-64 shrink-0">
              <div className="bg-white border border-border rounded-sm sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                {filterContent}
              </div>
            </aside>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg mb-4">No products found.</p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                  {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {visibleProduct < filteredProducts.length && (
                  <div className="text-center mt-8">
                    <Button variant="outline" onClick={() => setVisibleProduct((p) => p + 24)}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreenNew;
