import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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

interface SearchScreenNewProps {
  products?: Product[];
  attributes?: ProductAttribute[];
  categories?: Category[];
  searchQuery?: string;
  selectedCategory?: string;
}

const SearchScreenNew = ({
  products = [],
  attributes = [],
  categories = [],
  searchQuery = "",
  selectedCategory = "",
}: SearchScreenNewProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [visibleProduct, setVisibleProduct] = useState(24);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: false,
  });
  const [sliderOffset, setSliderOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const updateMax = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    setMaxOffset(Math.max(0, inner.scrollWidth - outer.clientWidth));
  }, []);

  useEffect(() => {
    const t = setTimeout(updateMax, 100);
    window.addEventListener("resize", updateMax);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateMax);
    };
  }, [updateMax]);

  const slide = (dir: "left" | "right") => {
    const step = 200;
    setSliderOffset((prev) =>
      dir === "right"
        ? Math.min(prev + step, maxOffset)
        : Math.max(prev - step, 0),
    );
  };

  const { setSortedField, productData } = useFilter(
    products as unknown as Product[],
  );

  const toggleSection = useCallback(
    (section: keyof typeof expandedSections) => {
      setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    },
    [],
  );

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setSortedField(value);
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/search?category=${slug}`);
  };

  const displayProducts = (productData as unknown as Product[]).slice(
    0,
    visibleProduct,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/"
            className="hover:text-foreground flex items-center gap-1"
          >
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
                  onClick={() => handleCategoryClick(cat.slug)}
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

      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 pb-10">
        {/* Controls bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {displayProducts.length} of {(productData as unknown[]).length}{" "}
            products
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
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-sm border border-border rounded-md px-3 py-1.5 hover:border-primary transition-colors"
            >
              {showFilters ? <IoCloseOutline /> : <IoFilterOutline />} Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          {showFilters && (
            <aside className="w-64 shrink-0 bg-white rounded-sm">
              {/* Categories filter */}
              <div className="overflow-hidden mb-4">
                <button
                  className="w-full flex items-center justify-between p-3 font-medium text-sm"
                  onClick={() => toggleSection("categories")}
                >
                  Categories{" "}
                  <IoChevronDown
                    className={`transition-transform ${expandedSections.categories ? "rotate-180" : ""}`}
                  />
                </button>
                {expandedSections.categories && (
                  <div className="border-t border-border p-3 space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryClick(cat.slug)}
                        className={`w-full text-left text-sm py-1 px-2 rounded hover:bg-muted transition-colors ${selectedCategory === cat.slug ? "text-primary font-medium" : "text-muted-foreground"}`}
                      >
                        {String(cat.name ?? "") ?? cat.slug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attributes filter */}
              {attributes.map((attr) => (
                <div key={attr._id} className="overflow-hidden mb-4">
                  <div className="p-3 font-medium text-sm border-b border-border">
                    {String(attr.name ?? "") ?? attr.name}
                  </div>
                  <div className="p-3 flex flex-wrap gap-2">
                    {attr.values.map((val) => (
                      <button
                        key={val._id ?? val.name}
                        className="px-2 py-1 text-xs border border-border rounded hover:border-primary transition-colors"
                      >
                        {val.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </aside>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {displayProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  No products found.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/search")}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
                >
                  {displayProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {visibleProduct < (productData as unknown[]).length && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleProduct((p) => p + 24)}
                    >
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
