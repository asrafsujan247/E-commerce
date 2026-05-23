import { useEffect, useState } from "react";

import Coupon from "@components/coupon/Coupon";
import PageHeader from "@components/header/PageHeader";
import { getStoreCustomizationSetting } from "@services/SettingServices";
import { getShowingCoupons } from "@services/CouponServices";

import type { StoreCustomizationSetting } from "@appTypes/index";

const Offers = () => {
  const [storeCustomizationSetting, setStoreCustomizationSetting] = useState<
    StoreCustomizationSetting | undefined
  >(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customizationResult, couponsResult] = await Promise.all([
          getStoreCustomizationSetting(),
          getShowingCoupons(),
        ]);
        setStoreCustomizationSetting(customizationResult.storeCustomizationSetting);
        setCoupons(couponsResult.coupons);
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
    <div className="bg-background">
      <PageHeader
        headerBg={storeCustomizationSetting?.offers?.header_bg as string | undefined}
        title={storeCustomizationSetting?.offers?.title}
      />

      <div className="relative z-10 -mt-4 sm:-mt-6 mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Coupon coupons={coupons} />
        </div>
      </div>
    </div>
  );
};

export default Offers;
