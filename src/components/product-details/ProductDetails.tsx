import { Link, useNavigate } from "react-router-dom";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { Fragment, useState } from "react";

// internal imports

import Tags from "@components/common/Tags";
import Discount from "@components/common/Discount";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import ImageCarousel from "@components/carousel/ImageCarousel";
import { useSetting } from "@stores/useSettingStore";
import useProductAction from "@hooks/useProductAction";
import { Button } from "@components/ui/button";
// import ProductReviews from "./ProductReviews";
import { FiChevronRight, FiHeadphones, FiBriefcase } from "react-icons/fi";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import CampaignCountdown from "@components/campaign/CampaignCountdown";
import type { Product, ProductAttribute } from "@appTypes/index";

// interface ReviewItem {
//   _id: string;
//   user?: { name?: string; image?: string };
//   rating: number;
//   comment: string;
//   createdAt?: string;
//   images: string[];
// }

interface ProductDetailsProps {
  product: Product;
  // reviews?: ReviewItem[];
  attributes?: ProductAttribute[];
  relatedProducts?: Product[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  // reviews,
  attributes,
  relatedProducts,
}) => {
  const navigate = useNavigate();
  const { globalSetting, storeCustomization } = useSetting();
  const {
    setValue,
    discount,
    isReadMore,
    selectedImage,
    setSelectedImage,
    selectVariant,
    setSelectVariant,
    setSelectVa,
    variantTitle,
    category_name,
    category_display_name,
    isInCampaign,
    campaign,
    handleAddToCart,
  } = useProductAction({
    product: product as unknown as Parameters<
      typeof useProductAction
    >[0]["product"],
    attributes,
    globalSetting,
  });

  const productImages: string[] = Array.isArray(product?.image)
    ? (product.image as string[])
    : product?.images?.length
      ? product.images
      : product?.image
        ? [product.image as string]
        : [];

  type VariantTitleItem = {
    _id: string;
    name: unknown;
    option: string;
    variants: unknown[];
  };

  type ProductCampaignInfo = {
    campaignRemainingStock?: number;
    campaignEndTime?: string;
    campaignStartTime?: string;
  };

  const [videoOpen, setVideoOpen] = useState(false);

  const videoLink = String((product as any)?.video?.link ?? "");
  const ytId =
    videoLink.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    )?.[1] ?? null;
  const ytThumb = ytId
    ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    : null;

  return (
    <>
      <div className="bg-white px-0 pb-8 lg:pb-12">
        <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
          <div className="hidden md:flex items-center py-4 lg:py-6">
            <ol className="flex items-center w-full overflow-hidden text-muted-foreground">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link to="/">Home</Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-primary font-semibold">
                <Link
                  to={`/search?category=${category_name}&_id=${typeof product?.category === "object" ? product.category?._id : ""}`}
                >
                  <button type="button">{category_display_name}</button>
                </Link>
              </li>
              <li className="text-sm mt-[1px]">
                {" "}
                <FiChevronRight />{" "}
              </li>
              <li className="text-sm px-1 transition duration-200 ease-in">
                {String(product?.title ?? "")}
              </li>
            </ol>
          </div>
          {/* Product */}
          <div className="relative lg:grid lg:grid-cols-2 lg:grid-rows-1 lg:gap-x-10 pt-8 md:pt-0">
            {/* Product image */}
            <div className="lg:col-span-1 lg:row-end-1 lg:sticky lg:top-6 lg:self-start">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Vertical thumbnail strip — lg+ only */}
                {productImages.length > 1 && (
                  <div className="hidden lg:block w-20 shrink-0">
                    <ImageCarousel
                      images={productImages}
                      handleChangeImage={
                        setSelectedImage as (img: string) => void
                      }
                      vertical
                    />
                  </div>
                )}

                {/* Main image */}
                <div className="flex-1 overflow-hidden">
                  {productImages[0] ? (
                    <img
                      src={(selectedImage as string) || productImages[0]}
                      alt="product"
                      className="aspect-square w-full rounded-xl bg-muted object-cover"
                    />
                  ) : (
                    <img
                      src="/placeholder.png"
                      alt="product Image"
                      className="aspect-square w-full rounded-xl bg-muted object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Horizontal thumbnail strip — below lg */}
              {productImages.length > 1 && (
                <div className="flex lg:hidden flex-row flex-wrap mt-4">
                  <ImageCarousel
                    images={productImages}
                    handleChangeImage={
                      setSelectedImage as (img: string) => void
                    }
                  />
                </div>
              )}

              {/* Add to compare — below image */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleAddToCart(1)}
                  className="h-11 text-sm font-semibold inline-flex items-center gap-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors px-8"
                >
                  <ShoppingCartIcon className="size-5 shrink-0" />
                  Add Inquiry Basket to Compare
                </button>
              </div>
            </div>

            {/* Product details */}
            <div className="mt-6 lg:mt-0 self-start z-10 mx-auto lg:mx-0 lg:col-span-1 lg:max-w-none">
              {/* Campaign Banner */}
              {isInCampaign && campaign && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">
                        Campaign Deal
                      </span>
                      <span className="text-xs text-red-500 dark:text-red-300">
                        — Only{" "}
                        {
                          (campaign as ProductCampaignInfo)
                            .campaignRemainingStock
                        }{" "}
                        left at this price!
                      </span>
                    </div>
                    <CampaignCountdown
                      endTime={
                        (campaign as ProductCampaignInfo).campaignEndTime ?? ""
                      }
                      startTime={
                        (campaign as ProductCampaignInfo).campaignStartTime ??
                        ""
                      }
                    />
                  </div>
                </div>
              )}

              <div className="mb-2 md:mb-5 block -mt-1.5">
                <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold text-foreground">
                  {String(product?.title ?? "")}
                </h1>
              </div>
              <div className="flex items-center mb-8 border-t border-border pt-5">
                <div className="product-price font-bold">
                  <span className="inline-block text-xl">
                    BDT {(product?.prices?.minPrice ?? 0).toFixed(2)}-
                    {(product?.prices?.maxPrice ?? 0).toFixed(2)}
                  </span>
                </div>
                <span className="ml-2 block">
                  <Discount slug product={product} discount={discount} />
                </span>
              </div>
              <div className="mb-6">
                {(
                  variantTitle as unknown as VariantTitleItem[] | undefined
                )?.map((a) => (
                  <span key={a._id} className="mb-2 block">
                    <h4 className="text-sm py-1 text-foreground font-medium">
                      {String(a?.name ?? "")}:
                    </h4>

                    <VariantList
                      att={a._id}
                      option={a.option}
                      setValue={setValue}
                      varTitle={variantTitle}
                      setSelectVa={setSelectVa}
                      variants={product.variants}
                      selectVariant={selectVariant}
                      setSelectVariant={setSelectVariant}
                      attributeValues={
                        attributes?.find((attr) => attr._id === a._id)?.values
                      }
                    />
                  </span>
                ))}
              </div>

              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                  <Button
                    variant="create"
                    className="w-full h-11 text-sm font-semibold has-[>svg]:px-4"
                  >
                    Start Order Request
                  </Button>
                  <button
                    type="button"
                    onClick={() => navigate("/inquiry", { state: { product } })}
                    className="w-full h-11 text-sm font-semibold border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors px-4"
                  >
                    Send Inquiry
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hi Team, I am interested in "${product?.title}". Could you please assist?\n\n${window.location.href}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 text-sm font-semibold inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors px-4"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 shrink-0"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Buy On Chat
                  </a>
                </div>

                {/* Product Details Preview */}
                <div className="mt-6 rounded-lg border border-border overflow-hidden text-sm">
                  <button
                    type="button"
                    onClick={() =>
                      (() => {
                        const el = document.getElementById("product-info");
                        if (!el) return;
                        const navbar =
                          document.querySelector<HTMLElement>(".sticky.top-0");
                        const offset = (navbar?.offsetHeight ?? 80) + 16;
                        window.scrollTo({
                          top:
                            el.getBoundingClientRect().top +
                            window.scrollY -
                            offset,
                          behavior: "smooth",
                        });
                      })()
                    }
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors border-b border-border"
                  >
                    <span className="text-base font-bold text-foreground">
                      Product Details
                    </span>
                    <FiChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                  <div className="px-4 py-1 divide-y divide-border">
                    {(
                      (product.specifications as
                        | { label: string; value: string }[]
                        | undefined) ?? []
                    )
                      .slice(0, 3)
                      .map((spec, i) => (
                        <div key={i} className="flex items-start py-2">
                          <span className="w-2/5 text-muted-foreground shrink-0">
                            {spec.label}:
                          </span>
                          <span className="font-semibold text-foreground">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    {!(product.specifications as any[])?.length && (
                      <div className="py-2 text-muted-foreground">
                        {String(product?.description ?? "").slice(0, 120)}…
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping */}
                <div className="mt-4 rounded-lg border border-border overflow-hidden text-sm">
                  <div className="px-4 py-3 bg-muted/30 border-b border-border">
                    <p className="text-base font-bold text-foreground">
                      Shipping
                    </p>
                  </div>
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span className="w-2/5 text-muted-foreground shrink-0">
                        Shipping Cost:
                      </span>
                      <span className="text-foreground">
                        Contact the supplier about freight and estimated
                        delivery time.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Guarantee */}
                <div className="mt-4 rounded-lg border border-border overflow-hidden text-sm">
                  <div className="px-4 py-3 bg-muted/30 border-b border-border">
                    <p className="text-base font-bold text-foreground">
                      Payment Guarantee
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-2/5 text-muted-foreground shrink-0 pt-0.5">
                        Payment Methods:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap gap-1">
                          {[
                            "T/T",
                            "PayPal",
                            "Apple Pay",
                            "Google Pay",
                            "Visa",
                            "Mastercard",
                            "Amex",
                            "Discover",
                          ].map((m) => (
                            <span
                              key={m}
                              className="inline-flex items-center px-1.5 py-0.5 rounded border border-border text-[11px] font-medium text-foreground bg-background whitespace-nowrap"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          Support payments in USD
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2/5 text-muted-foreground shrink-0">
                        Secure payments:
                      </span>
                      <span className="text-foreground">
                        Every payment you make is protected by our secure
                        platform.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-2/5 text-muted-foreground shrink-0">
                        Refund policy:
                      </span>
                      <span className="text-foreground">
                        Claim a refund if your order doesn't ship, is missing,
                        or arrives with product issues.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* products details and other info */}
          <div id="product-info" className="mx-auto w-full my-8 max-w-none">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: tabs */}
              <div className="flex-1 min-w-0 border border-border rounded-md p-4 md:p-6">
                <TabGroup defaultIndex={0}>
                  <div className="border-b border-border">
                    <TabList className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
                      <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap text-muted-foreground hover:border-border focus:outline-0 hover:text-foreground data-selected:border-primary data-selected:text-primary">
                        Description
                      </Tab>
                      <Tab className="cursor-pointer border-b-2 border-transparent pb-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap text-muted-foreground hover:border-border focus:outline-0 hover:text-foreground data-selected:border-primary data-selected:text-primary">
                        Specifications
                      </Tab>
                    </TabList>
                  </div>
                  <TabPanels as={Fragment}>
                    <TabPanel className="pt-8">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                        Product Overview
                      </p>
                      {(() => {
                        const raw = String(product?.description ?? "");
                        const parts = raw.split(/\n\n+/);
                        const paragraphs: string[] = [];
                        const bullets: string[] = [];
                        parts.forEach((part) => {
                          const lines = part
                            .split("\n")
                            .map((l) => l.trim())
                            .filter(Boolean);
                          const bulletLines = lines.filter((l) =>
                            l.startsWith("•"),
                          );
                          const textLines = lines.filter(
                            (l) => !l.startsWith("•"),
                          );
                          if (textLines.length)
                            paragraphs.push(textLines.join(" "));
                          bulletLines.forEach((l) =>
                            bullets.push(l.replace(/^•\s*/, "")),
                          );
                        });
                        return (
                          <>
                            {paragraphs.map((p, i) => (
                              <p
                                key={i}
                                className="text-sm text-muted-foreground leading-6 mb-4"
                              >
                                {p}
                              </p>
                            ))}
                            {bullets.length > 0 && (
                              <ul className="mt-2 space-y-3">
                                {bullets.map((b, i) => {
                                  const sepIdx = b.indexOf(" — ");
                                  const hasSep = sepIdx !== -1;
                                  const title = hasSep
                                    ? b.slice(0, sepIdx)
                                    : null;
                                  const body = hasSep ? b.slice(sepIdx + 3) : b;
                                  return (
                                    <li
                                      key={i}
                                      className="flex items-start gap-3 text-sm text-muted-foreground"
                                    >
                                      <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full border-2 border-primary/40 bg-primary/20" />
                                      <span>
                                        {title && (
                                          <>
                                            <strong className="font-semibold text-foreground">
                                              {title}
                                            </strong>
                                            {" — "}
                                          </>
                                        )}
                                        {body}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </>
                        );
                      })()}
                    </TabPanel>

                    <TabPanel className="pt-8">
                      <h3 className="sr-only">Product Specifications</h3>
                      {product?.specifications &&
                      (
                        product.specifications as {
                          label: string;
                          value: string;
                        }[]
                      ).length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-border">
                          <table className="w-full text-sm">
                            <tbody className="divide-y divide-border">
                              {(
                                product.specifications as {
                                  label: string;
                                  value: string;
                                }[]
                              ).map((spec, i) => (
                                <tr key={i}>
                                  <th
                                    scope="row"
                                    className="w-2/5 border-r border-border bg-muted/40 px-5 py-3 text-left align-top font-medium text-foreground"
                                  >
                                    {spec.label}
                                  </th>
                                  <td className="px-5 py-3 align-top text-muted-foreground">
                                    {spec.value}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No specifications available.
                        </p>
                      )}
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>

              {/* Right: independent resource sidebar */}
              <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-4">
                {/* Document */}
                {(product as any)?.document?.link && (
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-100">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 text-violet-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                        Document
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3">
                      <p className="text-sm font-medium text-foreground">
                        Product Document
                      </p>
                      <a
                        href={String((product as any).document.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background hover:bg-muted transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {/* Video */}
                {videoLink && (
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3 text-emerald-600"
                          fill="currentColor"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                        Video
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoOpen(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group text-left"
                    >
                      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                        {ytThumb && (
                          <img
                            src={ytThumb}
                            alt="thumbnail"
                            className="h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5 text-white"
                            fill="white"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Product Video
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Click to play
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                {/* Application */}
                {(product as any)?.application && (
                  <div className="rounded-xl border border-border bg-card overflow-hidden shadow-card">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                        </svg>
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">
                        Application
                      </span>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3">
                      {(product as any).application.image && (
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border">
                          <img
                            src={(product as any).application.image}
                            alt={(product as any).application.title ?? "app"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm font-medium text-foreground">
                        {(product as any).application.title ?? "Application"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* related products */}
      {relatedProducts && relatedProducts.length >= 2 && (
        <div className="bg-background py-10 lg:py-12 mb-6">
          <div className="container mx-auto px-3 sm:px-10 max-w-screen-2xl">
            <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl mb-6">
              Related Products
            </h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {relatedProducts?.slice(1, 13).map((relProduct) => (
                <ProductCard
                  key={relProduct._id}
                  product={relProduct}
                  attributes={attributes}
                  viewMode="grid"
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Video modal */}
      {videoOpen && videoLink && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              className="absolute -top-9 right-0 flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Close
            </button>
            <div
              className="relative w-full rounded-xl overflow-hidden bg-black"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${ytId ?? ""}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Product Video"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
