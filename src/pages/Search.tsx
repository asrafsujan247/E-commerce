import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductSearchScreen from "@components/search/SearchScreenNew";

import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingCategory } from "@services/CategoryService";

import type { Product, Attribute, Category } from "@appTypes/index";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  // Accept ?_id=<ObjectId> (from CategoryNavigateButton) or ?category=<slug> (from slider/banner links)
  const category = searchParams.get("_id") || searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsResult, attributesResult, categoriesResult] =
          await Promise.all([
            getShowingStoreProducts({ category, title: query }),
            getShowingAttributes(),
            getShowingCategory(),
          ]);

        const firstError =
          productsResult.error ??
          attributesResult.error ??
          categoriesResult.error ??
          null;

        setError(firstError);
        setProducts(productsResult.products ?? []);
        setAttributes(attributesResult.attributes ?? []);
        setCategories(categoriesResult.categories ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load search results",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, category]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Search Error
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProductSearchScreen
      products={products}
      attributes={attributes}
      categories={categories}
      searchQuery={query}
      selectedCategory={category}
    />
  );
};

export default Search;
