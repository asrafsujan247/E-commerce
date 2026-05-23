import type { CouponInfo } from "@appTypes/index";
import couponsData from "@localdata/coupons.json";

interface CouponsResult {
  coupons?: CouponInfo[];
  error?: string;
}

interface ShowingCouponsResult {
  coupons: CouponInfo[];
  error: string | null;
}

const getAllCoupons = async (): Promise<CouponsResult> => {
  return { coupons: couponsData as CouponInfo[] };
};

const getShowingCoupons = async (): Promise<ShowingCouponsResult> => {
  return { coupons: couponsData as CouponInfo[], error: null };
};

export { getAllCoupons, getShowingCoupons };
