import { useEffect, useRef, useState } from "react";
import { IoAdd, IoRemove, IoExpand, IoBagAdd } from "react-icons/io5";
import { Link } from "react-router-dom";

// Internal imports
import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError } from "@utils/toast";
import Rating from "@components/common/Rating";
import useAddToCart from "@hooks/useAddToCart";
import { useSetting } from "@stores/useSettingStore";
import Discount from "@components/common/Discount";
import { handleLogEvent } from "@lib/analytics";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useCartStore } from "@stores/useCartStore";
import type { ProductAttribute } from "@appTypes/index";

interface Campaign {
  inCampaign?: boolean;
  campaignPrice: number;
  campaignOriginalPrice: number;
  campaignRemainingStock: number;
  campaignSoldCount?: number;
  campaignStockLimit: number;
  campaignId: string;
  [key: string]: unknown;
}

interface ProductPrices {
  price: number;
  originalPrice?: number;
}

interface ProductVariant {
  price?: number;
  originalPrice?: number;
  [key: string]: unknown;
}

interface Product {
  _id: string;
  slug: string;
  title: unknown;
  image?: string | string[];
  stock?: number;
  isCombination?: boolean;
  variants?: ProductVariant[];
  prices?: ProductPrices;
  campaign?: Campaign;
  average_rating?: number;
  total_reviews?: number;
  categories?: unknown;
  description?: unknown;
  [key: string]: unknown;
}

interface ProductCardProps {
  product: Product;
  attributes?: ProductAttribute[];
}

const ProductCard = ({ product, attributes }: ProductCardProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { globalSetting } = useSetting();

  const { items, addItem, updateItemQuantity, inCart } = useCartStore();
  const { handleIncreaseQuantity } = useAddToCart();

  const campaign = product?.campaign || null;
  const isInCampaign = !!(campaign && campaign.inCampaign !== false);

  const effectivePrice = isInCampaign
    ? campaign.campaignPrice
    : product?.isCombination
      ? product?.variants?.[0]?.price
      : product?.prices?.price;
  const effectiveOriginalPrice = isInCampaign
    ? campaign.campaignOriginalPrice
    : product?.isCombination
      ? product?.variants?.[0]?.originalPrice
      : product?.prices?.originalPrice;

  const handleAddItem = (p: Product) => {
    const stockToCheck = isInCampaign
      ? campaign!.campaignRemainingStock
      : (p.stock ?? 0);
    if (stockToCheck < 1) return notifyError("Insufficient stock!");

    if (p?.variants && p.variants.length > 0) {
      setModalOpen(!modalOpen);
      return;
    }
    const {
      variants,
      categories,
      description,
      campaign: _c,
      ...updatedProduct
    } = product;
    const newItem = {
      ...updatedProduct,
      title: String(p?.title ?? ""),
      id: p._id,
      variant: isInCampaign
        ? { ...p.prices, price: campaign!.campaignPrice }
        : p.prices,
      price: isInCampaign ? campaign!.campaignPrice : p.prices!.price,
      originalPrice: isInCampaign
        ? campaign!.campaignOriginalPrice
        : product.prices?.originalPrice,
      ...(isInCampaign
        ? {
            campaignId: campaign!.campaignId,
            campaignPrice: campaign!.campaignPrice,
            inCampaign: true,
            campaignRemainingStock: campaign!.campaignRemainingStock,
          }
        : {}),
    };
    addItem(newItem);
  };

  const handleModalOpen = (event: boolean) => {
    setModalOpen(event);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setModalOpen]);

  return (
    <>
      {modalOpen && (
        <ProductModal
          product={product as unknown as import("@appTypes/index").Product}
          modalOpen={modalOpen}
          attributes={attributes}
          setModalOpen={setModalOpen}
          campaignInfo={isInCampaign ? campaign : null}
        />
      )}

      <div className="group relative flex flex-col overflow-hidden rounded-sm bg-card transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1">
        <div className="w-full flex justify-between">
          <Discount product={product} />
        </div>
        <div className="relative w-full min-h-48 lg:h-48 xl:h-52">
          <Link
            to={`/product/${product?.slug}`}
            className="relative block w-full h-full overflow-hidden bg-muted"
          >
            <ImageWithFallback
              alt="product"
              src={
                Array.isArray(product.image)
                  ? product.image[0]
                  : (product.image as string | undefined)
              }
            />
          </Link>
          <div className="absolute lg:bottom-0 bottom-4 lg:group-hover:bottom-4 inset-x-1 opacity-100 flex justify-center lg:opacity-0 lg:invisible group-hover:opacity-100 group-hover:visible transition-all">
            <button
              aria-label="quick view"
              onClick={() => {
                handleModalOpen(!modalOpen);
                handleLogEvent(
                  "product",
                  `opened ${String(product?.title ?? "")} product modal`,
                );
              }}
              className="relative h-auto inline-flex items-center cursor-pointer justify-center rounded-full transition-colors text-xs py-2 px-4 bg-background text-muted-foreground dark:bg-background dark:text-muted-foreground hover:text-primary hover:bg-muted dark:hover:bg-accent shadow-lg focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-primary dark:focus:ring-offset-0"
            >
              <IoExpand />
              <span className="ms-1 hidden xl:block lg:block">Quick View</span>
            </button>
          </div>

          <div className="absolute bottom-3 right-3 z-[5] flex items-center justify-center rounded-full bg-background text-muted-foreground shadow-lg transition-all duration-300 ease-in-out hover:bg-muted hover:text-primary">
            {inCart(product._id) ? (
              <div>
                {items.map(
                  (item) =>
                    item.id === product._id && (
                      <div
                        key={item.id}
                        className="flex flex-col w-11 h-22 items-center p-1 justify-between bg-primary text-primary-foreground ring-2 ring-white rounded-full"
                      >
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.id,
                              (item.quantity ?? 1) - 1,
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
                            item?.variants &&
                            (item.variants as unknown[]).length > 0
                              ? handleAddItem(item as unknown as Product)
                              : handleIncreaseQuantity(item)
                          }
                        >
                          <span className="text-lg cursor-pointer">
                            <IoAdd />
                          </span>
                        </button>
                      </div>
                    ),
                )}{" "}
              </div>
            ) : (
              <button
                onClick={() => handleAddItem(product)}
                aria-label="cart"
                className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer border-2 bg-primary text-primary-foreground border-primary font-medium transition-colors duration-300 hover:bg-primary/90 hover:border-primary hover:text-primary-foreground focus:border-primary focus:bg-primary focus:text-primary-foreground"
              >
                {" "}
                <IoBagAdd className="text-xl" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 px-4 pt-2 pb-4">
          <div className="relative mb-1">
            <Link
              to={`/product/${product?.slug}`}
              className="text-sm font-medium text-foreground line-clamp-1 hover:text-primary"
            >
              {String(product?.title ?? "")}
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

          <Price
            card
            product={product}
            price={effectivePrice}
            originalPrice={effectiveOriginalPrice}
            campaign={isInCampaign ? (campaign ?? undefined) : undefined}
          />

          {isInCampaign && campaign && (
            <div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
                <span>{campaign.campaignSoldCount || 0} Sold</span>
                <span>
                  {campaign.campaignSoldCount || 0}/
                  {campaign.campaignStockLimit}
                </span>
              </div>
              <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${campaign.campaignStockLimit > 0 ? Math.min(Math.round(((campaign.campaignSoldCount || 0) / campaign.campaignStockLimit) * 100), 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductCard;
