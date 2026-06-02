import { Suspense } from "react";
import Card from "@components/cta-card/Card";
import StickySidebar from "@components/sticky-sidebar/StickySidebar";
import MainCarousel from "@components/carousel/MainCarousel";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import UsedProductCard from "@components/product/UsedProductCard";
import CategorySidebar from "@components/header/CategorySidebar";
import YouMayLike from "@components/header/YouMayLike";
import Branding from "@components/header/Branding";
import MobileServiceShortcuts from "@components/header/MobileServiceShortcuts";

import PopularProducts from "@components/home/PopularProducts";
import DepartmentCard from "@components/home/DepartmentCard";
import HomeQuotation from "@components/home/HomeQuotation";
import ServiceAdd from "@components/home/ServiceAdd";
import HighlightedCategoryProducts from "@components/home/HighlightedCategoryProducts";
import type { LayoutProps } from "@appTypes/index";

const HomePage = ({
  popularProducts,
  usedProducts,
  attributes,
  storeCustomizationSetting,
  storeCustomizationError,
  categories,
}: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <StickySidebar />

      {/* ── Hero Header: 3-column layout ── */}
      <div className="bg-background">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-5">
          <div className="flex w-full rounded-sm overflow-hidden">
            {/* LEFT – Category Sidebar */}
            <div className="hidden md:flex flex-col w-55 xl:w-57.5 shrink-0  bg-white">
              <CategorySidebar
                categories={categories ?? []}
                categoryError={null}
              />
            </div>

            {/* CENTER – Carousel + Branding */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
              <Suspense
                fallback={
                  <div
                    className="flex-1 bg-gray-100 animate-pulse"
                    style={{ aspectRatio: "2.45 / 1" }}
                  />
                }
              >
                <MainCarousel
                  storeCustomizationSetting={storeCustomizationSetting}
                />
              </Suspense>
              <div className="hidden md:block bg-white">
                <Branding />
              </div>
              <div className="md:hidden">
                <MobileServiceShortcuts />
              </div>
            </div>

            {/* RIGHT – You May Like */}
            <div className="hidden lg:flex flex-col w-55 xl:w-57.5 shrink-0  bg-white">
              <YouMayLike />
            </div>
          </div>
        </div>
      </div>

      {/* ── Trending Products ── */}
      <PopularProducts products={popularProducts ?? []} />

      {/* ── Department Card ── */}
      <DepartmentCard categories={categories} />

      {/* ── Quotation Banner ── */}
      <HomeQuotation />

      {/* ── Service Add Banner ── */}
      <ServiceAdd />

      {/* ── Highlighted Category Products ── */}
      <HighlightedCategoryProducts />

      {/* ── Feature Categories ── */}
      {(storeCustomizationSetting?.home?.featured_status ?? true) && (
        <div className="bg-muted/50 dark:bg-muted/30 lg:py-16 py-10 border-y border-border/50">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="mb-10 flex justify-center">
              <div className="text-center w-full lg:w-2/5">
                <h2 className="text-xl lg:text-2xl mb-2 font-semibold text-foreground">
                  <CMSkeletonTwo
                    count={1}
                    height={30}
                    loading={false}
                    error={storeCustomizationError ?? undefined}
                    data={storeCustomizationSetting?.home?.feature_title}
                  />
                </h2>
                <p className="text-base text-muted-foreground leading-6">
                  <CMSkeletonTwo
                    count={4}
                    height={10}
                    loading={false}
                    error={storeCustomizationError ?? undefined}
                    data={storeCustomizationSetting?.home?.feature_description}
                  />
                </p>
              </div>
            </div>
            <Suspense fallback={<p>Loading feature category...</p>}>
              <FeatureCategory categories={categories} />
            </Suspense>
          </div>
        </div>
      )}

      {/* ── Promotional Banner Card ── */}
      {(storeCustomizationSetting?.home?.delivery_status ?? true) && (
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-10 lg:py-16">
          <Card />
        </div>
      )}

      {/* ── Used Products ── */}
      {(storeCustomizationSetting?.home?.used_product_status ?? true) &&
        (usedProducts?.length ?? 0) > 0 && (
          <div
            id="used-products"
            className="bg-muted/50 dark:bg-muted/30 lg:py-16 py-10 border-t border-border/50"
          >
            <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
              <div className="mb-10 flex justify-center">
                <div className="text-center w-full lg:w-2/5">
                  <h2 className="text-xl lg:text-2xl mb-2 font-semibold text-foreground">
                    <CMSkeletonTwo
                      count={1}
                      height={30}
                      loading={false}
                      error={storeCustomizationError ?? undefined}
                      data={
                        storeCustomizationSetting?.home?.used_product_title
                      }
                    />
                  </h2>
                  <p className="text-base font-sans text-muted-foreground leading-6">
                    <CMSkeletonTwo
                      count={5}
                      height={20}
                      loading={false}
                      error={storeCustomizationError ?? undefined}
                      data={
                        storeCustomizationSetting?.home?.used_product_description
                      }
                    />
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                    {usedProducts
                      ?.slice(
                        0,
                        storeCustomizationSetting?.home
                          ?.used_product_limit as number,
                      )
                      .map((product) => (
                        <UsedProductCard
                          key={product._id}
                          product={product}
                          attributes={attributes}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default HomePage;
