import { useEffect, useState } from "react";

import HomePage from "@components/home/HomePage";

import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingCategory } from "@services/CategoryService";
import {
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";

import type {
  Product,
  ProductAttribute,
  Category,
  GlobalSetting,
  StoreCustomizationSetting,
} from "@appTypes/index";

interface Campaign {
  _id: string;
  [key: string]: unknown;
}

interface LayoutProps {
  popularProducts: Product[];
  usedProducts: Product[];
  attributes: ProductAttribute[];
  storeCustomizationSetting: StoreCustomizationSetting | undefined;
  storeCustomizationError: string | null;
  globalSetting: GlobalSetting | undefined;
  categories: Category[];
  featuredCampaign: Campaign | null;
}

const Home = () => {
  const [layoutProps, setLayoutProps] = useState<LayoutProps>({
    popularProducts: [],
    usedProducts: [],
    attributes: [],
    storeCustomizationSetting: undefined,
    storeCustomizationError: null,
    globalSetting: undefined,
    categories: [],
    featuredCampaign: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          attributesResult,
          customizationResult,
          productsResult,
          globalResult,
          categoriesResult,
        ] = await Promise.all([
          getShowingAttributes(),
          getStoreCustomizationSetting(),
          getShowingStoreProducts({ category: "", title: "" }),
          getGlobalSetting(),
          getShowingCategory(),
        ]);
        const campaignResult = null;

        setLayoutProps({
          popularProducts: productsResult.popularProducts ?? [],
          usedProducts: productsResult.usedProducts ?? [],
          attributes: attributesResult.attributes ?? [],
          storeCustomizationSetting:
            customizationResult.storeCustomizationSetting,
          storeCustomizationError:
            productsResult.error ?? customizationResult.error ?? null,
          globalSetting: globalResult.globalSetting,
          categories: categoriesResult.categories ?? [],
          featuredCampaign: (campaignResult as Campaign | null) ?? null,
        });
      } catch (err) {
        console.error("[Home] fetchData error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return <HomePage {...layoutProps} />;
};

export default Home;
