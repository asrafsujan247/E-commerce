import React, { useEffect, useState } from "react";
import Coupon from "@components/coupon/Coupon";
import { getShowingCoupons } from "@services/CouponServices";
import { useSetting } from "@stores/useSettingStore";

interface DiscountType {
  type: "fixed" | "percentage";
  value: number;
}

interface CouponData {
  _id: string;
  title?: string | Record<string, unknown>;
  logo?: string;
  couponCode: string;
  discountType?: DiscountType;
  minimumAmount?: number;
  endTime?: string;
  [key: string]: unknown;
}

interface OfferCardProps {
  discountTitle?: string;
  coupons?: CouponData[];
  currency?: string;
  error?: string;
}

const OfferCard: React.FC<OfferCardProps> = ({
  discountTitle: discountTitleProp,
  coupons: couponsProp,
  currency: currencyProp,
  error: errorProp,
}) => {
  const { globalSetting } = useSetting();
  const [coupons, setCoupons] = useState<CouponData[]>(couponsProp ?? []);
  const [error, setError] = useState<string | undefined>(errorProp);

  useEffect(() => {
    if (couponsProp && couponsProp.length > 0) return;
    getShowingCoupons().then((result) => {
      if (result.error) {
        setError(result.error);
      } else {
        setCoupons(result.coupons as CouponData[]);
      }
    });
  }, [couponsProp]);

  const currency = currencyProp ?? globalSetting?.default_currency ?? "$";
  const discountTitle = discountTitleProp ?? "Available Coupons";

  return (
    <div className="w-full group">
      <div className="bg-card h-full border border-primary/30 transition duration-150 ease-linear transform group-hover:border-primary rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary/10 dark:bg-primary/20 text-foreground px-6 py-2 border-b border-primary/20 flex items-center justify-center">
          <h3 className="text-base font-medium">{discountTitle}</h3>
        </div>
        <div className="overflow-hidden">
          <Coupon
            coupons={coupons}
            couponInHome
            currency={currency}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
