import React, { useEffect, useState } from "react";

import useFilter from "@hooks/useFilter";
import Card from "@components/cta-card/Card";
import ProductCard from "@components/product/ProductCard";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import { Button } from "@components/ui/button";
import type { ProductAttribute } from "@appTypes/index";

interface Product {
  _id?: string;
  [key: string]: unknown;
}

interface Category {
  _id?: string;
  [key: string]: unknown;
}

interface SearchScreenProps {
  products?: Product[];
  attributes?: ProductAttribute[];
  categories?: Category[];
}

const SearchScreen: React.FC<SearchScreenProps> = ({ products, attributes, categories }) => {
  const [visibleProduct, setVisibleProduct] = useState(18);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { setSortedField, productData } = useFilter(products);
  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="flex py-10 lg:py-12">
        <div className="flex w-full">
          <div className="w-full">
            <div className="w-full grid grid-col gap-4 grid-cols-1 2xl:gap-6 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2">
              <Card />
            </div>
            <div className="relative">
              <CategoryCarousel categories={(categories ?? []) as unknown as import("@appTypes/index").Category[]} />
            </div>
            {productData?.length === 0 ? (
              <div className="mx-auto p-5 my-5">
                <img
                  className="my-4 mx-auto"
                  src="/no-result.svg"
                  alt="no-result"
                  width={400}
                  height={380}
                />
                <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium text-muted-foreground">
                  Sorry, we can not find this product 😞
                </h2>
              </div>
            ) : (
              <div className="flex justify-between my-3 bg-primary/10 border border-border rounded p-3">
                <h6 className="text-sm">
                  Total <span className="font-bold">{productData?.length}</span>{" "}
                  Items Found
                </h6>
                <span className="text-sm">
                  <select
                    onChange={(e) => setSortedField(e.target.value)}
                    className="py-0 text-sm font-medium block w-full rounded border-0 bg-background pr-10 cursor-pointer focus:ring-0"
                  >
                    <option className="px-3" value="All" hidden>
                      Sort By Price
                    </option>
                    <option className="px-3" value="Low">
                      Low to High
                    </option>
                    <option className="px-3" value="High">
                      High to Low
                    </option>
                  </select>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
              {productData?.slice(0, visibleProduct).map((product, i) => (
                <ProductCard
                  key={i + 1}
                  product={product as unknown as import("@appTypes/index").Product}
                  attributes={attributes}
                />
              ))}
            </div>

            {(productData?.length ?? 0) > visibleProduct && (
              <Button
                onClick={() => setVisibleProduct((pre) => pre + 10)}
                variant="create"
                className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 mt-6"
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
