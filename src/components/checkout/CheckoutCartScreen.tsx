import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoAlertCircleOutline, IoReturnUpBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getUserSession } from "@lib/auth-client";

// Internal imports
import CartItem from "@components/cart/CartItem";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@stores/useSettingStore";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import GuestCheckoutPrompt from "@components/checkout/GuestCheckoutPrompt";

const CheckoutCartScreen = () => {
  const navigate = useNavigate();
  const userInfo = getUserSession();
  const { storeCustomization, globalSetting } = useSetting();
  const { formatPrice } = useUtilsFunction();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const {
    total,
    isEmpty,
    items,
    cartTotal,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    isCouponAvailable,
  } = useCheckoutSubmit({});

  const checkout = storeCustomization?.checkout;

  const handleCheckout = () => {
    if (items?.length <= 0) {
      return;
    }
    if (!userInfo && !globalSetting?.enable_guest_order) {
      // Guest checkout disabled → redirect to login
      navigate("/auth/login?redirectUrl=/checkout");
    } else if (!userInfo && globalSetting?.enable_guest_order) {
      // Guest checkout enabled → show choice modal
      setShowGuestPrompt(true);
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-10 pb-16">
      {/* Guest Checkout Prompt Modal */}
      <GuestCheckoutPrompt
        isOpen={showGuestPrompt}
        onClose={() => setShowGuestPrompt(false)}
      />

      {/* Guest checkout available banner */}
      {!userInfo && !!globalSetting?.enable_guest_order && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20">
          <span className="text-lg">🛍️</span>
          <div>
            <p className="text-sm font-medium text-primary">
              Guest Checkout Available
            </p>
            <p className="text-xs text-muted-foreground">
              No account needed — proceed to checkout and fill in your details.
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
        <div className="w-full lg:w-[60%] xl:w-[55%]">
          <h2 className="font-bold text-xl pb-4 text-foreground">
            Shopping Cart
          </h2>
          <div className="w-full block bg-card rounded-xl border border-border p-4 sm:p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item as unknown as Parameters<typeof CartItem>[0]["item"]} />
            ))}

            {isEmpty && (
              <div className="mt-10 flex flex-col h-full justify-center">
                <div className="flex flex-col items-center">
                  <img
                    className="size-40 flex-none rounded-md object-cover"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h3 className=" font-semibold text-muted-foreground text-lg pt-5">
                    Your cart is empty
                  </h3>
                  <p className="px-12 text-center text-sm text-muted-foreground pt-2">
                    No items added in your cart. Please add product to your cart
                    list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden lg:block border-l border-border mx-10 xl:mx-16 2xl:mx-20 shrink-0"></div>
        <div className="flex-1">
          <div className="sticky top-44 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-8">
              <h2 className="font-semibold text-lg">
                {String(checkout?.order_summary ?? '')}
              </h2>

              <div className="mt-3 text-sm text-muted-foreground dark:text-muted-foreground divide-y divide-border/70 dark:divide-border">
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-muted-foreground">
                    {String(checkout?.sub_total ?? '')}
                  </span>
                  <span className="font-semibold text-foreground dark:text-muted-foreground">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-muted-foreground">
                    {String(checkout?.discount ?? '')}
                  </span>
                  <span className="font-semibold text-foreground dark:text-muted-foreground">
                    {formatPrice(discountAmount)}
                  </span>
                </div>

                <form className="w-full mt-8">
                  {couponInfo.couponCode ? (
                    <span className="bg-primary/10 px-4 py-3 leading-tight w-full rounded-lg flex justify-between items-center">
                      {" "}
                      <p className="text-primary font-medium">
                        Coupon Applied{" "}
                      </p>{" "}
                      <span className="text-primary text-right font-bold">
                        {couponInfo.couponCode}
                      </span>
                    </span>
                  ) : (
                    <div className="flex flex-row items-start justify-end w-full">
                      <Input
                        ref={couponRef}
                        type="text"
                        placeholder="Coupon Code"
                        className="px-4 py-2 h-10 mr-1 border border-border rounded-md focus:outline-none"
                      />
                      <Button
                        onClick={handleCouponCode}
                        className="h-10 rounded-sm"
                        variant="create"
                      >
                        {String(checkout?.apply_button ?? '')}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="bg-muted/40 p-8 rounded-b-xl border-t border-border">
              <p className="flex justify-between font-semibold text-foreground">
                <span>
                  <span className="text-sm">
                    {String(checkout?.total_cost ?? '')}
                  </span>
                  <span className="block text-sm text-muted-foreground font-normal">
                    Shipping and taxes calculated at checkout.
                  </span>
                </span>
                <span className="font-bold text-foreground text-lg">
                  {formatPrice(Number(total))}
                </span>
              </p>

              <div className="flex space-x-3 items-center mt-6">
                <Link
                  to="/"
                  className="relative h-auto inline-flex items-center justify-center rounded-lg transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-background text-foreground hover:bg-muted flex-1 border border-border"
                >
                  <span className="text-xl mr-2">
                    <IoReturnUpBackOutline />
                  </span>
                  {String(checkout?.continue_button ?? '')}
                </Link>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="relative h-auto inline-flex items-center justify-center rounded-lg w-full transition-colors text-xs sm:text-base font-medium py-2.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 focus:outline-none"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCartScreen;
