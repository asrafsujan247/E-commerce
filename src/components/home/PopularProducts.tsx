import { Link } from "react-router-dom";
import type { Product } from "@appTypes/index";

interface PopularProductsProps {
  products: Product[];
}

const PopularProducts = ({ products }: PopularProductsProps) => {
  const items = products.slice(0, 12);
  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-5">
      <div className="bg-white rounded-sm p-5">
        <h2 className="text-[15px] font-semibold text-gray-900 mb-5">
          Popular Products
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6">
          {items.map((product) => {
            const imageArr = product.image;
            const imgSrc = Array.isArray(imageArr)
              ? imageArr[0]
              : (imageArr as string | undefined);
            const title = String(product.title ?? '');

            return (
              <Link
                key={product._id}
                to={`/product/${product.slug}`}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-full flex items-center justify-center h-36 sm:h-40">
                  <img
                    src={imgSrc}
                    alt={title}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "/placeholder.png";
                    }}
                  />
                </div>
                <p className="mt-2 text-[12.5px] text-gray-700 leading-snug group-hover:text-primary line-clamp-2 transition-colors">
                  {title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularProducts;
