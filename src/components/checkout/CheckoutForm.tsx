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
import { ImCreditCard } from "react-icons/im";

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

      <div className="py-10 lg:py-12 px-0 2xl:max-w-screen-2xl w-full xl:max-w-screen-xl flex flex-col md:flex-row lg:flex-row gap-0">
        {/* checkout form */}
        <div className="md:w-full lg:w-3/5 flex h-full flex-col order-2 sm:order-1 lg:order-1">
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit(submitHandler as (data: unknown) => Promise<void>)}>
              {isGuest && (
                <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary font-medium">
                    You are checking out as a guest. Only Cash on Delivery is
                    available for guest orders. An account will be created for
                    you to track your order.
                  </p>
                </div>
              )}
              {!isGuest && hasShippingAddress && (
                <div className="flex justify-end my-2">
                  <SwitchToggle
                    id="shipping-address"
                    title="Use Default Shipping Address"
                    processOption={useExistingAddress}
                    handleProcess={handleDefaultShippingAddress}
                  />
                </div>
              )}
              <div className="form-group">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  01. {String(checkout?.personal_details ?? '')}
                </h2>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={String(checkout?.first_name ?? '')}
                      name="firstName"
                      type="text"
                      placeholder="John"
                    />
                    <Error errorMessage={errors.firstName} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={String(checkout?.last_name ?? '')}
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                    />
                    <Error errorMessage={errors.lastName} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={String(checkout?.email_address ?? '')}
                      name="email"
                      type="email"
                      placeholder="youremail@gmail.com"
                    />
                    <Error errorMessage={errors.email} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputArea
                      register={register}
                      label={String(checkout?.checkout_phone ?? '')}
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
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
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
                      <p className="text-xs text-muted-foreground mt-1">
                        An account will be created with this email and password
                        so you can track your order and manage future purchases.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group mt-12">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  02. {String(checkout?.shipping_details ?? '')}
                </h2>

                <div className="grid grid-cols-6 gap-6 mb-8">
                  <div className="col-span-6">
                    <InputArea
                      register={register}
                      label={String(checkout?.street_address ?? '')}
                      name="address"
                      type="text"
                      placeholder="123 Boulevard Rd, Beverley Hills"
                    />
                    <Error errorMessage={errors.address} />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={String(checkout?.city ?? '')}
                      name="city"
                      type="text"
                      placeholder="Los Angeles"
                    />
                    <Error errorMessage={errors.city} />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={String(checkout?.country ?? '')}
                      name="country"
                      type="text"
                      placeholder="United States"
                    />
                    <Error errorMessage={errors.country} />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <InputArea
                      register={register}
                      label={String(checkout?.zip_code ?? '')}
                      name="zipCode"
                      type="text"
                      placeholder="2345"
                    />
                    <Error errorMessage={errors.zipCode} />
                  </div>
                </div>

                <Label label={String(checkout?.shipping_cost ?? '')} />
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={String(checkout?.shipping_name_two ?? '') ?? ""}
                      description={String(
                        checkout?.shipping_one_desc
                       ?? '')}
                      value={Number(checkout?.shipping_one_cost) || 60}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <InputShipping
                      register={register}
                      handleShippingCost={handleShippingCost}
                      name={String(checkout?.shipping_name_two ?? '') ?? ""}
                      description={String(
                        checkout?.shipping_two_desc
                       ?? '')}
                      value={Number(checkout?.shipping_two_cost) || 20}
                    />
                    <Error errorMessage={errors.shippingOption} />
                  </div>
                </div>
              </div>

              <div className="form-group mt-12">
                <h2 className="font-semibold text-base text-muted-foreground pb-3">
                  03. {String(checkout?.payment_method ?? '')}
                </h2>
                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
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
              </div>

              <div className="grid grid-cols-6 gap-4 lg:gap-6 mt-10">
                <div className="col-span-6 sm:col-span-3">
                  <Button className="w-full h-10 rounded-sm" variant="outline">
                    <Link
                      to="/"
                      className="flex justify-center text-center"
                    >
                      <span className="text-xl mr-2">
                        <IoReturnUpBackOutline />
                      </span>
                      {String(checkout?.continue_button ?? '')}
                    </Link>
                  </Button>
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <Button
                    type="submit"
                    variant="create"
                    disabled={isEmpty || isCheckoutSubmit}
                    isLoading={isCheckoutSubmit}
                    className="w-full h-10 rounded-sm"
                  >
                    {isCheckoutSubmit ? (
                      "Processing"
                    ) : (
                      <span className="flex justify-center text-center">
                        {String(checkout?.confirm_button ?? '')}
                        <span className="text-xl ml-2">
                          <IoArrowForward />
                        </span>
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* cart section */}
        <div className="md:w-full lg:w-2/5 lg:ml-10 xl:ml-14 md:ml-6 flex flex-col h-full md:sticky lg:sticky top-44 md:order-2 lg:order-2">
          <div className="border p-5 lg:px-8 lg:py-8 rounded-xl bg-card border-border shadow-sm order-1 sm:order-2">
            <h2 className="font-semibold text-lg pb-4">
              {String(checkout?.order_summary ?? '')}
            </h2>

            <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-64 bg-muted/30 rounded-lg block">
              {items.map((item) => (
                <CartItem key={item.id} item={item as unknown as Parameters<typeof CartItem>[0]["item"]} />
              ))}

              {isEmpty && (
                <div className="text-center py-10">
                  <span className="flex justify-center my-auto text-muted-foreground font-semibold text-4xl">
                    <IoBagHandle />
                  </span>
                  <h2 className="font-medium text-sm pt-2 text-muted-foreground">
                    No Item Added Yet!
                  </h2>
                </div>
              )}
            </div>

            <div className="flex items-center mt-4 py-4 lg:py-4 text-sm w-full font-semibold text-foreground last:border-b-0 last:text-base last:pb-0">
              <form className="w-full">
                {couponInfo.couponCode ? (
                  <span className="bg-accent px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                    <p className="text-primary">Coupon Applied </p>
                    <span className="text-primary font-bold text-right">
                      {couponInfo.couponCode}
                    </span>
                  </span>
                ) : (
                  <div className="flex flex-row items-start justify-end">
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
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {String(checkout?.sub_total ?? '')}
              <span className="ml-auto flex-shrink-0 text-foreground font-bold">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {String(checkout?.shipping_cost ?? '')}
              <span className="ml-auto flex-shrink-0 text-foreground font-bold">
                {formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex items-center py-2 text-sm w-full font-semibold text-muted-foreground last:border-b-0 last:text-base last:pb-0">
              {String(checkout?.discount ?? '')}
              <span className="ml-auto flex-shrink-0 font-bold text-orange-400">
                {formatPrice(discountAmount)}
              </span>
            </div>
            <div className="border-t mt-4">
              <div className="flex items-center font-bold justify-between pt-5 text-sm uppercase">
                {String(checkout?.total_cost ?? '')}
                <span className="font-extrabold text-lg">
                  {formatPrice(Number(total))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
