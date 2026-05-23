import { useEffect, useState } from "react";

import FlashSaleContent from "@components/campaign/FlashSaleContent";
import FlashSaleHero from "@components/campaign/FlashSaleHero";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { getShowingAttributes } from "@services/AttributeServices";

import type { StoreCustomizationSetting, ProductAttribute } from "@appTypes/index";

interface LocalCampaign {
  _id: string;
  startTime?: string;
  endTime?: string;
  products?: Array<{
    product?: {
      sold?: number;
    };
  }>;
  [key: string]: unknown;
}

interface FlashSaleData {
  storeCustomizationSetting: StoreCustomizationSetting | undefined;
  campaigns: LocalCampaign[];
  attributes: ProductAttribute[];
  totalProducts: number;
  activeCampaignCount: number;
  totalSold: number;
}

const FlashSale = () => {
  const [data, setData] = useState<FlashSaleData>({
    storeCustomizationSetting: undefined,
    campaigns: [],
    attributes: [],
    totalProducts: 0,
    activeCampaignCount: 0,
    totalSold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customizationResult, attributesResult] =
          await Promise.all([
            getStoreCustomizationSetting(),
            getShowingAttributes(),
          ]);

        const campaigns: LocalCampaign[] = [];

        const now = new Date();
        const activeCampaigns = campaigns.filter((c) => {
          const start = new Date(c.startTime ?? "");
          const end = new Date(c.endTime ?? "");
          return now >= start && now <= end;
        });

        const totalProducts = campaigns.reduce(
          (sum, c) => sum + (c.products?.length ?? 0),
          0,
        );

        const totalSold = campaigns.reduce(
          (sum, c) =>
            sum +
            (c.products?.reduce(
              (ps, p) => ps + (p.product?.sold ?? 0),
              0,
            ) ?? 0),
          0,
        );

        setData({
          storeCustomizationSetting: customizationResult.storeCustomizationSetting,
          campaigns,
          attributes: attributesResult.attributes,
          totalProducts,
          activeCampaignCount: activeCampaigns.length,
          totalSold,
        });
      } catch {
        // silently ignore
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

  return (
    <div className="bg-background min-h-screen">
      <FlashSaleHero
        headerBg={data.storeCustomizationSetting?.offers?.header_bg as string | undefined}
        totalProducts={data.totalProducts}
        activeCampaignCount={data.activeCampaignCount}
        totalSold={data.totalSold}
      />

      <div className="relative z-10 -mt-4 sm:-mt-6 mx-auto max-w-screen-2xl px-3 sm:px-10 py-6 sm:py-10 lg:py-16">
        {data.campaigns && data.campaigns.length > 0 ? (
          <FlashSaleContent
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            campaigns={data.campaigns as any}
            attributes={data.attributes}
          />
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No Active Campaigns
            </h2>
            <p className="text-muted-foreground">
              Check back later for amazing deals and offers!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSale;
