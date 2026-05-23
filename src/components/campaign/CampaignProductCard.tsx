import React, { useState } from "react";
import { IoAdd, IoExpand, IoBagAdd, IoRemove } from "react-icons/io5";
import { Link } from "react-router-dom";

import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import { handleLogEvent } from "@lib/analytics";
import Discount from "@components/common/Discount";
import PriceTwo from "@components/common/PriceTwo";
import Rating from "@components/common/Rating";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useCartStore } from "@stores/useCartStore";
import { ProductAttribute } from "@appTypes/index";

interface CampaignProductItem {
  _id?: string;
  title?: Record<string, string> | string;
  slug?: string;
  image?: string | string[];
  stock?: number;
  average_rating?: number;
  total_reviews?: number;
  variants?: unknown[];
  categories?: unknown;
  description?: unknown;
  prices?: {
    price?: number;
    originalPrice?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface CampaignProduct {
  product?: CampaignProductItem;
  campaignPrice: number;
  originalPrice: number;
  stockLimit: number;
  soldCount?: number;
}

interface CampaignProductCardProps {
  campaignProduct: CampaignProduct;
  campaignId: string;
  attributes?: ProductAttribute[];
}

const CampaignProductCard: React.FC<CampaignProductCardProps> = ({
  campaignProduct,
  campaignId,
  attributes,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { items, addItem, updateItemQuantity, inCart } = useCartStore();
  const { handleIncreaseQuantity } = useAddToCart();

  const product = campaignProduct?.product;
  if (!product) return null;

  const {
    campaignPrice,
    originalPrice,
    stockLimit,
    soldCount = 0,
  } = campaignProduct;

  const soldPercent =
    stockLimit > 0 ? Math.round((soldCount / stockLimit) * 100) : 0;
  const isOutOfStock = Math.max(0, stockLimit - soldCount) <= 0;

  const campaignPricedProduct = {
    ...product,
    variants: product.variants as Array<{ [key: string]: unknown }> | undefined,
    prices: {
      ...product.prices,
      price: campaignPrice,
      originalPrice: originalPrice,
    },
  };

  const handleAddItem = (p: CampaignProductItem) => {
    if (isOutOfStock) return notifyError("This deal is sold out!");
    if ((p.stock ?? 0) < 1) return notifyError("Insufficient stock!");

    if ((p?.variants?.length ?? 0) > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const { variants: _v, categories: _c, description: _d, ...updatedProduct } =
      product;
    const remainingStock = Math.max(0, stockLimit - soldCount);
    const newItem = {
      ...updatedProduct,
      title: String(p?.title ?? ''),
      id: p._id ?? "",
      variant: { ...p.prices, price: campaignPrice },
      price: campaignPrice,
      originalPrice: originalPrice,
      inCampaign: true,
      campaignId: campaignId,
      campaignRemainingStock: remainingStock,
    };
    addItem(newItem);
  };

  const modalCampaignInfo = {
    campaignId,
    campaignPrice,
    campaignOriginalPrice: originalPrice,
    campaignRemainingStock: Math.max(0, stockLimit - soldCount),
    campaignStockLimit: stockLimit,
    campaignSoldCount: soldCount,
    inCampaign: true,
  };

  const handleModalOpen = (event: boolean) => {
    setModalOpen(event);
  };

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product as unknown as import("@appTypes/index").Product}
          attributes={attributes}
          campaignInfo={modalCampaignInfo}
        />
      )}

      <div
        className={`group relative flex flex-col overflow-hidden rounded-xl border bg-card my-3 transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 ${
          isOutOfStock ? "opacity-60" : ""
        }`}
      >
        <div className="w-full flex justify-between">
          <Discount product={campaignPricedProduct} />
        </div>
        <div className="relative w-full min-h-48 lg:h-48 xl:h-52">
          <Link
            to={`/product/${product?.slug}`}
            className="relative block w-full h-full overflow-hidden bg-muted"
          >
            <ImageWithFallback alt="product" src={product.image?.[0]} />
          </Link>
          <div className="absolute lg:bottom-0 bottom-4 lg:group-hover:bottom-4 inset-x-1 opacity-100 flex justify-center lg:opacity-0 lg:invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              aria-label="quick view"
              onClick={() => {
                handleModalOpen(!modalOpen);
                handleLogEvent(
                  "product",
                  `opened ${String(
                    product?.title as Record<string, string>
                   ?? '')} product modal`
                );
              }}
              className="relative h-auto inline-flex items-center cursor-pointer justify-center rounded-full transition-colors text-xs py-2 px-4 bg-background text-muted-foreground dark:bg-background dark:text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-accent shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-offset-0"
            >
              <IoExpand />
              <span className="ms-1 hidden xl:block lg:block">Quick View</span>
            </button>
          </div>
          <div className="absolute bottom-3 right-3 z-10 flex items-center justify-center rounded-full bg-background text-muted-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-muted hover:text-primary">
            {!isOutOfStock ? (
              inCart(product._id ?? "") ? (
                <div>
                  {items.map(
                    (item) =>
                      item.id === (product._id ?? "") && (
                        <div
                          key={item.id}
                          className="flex flex-col w-11 h-22 items-center p-1 justify-between bg-primary text-primary-foreground ring-2 ring-white rounded-full"
                        >
                          <button
                            onClick={() =>
                              updateItemQuantity(
                                item.id,
                                (item.quantity ?? 1) - 1
                              )
                            }
                          >
                            <span className="text-xl cursor-pointer">
                              <IoRemove />
                            </span>
                          </button>
                          <p className="text-sm px-1 font-medium">
                            {item.quantity}
                          </p>
                          <button
                            onClick={() =>
                              (item?.variants as unknown[])?.length > 0
                                ? handleAddItem(
                                    item as unknown as CampaignProductItem
                                  )
                                : handleIncreaseQuantity(item)
                            }
                          >
                            <span className="text-lg cursor-pointer">
                              <IoAdd />
                            </span>
                          </button>
                        </div>
                      )
                  )}{" "}
                </div>
              ) : (
                <button
                  onClick={() => handleAddItem(product)}
                  aria-label="cart"
                  className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-2 bg-primary text-primary-foreground border-border font-medium transition-colors duration-300 hover:border-accent hover:bg-primary/90 hover:border-primary focus:border-primary focus:bg-primary focus:text-primary-foreground"
                >
                  {" "}
                  <IoBagAdd className="text-xl" />
                </button>
              )
            ) : null}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-10">
              <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm">
                SOLD OUT
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col space-y-2 px-4 pt-2 pb-2">
          <div className="relative mb-1">
            <Link
              to={`/product/${product?.slug}`}
              className="text-sm font-medium text-foreground line-clamp-1 hover:text-primary"
            >
              {String(product?.title ?? '')}
            </Link>
          </div>
          <div className="flex gap-0.5 items-center">
            <Rating
              size="md"
              showReviews={true}
              rating={product?.average_rating}
              totalReviews={product?.total_reviews}
            />
          </div>

          <PriceTwo
            card
            product={campaignPricedProduct}
            price={campaignPrice}
            originalPrice={originalPrice}
          />
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{soldCount} Sold</span>
            <span>
              {soldCount}/{stockLimit}
            </span>
          </div>
          <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(soldPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignProductCard;
