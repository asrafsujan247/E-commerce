import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoReturnUpBackOutline,
  IoArrowForward,
  IoBagHandle,
  IoWalletSharp,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { ShoppingBag, ShieldCheck, Lock, Tag } from "lucide-react";

//internal import
import Label from "@components/form/Label";
import Error from "@components/form/Error";
import CartItem from "@components/cart/CartItem";
import InputArea from "@components/form/InputArea";
import InputShipping from "@components/form/InputShipping";
import InputPayment from "@components/form/InputPayment";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import SwitchToggle from "@components/form/SwitchToggle";
import OrderSuccessNotification from "@components/notifications/OrderSuccessNotification";
import { ShippingAddress } from "@appTypes/index";

interface CheckoutFormProps {
  shippingAddress?: ShippingAddress;
  hasShippingAddress?: boolean;
  isGuest?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  shippingAddress,
  hasShippingAddress,
  isGuest = false,
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);

  const {
    couponInfo,
    couponRef,
    total,
    isEmpty,
    items,
    cartTotal,
    register,
    errors,
    showCard,
    setShowCard,
    handleSubmit,
    submitHandler,
    handleShippingCost,
    handleCouponCode,
    discountAmount,
    shippingCost,
    isCheckoutSubmit,
    useExistingAddress,
    storeSetting,
    storeCustomization,
    handleDefaultShippingAddress,
    showOrderSuccess,
    orderSuccessData,
    setShowOrderSuccess,
  } = useCheckoutSubmit({ shippingAddress, isGuest });
  const { formatPrice } = useUtilsFunction();
  const checkout = storeCustomization?.checkout;

  if (!mounted) return null;

  return (
    <>
      {/* Order Success Notification Modal */}
      <OrderSuccessNotification
        show={showOrderSuccess}
        onClose={() => setShowOrderSuccess(false)}
        orderId={orderSuccessData?.orderId}
        invoice={orderSuccessData?.invoice}
        total={orderSuccessData?.total != null ? Number(orderSuccessData.total) : undefined}
        trackingId={orderSuccessData?.trackingId}
        currency={orderSuccessData?.currency}
      />

      {/* Page header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your details and complete your order securely.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* checkout form */}
        <div className="order-2 w-full lg:order-1 lg:w-3/5">
          <form
            onSubmit={handleSubmit(submitHandler as (data: unknown) => Promise<void>)}
            className="space-y-5"
          >
            {isGuest && (
              <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground">
                  You are checking out as a guest. Only Cash on Delivery is
                  available for guest orders. An account will be created for you
                  to track your order.
                </p>
              </div>
            )}

            {!isGuest && hasShippingAddress && (
              <div className="flex justify-end">
                <SwitchToggle
                  id="shipping-address"
                  title="Use Default Shipping Address"
                  processOption={useExistingAddress}
                  handleProcess={handleDefaultShippingAddress}
                />
              </div>
            )}

            {/* 01. Personal Details */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {String(checkout?.personal_details ?? "")}
                </h2>
              </div>
              <div className="grid grid-cols-6 gap-5">
                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={String(checkout?.first_name ?? "")}
                    name="firstName"
                    type="text"
                    placeholder="John"
                  />
                  <Error errorMessage={errors.firstName} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={String(checkout?.last_name ?? "")}
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                  />
                  <Error errorMessage={errors.lastName} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={String(checkout?.email_address ?? "")}
                    name="email"
                    type="email"
                    placeholder="youremail@gmail.com"
                  />
                  <Error errorMessage={errors.email} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputArea
                    register={register}
                    label={String(checkout?.checkout_phone ?? "")}
                    name="contact"
                    type="tel"
                    placeholder="+062-6532956"
                  />
                  <Error errorMessage={errors.contact} />
                </div>

                {isGuest && (
                  <div className="col-span-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-muted-foreground"
                      >
                        Password (for your new account)
                      </label>
                      <div className="relative">
                        <Input
                          {...register("password")}
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Min. 8 characters with letters & numbers"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <IoEyeOffOutline className="h-5 w-5" />
                          ) : (
                            <IoEyeOutline className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Error errorMessage={errors.password} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      An account will be created with this email and password so
                      you can track your order and manage future purchases.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 02. Shipping Details */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {String(checkout?.shipping_details ?? "")}
                </h2>
              </div>

              <div className="grid grid-cols-6 gap-5">
                <div className="col-span-6">
                  <InputArea
                    register={register}
                    label={String(checkout?.street_address ?? "")}
                    name="address"
                    type="text"
                    placeholder="123 Boulevard Rd, Beverley Hills"
                  />
                  <Error errorMessage={errors.address} />
                </div>

                <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                  <InputArea
                    register={register}
                    label={String(checkout?.city ?? "")}
                    name="city"
                    type="text"
                    placeholder="Los Angeles"
                  />
                  <Error errorMessage={errors.city} />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <InputArea
                    register={register}
                    label={String(checkout?.country ?? "")}
                    name="country"
                    type="text"
                    placeholder="United States"
                  />
                  <Error errorMessage={errors.country} />
                </div>

                <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                  <InputArea
                    register={register}
                    label={String(checkout?.zip_code ?? "")}
                    name="zipCode"
                    type="text"
                    placeholder="2345"
                  />
                  <Error errorMessage={errors.zipCode} />
                </div>
              </div>

              <div className="mt-6">
                <Label label={String(checkout?.shipping_cost ?? "")} />
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={String(checkout?.shipping_name_two ?? "") ?? ""}
                      description={String(checkout?.shipping_one_desc ?? "")}
                      value={Number(checkout?.shipping_one_cost) || 60}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>

                  <div>
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={String(checkout?.shipping_name_two ?? "") ?? ""}
                      description={String(checkout?.shipping_two_desc ?? "")}
                      value={Number(checkout?.shipping_two_cost) || 20}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>
                </div>
              </div>
            </section>

            {/* 03. Payment Method */}
            <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </span>
                <h2 className="text-base font-semibold text-foreground">
                  {String(checkout?.payment_method ?? "")}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {!!storeSetting?.cod_status && (
                  <div>
                    <InputPayment
                      setShowCard={setShowCard}
                      register={register}
                      name="Cash on Delivery"
                      value="Cash"
                      Icon={IoWalletSharp}
                    />
                    <Error errorMessage={errors.paymentMethod} />
                  </div>
                )}
              </div>
            </section>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                className="h-11 w-full rounded-lg sm:w-auto sm:px-6"
              >
                <Link
                  to="/"
                  className="flex w-full items-center justify-center"
                >
                  <IoReturnUpBackOutline className="mr-2 text-xl" />
                  {String(checkout?.continue_button ?? "")}
                </Link>
              </Button>

              <Button
                type="submit"
                variant="create"
                disabled={isEmpty || isCheckoutSubmit}
                isLoading={isCheckoutSubmit}
                className="h-11 w-full rounded-lg sm:w-auto sm:px-8"
              >
                {isCheckoutSubmit ? (
                  "Processing"
                ) : (
                  <span className="flex items-center justify-center">
                    {String(checkout?.confirm_button ?? "")}
                    <IoArrowForward className="ml-2 text-xl" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* order summary */}
        <div className="order-1 w-full lg:sticky lg:top-24 lg:order-2 lg:w-2/5">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            {/* header */}
            <div className="flex items-center gap-2 border-b border-border px-5 py-4">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingBag className="size-4" />
              </span>
              <h2 className="text-base font-semibold text-foreground">
                {String(checkout?.order_summary ?? "")}
              </h2>
              {!isEmpty && (
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            {/* items */}
            <div className="max-h-72 divide-y divide-border overflow-y-auto scrollbar-hide px-2">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item as unknown as Parameters<typeof CartItem>[0]["item"]}
                />
              ))}

              {isEmpty && (
                <div className="px-3 py-12 text-center">
                  <span className="mx-auto flex justify-center text-4xl text-muted-foreground">
                    <IoBagHandle />
                  </span>
                  <h2 className="pt-2 text-sm font-medium text-muted-foreground">
                    No Item Added Yet!
                  </h2>
                </div>
              )}
            </div>

            {/* coupon */}
            <div className="border-t border-border px-5 py-4">
              {couponInfo.couponCode ? (
                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Tag className="size-4" /> Coupon Applied
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {couponInfo.couponCode}
                  </span>
                </div>
              ) : (
                <div className="flex items-stretch gap-2">
                  <Input
                    ref={couponRef}
                    type="text"
                    placeholder="Coupon Code"
                    className="h-10"
                  />
                  <Button
                    type="button"
                    onClick={handleCouponCode}
                    variant="create"
                    className="h-10 shrink-0 rounded-lg px-5"
                  >
                    {String(checkout?.apply_button ?? "")}
                  </Button>
                </div>
              )}
            </div>

            {/* totals */}
            <div className="space-y-2.5 border-t border-border px-5 py-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {String(checkout?.sub_total ?? "")}
                </span>
                <span className="font-semibold text-foreground">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {String(checkout?.shipping_cost ?? "")}
                </span>
                <span className="font-semibold text-foreground">
                  {formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {String(checkout?.discount ?? "")}
                </span>
                <span className="font-semibold text-orange-500">
                  {formatPrice(discountAmount)}
                </span>
              </div>
            </div>

            {/* total */}
            <div className="flex items-center justify-between border-t border-border bg-primary/5 px-5 py-4">
              <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                {String(checkout?.total_cost ?? "")}
              </span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(Number(total))}
              </span>
            </div>

            {/* secure note */}
            <div className="flex items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <Lock className="size-3.5" />
              <span>Secure &amp; encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
