import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignalIcon } from "@heroicons/react/24/outline";
import { getShowingStoreProducts } from "@services/ProductServices";
import type { Product } from "@appTypes/index";

const getVisibleCount = () => {
  if (typeof window === "undefined") return 5;
  if (window.innerWidth >= 1536) return 6;
  if (window.innerWidth >= 1280) return 5;
  if (window.innerWidth >= 1024) return 4;
  return 3;
};

const YouMayLike = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);

  useEffect(() => {
    getShowingStoreProducts({}).then((res) => {
      const popular =
        res.popularProducts.length > 0 ? res.popularProducts : res.products;
      setProducts(popular.slice(0, 6));
    });
  }, []);

  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex flex-col p-4 h-full">
      <h3 className="font-bold text-gray-900 text-[14px] mb-3 leading-tight">
        You May Like
      </h3>

      <ul className="flex flex-col gap-3 flex-1">
        {products.slice(0, visibleCount).map((product) => (
          <li key={product._id}>
            <Link
              to={`/product/${product.slug}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-15 h-15 shrink-0 overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={
                    Array.isArray(product.image)
                      ? product.image[0]
                      : (product.image as string | undefined)
                  }
                  alt={String(product.title ?? '')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.png";
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="block text-[12.5px] font-medium text-[#1a4fb3] group-hover:underline leading-snug line-clamp-2">
                  {String(product.title ?? '')}
                </span>
                <span className="block text-[11px] text-gray-400 mt-0.5">
                  {product.prices?.minPrice != null
                    ? `$${product.prices.minPrice}${product.prices.maxPrice !== product.prices.minPrice ? `-${product.prices.maxPrice}` : ""}`
                    : ""}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[11.5px] text-gray-400 mb-2">
          No desirable products?
        </p>
        <Link
          to="/search"
          className="flex items-center justify-center gap-1.5 w-full border border-primary text-primary rounded-sm px-3 py-1.75 text-[12px] font-medium hover:bg-primary/5 transition-colors"
        >
          <SignalIcon className="h-6 w-6 shrink-0" />
          Post Your Request No
        </Link>
      </div>
    </div>
  );
};

export default YouMayLike;
