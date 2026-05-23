import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CheckoutForm from "@components/checkout/CheckoutForm";
import { useSetting } from "@stores/useSettingStore";
import { useAuth } from "@stores/useAuthStore";
import { getStoreCustomizationSetting, getStoreSetting } from "@services/SettingServices";
import { getShippingAddress } from "@services/CustomerServices";

import type { StoreCustomizationSetting, StoreSetting, ShippingAddress } from "@appTypes/index";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { globalSetting } = useSetting();
  const { user, isAuthenticated } = useAuth();

  const isGuest = !isAuthenticated;
  const isExplicitGuestMode = searchParams.get("mode") === "guest";

  const [storeSetting, setStoreSetting] = useState<StoreSetting | undefined>(undefined);
  const [storeCustomizationSetting, setStoreCustomizationSetting] = useState<
    StoreCustomizationSetting | undefined
  >(undefined);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [hasShippingAddress, setHasShippingAddress] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Guest gate: redirect if guest checkout is not enabled
  useEffect(() => {
    if (isGuest && !isExplicitGuestMode && globalSetting !== undefined) {
      const guestEnabled = globalSetting?.enable_guest_order === true;
      if (!guestEnabled) {
        navigate("/auth/login?redirectUrl=/checkout", { replace: true });
      }
    }
  }, [isGuest, isExplicitGuestMode, globalSetting, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customizationResult, storeSettingResult] = await Promise.all([
          getStoreCustomizationSetting(),
          getStoreSetting(),
        ]);

        if (customizationResult.error || storeSettingResult.error) {
          setError(customizationResult.error || storeSettingResult.error);
        }

        setStoreCustomizationSetting(customizationResult.storeCustomizationSetting);
        setStoreSetting(storeSettingResult.storeSetting);

        // Fetch shipping address only for authenticated users
        if (isAuthenticated && user) {
          const shippingResult = await getShippingAddress({
            userId: user._id,
            token: user.token ?? "",
          });

          if (shippingResult.shippingAddress) {
            setShippingAddress(shippingResult.shippingAddress);
            setHasShippingAddress(
              Object.keys(shippingResult.shippingAddress).length > 0,
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Checkout Error
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Guest via direct URL (no modal) — wait for setting check
  if (isGuest && !isExplicitGuestMode && globalSetting === undefined) {
    return null;
  }

  // Guest via direct URL but guest checkout is disabled — redirect in progress
  if (isGuest && !isExplicitGuestMode && !globalSetting?.enable_guest_order) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <CheckoutForm
          shippingAddress={shippingAddress ?? undefined}
          hasShippingAddress={hasShippingAddress}
          isGuest={isGuest}
        />
      </div>
    </div>
  );
};

export default Checkout;
