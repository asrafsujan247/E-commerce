import Cookies from "js-cookie";
import { create } from "zustand";
import type { ShippingAddress, CouponInfo } from "@appTypes/index";

function parseCookie<T>(key: string): T | null {
  const raw = Cookies.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

interface UserState {
  shippingAddress: ShippingAddress;
  couponInfo: CouponInfo;
  saveShippingAddress: (address: ShippingAddress) => void;
  saveCoupon: (coupon: CouponInfo) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  shippingAddress: parseCookie<ShippingAddress>("shippingAddress") ?? {},
  couponInfo: parseCookie<CouponInfo>("couponInfo") ?? {},

  saveShippingAddress: (address) => {
    Cookies.set("shippingAddress", JSON.stringify(address));
    set({ shippingAddress: address });
  },

  saveCoupon: (coupon) => {
    Cookies.set("couponInfo", JSON.stringify(coupon));
    set({ couponInfo: coupon });
  },

  clearUserData: () => {
    Cookies.remove("shippingAddress");
    Cookies.remove("couponInfo");
    set({ shippingAddress: {}, couponInfo: {} });
  },
}));
