import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type {
  UseFormRegister,
  UseFormHandleSubmit,
  FieldErrors,
  Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal imports
import { useAuth } from "@stores/useAuthStore";
import { useSetting } from "@stores/useSettingStore";
import { useCartStore } from "@stores/useCartStore";
import type { CartStoreItem } from "@stores/useCartStore";
import { getAllCoupons } from "@services/CouponServices";
import { notifyError, notifySuccess } from "@utils/toast";
import { addNotification } from "@services/NotificationServices";
import {
  addOrder,
  addGuestOrder,
  sendEmailInvoiceToCustomer,
} from "@services/OrderServices";
import { addShippingAddress } from "@services/ServerActionServices";
import { checkoutFormSchema, guestCheckoutFormSchema } from "@lib/form-schema";
import useUtilsFunction from "@hooks/useUtilsFunction";
import type {
  CouponInfo,
  StoreSetting,
  StoreCustomizationSetting,
  GlobalSetting,
  CheckoutFormData,
  ShippingAddress,
} from "@appTypes/index";

// ===================== Interfaces =====================

interface OrderSuccessData {
  orderId: string;
  invoice?: string;
  total: number | string;
  trackingId?: string;
  currency: string;
}

interface CheckoutSubmitReturn {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  showCard: boolean;
  setShowCard: (show: boolean) => void;
  error: string;
  couponInfo: CouponInfo;
  couponRef: React.RefObject<HTMLInputElement | null>;
  total: string | number;
  isEmpty: boolean;
  items: CartStoreItem[];
  cartTotal: number;
  handleSubmit: UseFormHandleSubmit<CheckoutFormData, unknown>;
  submitHandler: (data: CheckoutFormData) => Promise<void>;
  handleShippingCost: (value: string | number) => void;
  handleCouponCode: (e: React.FormEvent) => Promise<void>;
  discountPercentage: CouponInfo["discountType"] | number;
  discountAmount: number;
  shippingCost: number;
  isCheckoutSubmit: boolean;
  isCouponApplied: boolean;
  useExistingAddress: boolean;
  isCouponAvailable: boolean;
  globalSetting: GlobalSetting | null | undefined;
  storeSetting: StoreSetting | null | undefined;
  storeCustomization: StoreCustomizationSetting | null | undefined;
  handleDefaultShippingAddress: (value: boolean) => void;
  showOrderSuccess: boolean;
  orderSuccessData: OrderSuccessData | null;
  setShowOrderSuccess: (show: boolean) => void;
}

interface UseCheckoutSubmitProps {
  shippingAddress?: ShippingAddress | null;
  isGuest?: boolean;
}

// ===================== Hook =====================

const useCheckoutSubmit = ({
  shippingAddress,
  isGuest = false,
}: UseCheckoutSubmitProps): CheckoutSubmitReturn => {
  const { user: userInfo, login } = useAuth();

  const [error, setError] = useState<string>("");
  const [total, setTotal] = useState<string | number>("");
  const [couponInfo, setCouponInfo] = useState<CouponInfo>({});
  const [minimumAmount, setMinimumAmount] = useState<number>(0);
  const [showCard, setShowCard] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<
    CouponInfo["discountType"] | number
  >(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState<boolean>(false);
  const [isCouponApplied, setIsCouponApplied] = useState<boolean>(false);
  const [useExistingAddress, setUseExistingAddress] = useState<boolean>(false);
  const [isCouponAvailable, setIsCouponAvailable] = useState<boolean>(false);
  const [orderSuccessData, setOrderSuccessData] =
    useState<OrderSuccessData | null>(null);
  const [showOrderSuccess, setShowOrderSuccess] = useState<boolean>(false);

  const navigate = useNavigate();
  const couponRef = useRef<HTMLInputElement | null>(null);
  const { isEmpty, emptyCart, items, cartTotal } = useCartStore();

  const { globalSetting, storeSetting, storeCustomization } = useSetting();
  const { showDateFormat } = useUtilsFunction();

  const currency = globalSetting?.default_currency ?? "$";

  const checkout = storeCustomization?.checkout;
  const shippingOptionValues = [
    String(checkout?.shipping_name_two ?? ''),
  ].filter(Boolean) as string[];

  const shippingOptionsForSchema: [string, ...string[]] =
    shippingOptionValues.length > 0
      ? (shippingOptionValues as [string, ...string[]])
      : ["Standard"];

  const formSchema = isGuest
    ? guestCheckoutFormSchema(shippingOptionsForSchema)
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    ...(formSchema
      ? {
          resolver: zodResolver(
            formSchema
          ) as unknown as Resolver<CheckoutFormData>,
        }
      : {}),
    mode: "onBlur",
  });

  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const coupon = JSON.parse(
        Cookies.get("couponInfo") as string
      ) as CouponInfo;
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountType ?? 0);
      setMinimumAmount(coupon.minimumAmount ?? 0);
    }
    if (userInfo?.email) {
      setValue("email", userInfo.email);
    }
  }, [isCouponApplied]);

  useEffect(() => {
    if (minimumAmount - discountAmount > Number(total) || isEmpty) {
      setDiscountPercentage(0);
      Cookies.remove("couponInfo");
    }
  }, [minimumAmount, total]);

  useEffect(() => {
    const discountProductTotal = items?.reduce(
      (preValue, currentValue) =>
        preValue +
        ((currentValue as CartStoreItem & { itemTotal?: number }).itemTotal ??
          0),
      0
    );

    let totalValue = 0;
    const subTotal = parseFloat(
      String(cartTotal + Number(shippingCost))
    ).toFixed(2);

    const disc = discountPercentage as CouponInfo["discountType"];
    const discountAmountCalc =
      disc?.type === "fixed"
        ? disc.value
        : discountProductTotal *
          (((disc as { type: string; value: number } | undefined)?.value ??
            0) /
            100);

    const discountAmountTotal = discountAmountCalc ? discountAmountCalc : 0;
    totalValue = Number(subTotal) - discountAmountTotal;

    setDiscountAmount(discountAmountTotal);
    setTotal(totalValue);
  }, [cartTotal, shippingCost, discountPercentage]);

  const submitHandler = async (data: CheckoutFormData): Promise<void> => {
    try {
      setIsCheckoutSubmit(true);
      setError("");

      const userDetails = {
        name: `${data.firstName} ${data.lastName}`,
        contact: data.contact,
        email: data.email,
        address: data.address,
        country: data.country,
        city: data.city,
        zipCode: data.zipCode,
      };

      interface OrderInfo {
        user_info: typeof userDetails;
        shippingOption: string;
        paymentMethod: string;
        status: string;
        cart: CartStoreItem[];
        subTotal: number;
        shippingCost: number;
        discount: number;
        total: string | number;
        password?: string;
      }

      const orderInfo: OrderInfo = {
        user_info: userDetails,
        shippingOption: data.shippingOption,
        paymentMethod: data.paymentMethod,
        status: "pending",
        cart: items,
        subTotal: cartTotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        total: total,
      };

      if (isGuest && data.password) {
        orderInfo.password = data.password;
      }

      if (!isGuest && userInfo?._id) {
        await addShippingAddress({
          userId: userInfo._id,
          shippingAddressData: { ...userDetails },
          token: userInfo?.token,
        });
      }

      if (isGuest && data.paymentMethod !== "Cash") {
        notifyError("Guest checkout only supports Cash on Delivery");
        setIsCheckoutSubmit(false);
        return;
      }

      switch (data.paymentMethod) {
        case "Cash":
          await handleCashPayment(orderInfo);
          break;
        default:
          throw new Error("Invalid payment method selected");
      }
    } catch (err) {
      const e = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      notifyError(
        e?.response?.data?.message ?? e?.message ?? "An error occurred"
      );
      setIsCheckoutSubmit(false);
    }
  };

  const handleOrderSuccess = async (
    orderResponse: Record<string, unknown>,
    _orderInfo: unknown
  ): Promise<void> => {
    try {
      const notificationInfo = {
        orderId: orderResponse?._id,
        message: `${
          (orderResponse?.user_info as { name?: string } | undefined)?.name
        } placed an order of ${parseFloat(
          String(orderResponse?.total)
        ).toFixed(2)}!`,
        image:
          userInfo?.image ??
          "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png",
      };

      const updatedData = {
        ...orderResponse,
        date: showDateFormat(orderResponse.createdAt as string),
        company_info: {
          currency: currency,
          vat_number: globalSetting?.vat_number,
          company: globalSetting?.company_name,
          address: globalSetting?.address,
          phone: globalSetting?.contact,
          email: globalSetting?.email,
          website: globalSetting?.website,
          from_email: globalSetting?.from_email,
        },
      };

      if (globalSetting?.email_to_customer) {
        sendEmailInvoiceToCustomer(updatedData, userInfo?.token ?? "").catch(
          (emailErr: Error) => {
            console.error("Failed to send email invoice:", emailErr.message);
          }
        );
      }

      if (!isGuest) {
        await addNotification(notificationInfo, userInfo?.token ?? "");
      }

      setOrderSuccessData({
        orderId: String(orderResponse?._id),
        invoice: orderResponse?.invoice as string | undefined,
        total: orderResponse?.total as number | string,
        trackingId: orderResponse?.trackingId as string | undefined,
        currency: currency,
      });
      setShowOrderSuccess(true);
      notifySuccess(
        "Your Order Confirmed! The invoice will be emailed to you shortly."
      );
      Cookies.remove("couponInfo");
      emptyCart();
      setIsCheckoutSubmit(false);
    } catch (err) {
      const e = err as Error;
      console.error("Order success handling error:", e.message);
      throw new Error(e.message);
    }
  };

  const handleCashPayment = async (orderInfo: unknown): Promise<void> => {
    try {
      let result: {
        orderResponse?: Record<string, unknown>;
        authInfo?: unknown;
        error?: string;
      };

      if (isGuest) {
        result = (await addGuestOrder(orderInfo)) as typeof result;
      } else {
        result = (await addOrder(
          orderInfo,
          userInfo?.token ?? ""
        )) as typeof result;
      }

      const { orderResponse, authInfo, error: orderError } = result;

      if (orderError) {
        setIsCheckoutSubmit(false);
        notifyError(orderError);
        return;
      }

      if (!orderResponse) {
        setIsCheckoutSubmit(false);
        notifyError("Order response is empty!");
        return;
      }

      if (isGuest && authInfo) {
        try {
          login({
            ...(authInfo as Record<string, unknown>),
            token: (authInfo as { token?: string }).token,
          } as Parameters<typeof login>[0]);
        } catch (loginErr) {
          console.error(
            "Guest auto-login error:",
            (loginErr as Error).message
          );
        }
      }

      await handleOrderSuccess(
        orderResponse as Record<string, unknown>,
        orderInfo
      );
    } catch (err) {
      setIsCheckoutSubmit(false);
      notifyError((err as Error).message);
    }
  };

  const handleShippingCost = (value: string | number): void => {
    setShippingCost(Number(value));
  };

  const handleDefaultShippingAddress = (value: boolean): void => {
    setUseExistingAddress(value);
    if (value && shippingAddress && shippingAddress?.name) {
      const address = shippingAddress;
      const nameParts = address?.name?.split(" ") ?? [];
      const firstName = nameParts[0] ?? "";
      const lastName =
        nameParts?.length > 1 ? nameParts[nameParts.length - 1] : "";

      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("address", address.address ?? "");
      setValue("contact", address.contact ?? "");
      setValue("email", userInfo?.email ?? "");
      setValue("city", address.city ?? "");
      setValue("country", address.country ?? "");
      setValue("zipCode", address.zipCode ?? "");
    } else {
      setValue("firstName", "");
      setValue("lastName", "");
      setValue("address", "");
      setValue("contact", "");
      setValue("city", "");
      setValue("country", "");
      setValue("zipCode", "");
    }
  };

  const handleCouponCode = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    setIsCouponAvailable(true);

    try {
      const { coupons, error: couponError } = await getAllCoupons();

      if (couponError || !coupons) {
        setIsCouponAvailable(false);
        notifyError(couponError ?? "Failed to fetch coupons");
        return;
      }

      const result = coupons.filter(
        (coupon) => coupon.couponCode === couponRef.current?.value
      );
      setIsCouponAvailable(false);

      if (result.length < 1) {
        notifyError("Please Input a Valid Coupon!");
        return;
      }

      if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
        notifyError("This coupon is not valid!");
        return;
      }

      if (Number(total) < (result[0]?.minimumAmount ?? 0)) {
        notifyError(
          `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`
        );
        return;
      } else {
        notifySuccess(`Your Coupon ${result[0].couponCode} is Applied!`);
        setIsCouponApplied(true);
        setMinimumAmount(result[0]?.minimumAmount ?? 0);
        setDiscountPercentage(result[0].discountType ?? 0);
        Cookies.set("couponInfo", JSON.stringify(result[0]));
      }
    } catch (err) {
      notifyError((err as Error).message);
    }
  };

  return {
    register,
    errors,
    showCard,
    setShowCard,
    error,
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountPercentage,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    isCouponApplied,
    useExistingAddress,
    isCouponAvailable,
    globalSetting,
    storeSetting,
    storeCustomization,
    handleDefaultShippingAddress,
    showOrderSuccess,
    orderSuccessData,
    setShowOrderSuccess,
  };
};

export default useCheckoutSubmit;
