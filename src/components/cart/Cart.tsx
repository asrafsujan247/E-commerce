import { useNavigate } from "react-router-dom";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useState } from "react";

// Internal imports
import CartItem from "@components/cart/CartItem";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getUserSession } from "@lib/auth-client";
import { useSetting } from "@stores/useSettingStore";
import { useCartStore } from "@stores/useCartStore";
import GuestCheckoutPrompt from "@components/checkout/GuestCheckoutPrompt";

interface CartProps {
  setOpen: (open: boolean) => void;
}

const Cart = ({ setOpen }: CartProps) => {
  const navigate = useNavigate();
  const { isEmpty, items, cartTotal, totalItems } = useCartStore();
  const { formatPrice } = useUtilsFunction();
  const { globalSetting } = useSetting();

  const userInfo = getUserSession();
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);

  const handleCheckout = () => {
    if (items?.length <= 0) {
      setOpen(false);
    } else {
      if (!userInfo && !globalSetting?.enable_guest_order) {
        navigate("/auth/login?redirectUrl=/checkout");
        setOpen(false);
      } else if (!userInfo && globalSetting?.enable_guest_order) {
        setShowGuestPrompt(true);
      } else {
        navigate("/checkout");
        setOpen(false);
      }
    }
  };

  return (
    <>
      <GuestCheckoutPrompt
        isOpen={showGuestPrompt}
        onClose={() => {
          setShowGuestPrompt(false);
          setOpen(false);
        }}
      />
      <div className="flex flex-col h-full justify-between bg-card w-screen max-w-lg overflow-hidden shadow-2xl">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-card border-border">
          <h2 className="font-semibold text-lg m-0 text-foreground flex items-center gap-2.5">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FiShoppingCart aria-hidden="true" className="size-5 shrink-0" />
            </span>
            <span>Shopping Cart</span>
            {!isEmpty && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-semibold text-primary-foreground tabular-nums">
                {totalItems}
              </span>
            )}
          </h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="inline-flex size-9 items-center justify-center cursor-pointer text-muted-foreground rounded-full focus:outline-none transition-colors hover:bg-muted hover:text-foreground"
          >
            <IoClose className="size-5" />
          </button>
        </div>
        <div className="overflow-y-scroll grow scrollbar-hide w-full max-h-full p-4 lg:p-5">
          {isEmpty ? (
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-col items-center text-center">
                <img
                  className="size-36 flex-none rounded-md object-cover opacity-90"
                  src="/no-result.svg"
                  alt="no-result"
                  width={400}
                  height={380}
                />
                <h3 className="font-semibold text-foreground text-lg pt-5">
                  Your cart is empty
                </h3>
                <p className="max-w-xs px-6 text-center text-sm text-muted-foreground pt-2">
                  No items added in your cart. Please add product to your cart
                  list.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {items.map((item, i) => (
                <CartItem
                  key={i + 1}
                  item={
                    item as unknown as Parameters<typeof CartItem>[0]["item"]
                  }
                />
              ))}
            </div>
          )}
        </div>
        <div className="bg-card border-t border-border p-5 space-y-4">
          <div className="flex justify-between items-end gap-4">
            <div className="flex flex-col">
              <span className="text-base font-semibold text-foreground">
                Subtotal
              </span>
              <span className="text-sm text-muted-foreground font-normal">
                Shipping and taxes calculated at checkout.
              </span>
            </div>
            <span className="text-xl font-bold text-foreground tabular-nums whitespace-nowrap">
              {formatPrice(cartTotal)}
            </span>
          </div>

          <div className="flex space-x-3">
            <Link
              to="/checkout-cart"
              className="relative h-auto inline-flex items-center justify-center gap-2 rounded-lg transition-colors text-sm sm:text-base font-medium py-2.5 px-3 bg-card text-primary border border-primary hover:bg-primary/5 flex-1 focus:outline-none"
            >
              <FiShoppingCart className="size-5 shrink-0" />
              View Cart
            </Link>
            <button
              type="button"
              onClick={handleCheckout}
              className="relative h-auto inline-flex items-center justify-center gap-2 rounded-lg transition-colors text-sm sm:text-base font-medium py-2.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 focus:outline-none shadow-sm shadow-primary/30"
            >
              <IoBagCheckOutline className="size-5 shrink-0" />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
