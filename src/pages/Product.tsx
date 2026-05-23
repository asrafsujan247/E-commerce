import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";

import ProductScreen from "@components/slug-card/ProductScreen";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";

import type { Product as ProductType, Attribute, Review } from "@appTypes/index";

interface ProductData {
  product: ProductType | null;
  reviews: Review[];
  relatedProducts: ProductType[];
  attributes: Attribute[];
}

const Product = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<ProductData>({
    product: null,
    reviews: [],
    relatedProducts: [],
    attributes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsResult, attributesResult] = await Promise.all([
          getShowingStoreProducts({ slug }),
          getShowingAttributes(),
        ]);

        const product =
          productsResult.products.length > 0
            ? productsResult.products[0]
            : null;

        if (!product) {
          setNotFound(true);
          return;
        }

        setData({
          product,
          reviews: productsResult.reviews ?? [],
          relatedProducts: productsResult.relatedProducts ?? [],
          attributes: attributesResult.attributes ?? [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

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
            Product Error
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.product) return null;

  return (
    <ProductScreen
      product={data.product}
      reviews={data.reviews as unknown as { _id: string; rating: number; comment: string; images: string[]; [key: string]: unknown }[]}
      attributes={data.attributes}
      relatedProducts={data.relatedProducts}
    />
  );
};

export default Product;
