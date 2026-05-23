import { Link } from "react-router-dom";
import {
  FiEye,
  FiHeadphones,
  FiMinus,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";

// Internal imports
import Price from "@components/common/Price";
import Tags from "@components/common/Tags";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@components/common/Discount";
import VariantList from "@components/variants/VariantList";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Rating from "@components/common/Rating";
import Stock from "@components/common/Stock";
import useProductAction from "@hooks/useProductAction";
import { useSetting } from "@stores/useSettingStore";
import MainModal from "./MainModal";
import type { Product, ProductAttribute } from "@appTypes/index";

// Types
interface ProductCampaignInfo {
  campaignPrice: number;
  campaignOriginalPrice?: number;
  campaignRemainingStock: number;
  campaignId: string;
  inCampaign?: boolean;
  [key: string]: unknown;
}

interface ProductModalProps {
  product: Product & {
    campaign?: ProductCampaignInfo;
    prices?: { price?: number; originalPrice?: number; discount?: number };
    stock?: number;
    image?: string | string[];
    quantity?: number;
    average_rating?: number;
    total_reviews?: number;
    category?: { _id?: string; name?: string | Record<string, string> } | string;
    title?: string | Record<string, string>;
    description?: string | Record<string, string>;
  };
  modalOpen: boolean;
  attributes?: ProductAttribute[];
  setModalOpen: (open: boolean) => void;
  campaignInfo?: ProductCampaignInfo | null;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  modalOpen,
  attributes,
  setModalOpen,
  campaignInfo,
}) => {
  const { globalSetting } = useSetting();
  const { item, setItem } = useAddToCart();
  const {
    // state
    value,
    setValue,
    price,
    stock,
    discount,
    selectedImage,
    originalPrice,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    selectVa,
    setSelectVa,
    variantTitle,

    // campaign state
    isInCampaign,
    campaign,

    // actions
    handleAddToCart,
  } = useProductAction({
    product: product as unknown as Parameters<typeof useProductAction>[0]["product"],
    attributes,
    globalSetting,
    campaignInfo,
    onCloseModal: () => setModalOpen(false),
    withRouter: true,
  });

  return (
    <>
      <MainModal
        modalOpen={modalOpen}
        bottomCloseBtn={false}
        handleCloseModal={() => setModalOpen(false)}
      >
        <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="lg:flex flex-col lg:flex-row md:flex-row w-full max-w-4xl overflow-hidden">
            <Link
              to={`/product/${product.slug}`}
              className="w-full lg:w-[40%]"
            >
              <div
                onClick={() => setModalOpen(false)}
                className="flex-shrink-0 flex items-center justify-center h-auto cursor-pointer"
              >
                {product?.image?.[0] ? (
                  <img
                    src={selectedImage || product.image[0]}
                    width={420}
                    height={420}
                    alt="product"
                    className="object-contain"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    width={420}
                    height={420}
                    alt="product Image"
                    className="object-contain"
                  />
                )}
              </div>
            </Link>

            <div className="w-full lg:w-[60%] pt-6 lg:pt-0 lg:pl-7 xl:pl-10">
              <div className="mb-2 md:mb-2.5 block -mt-1.5">
                <div
                  className={`${
                    stock <= 0 ? "relative py-1 mb-2" : "relative"
                  }`}
                >
                  <Stock stock={stock} />
                </div>
                <Link to={`/product/${product.slug}`}>
                  <h2
                    onClick={() => setModalOpen(false)}
                    className="text-foreground text-lg md:text-xl lg:text-xl font-medium hover:text-primary cursor-pointer"
                  >
                    {String(
                      product?.title as Record<string, string>
                     ?? '')}
                  </h2>
                </Link>
                <div className="flex gap-0.5 items-center mt-1">
                  {/* Rating */}
                  <Rating
                    size="md"
                    showReviews={true}
                    rating={product?.average_rating}
                    totalReviews={product?.total_reviews}
                  />
                </div>
              </div>
              <p className="text-sm leading-6 text-muted-foreground md:leading-6">
                {String(
                  product?.description as Record<string, string>
                 ?? '')}
              </p>
              <div className="flex items-center my-4">
                <Price
                  price={price}
                  product={product}
                  originalPrice={originalPrice}
                  campaign={isInCampaign ? (campaign ?? undefined) : undefined}
                />
                <span className="ml-2">
                  <Discount product={product} discount={discount} />
                </span>
              </div>

              {isInCampaign && campaign && (
                <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Campaign Deal — Only {campaign.campaignRemainingStock} left!
                  </div>
                </div>
              )}

              <div className="mb-6">
                {variantTitle?.map((a) => (
                  <span key={a._id} className="mb-2 block">
                    <h4 className="text-sm py-1 text-foreground font-medium">
                      {String(
                        a?.name as unknown as Record<string, string>
                       ?? '')}:
                    </h4>
                    <VariantList
                      att={a._id}
                      option={a.values as unknown as { [key: string]: unknown }[]}
                      setValue={setValue}
                      varTitle={variantTitle}
                      variants={product?.variants}
                      setSelectVa={setSelectVa}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                    />
                  </span>
                ))}
              </div>

              <div className="flex items-center mt-4">
                <div className="w-full grid lg:grid-cols-3 sm:grid-cols-3 gap-3">
                  <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border border-border">
                    <button
                      onClick={() => setItem(item - 1)}
                      disabled={item === 1}
                      className="flex items-center cursor-pointer justify-center py-2 px-4 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-foreground border-e border-border hover:text-muted-foreground"
                    >
                      <span className="text-xl">
                        <FiMinus />
                      </span>
                    </button>
                    <p className="font-semibold text-sm">{item}</p>
                    <button
                      onClick={() => setItem(item + 1)}
                      disabled={
                        (product.quantity ?? 0) < item ||
                        (product.quantity ?? 0) === item
                      }
                      className="flex items-center cursor-pointer justify-center py-2 px-4 h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-foreground border-s border-border hover:text-muted-foreground"
                    >
                      <span className="text-xl">
                        <FiPlus />
                      </span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={(product.quantity ?? 0) < 1}
                    className="w-full text-sm flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-primary-foreground py-2 px-4 bg-primary hover:bg-primary/90"
                  >
                    <FiShoppingBag className="mr-2" />
                    Add to cart
                  </button>
                  <Link
                    to={`/product/${product.slug}`}
                    className="w-full relative h-auto flex items-center font-semibold text-sm text-foreground justify-center rounded-md transition-colors py-2 px-4 border border-border bg-card hover:bg-accent hover:text-primary"
                  >
                    <FiEye className="mr-2" />
                    View details
                  </Link>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <div className="flex items-center justify-between space-x-3 sm:space-x-4 w-full">
                  <div>
                    <span className="font-semibold py-1 text-sm block">
                      <span className="text-muted-foreground">Category</span>{" "}
                      <Link
                        to={`/search?category=${String(
                          (typeof product?.category === "object" && product?.category !== null ? (product.category as { name?: Record<string, string> } ?? '').name : undefined) as Record<string, string>
                        )}&_id=${typeof product?.category === "object" && product?.category !== null ? (product.category as { _id?: string })._id : ""}`}
                        className="cursor-pointer"
                      >
                        <button
                          type="button"
                          className="text-muted-foreground font-medium ml-2 hover:text-primary"
                        >
                          {String(
                            (typeof product?.category === "object" && product?.category !== null ? (product.category as { name?: Record<string, string> } ?? '').name : undefined) as Record<string, string>
                          )}
                        </button>
                      </Link>
                    </span>

                    <Tags product={product} />
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                <FiHeadphones className="mr-1 text-muted-foreground text-md" />
                Call Us for Order
                <a
                  href={`tel:${globalSetting?.contact || "+099949343"}`}
                  className="font-bold text-primary ml-1"
                >
                  {globalSetting?.contact || "+099949343"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </MainModal>
    </>
  );
};

export default ProductModal;
