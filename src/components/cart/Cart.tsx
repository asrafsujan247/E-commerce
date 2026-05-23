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
  const { isEmpty, items, cartTotal } = useCartStore();
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
      <div className="flex flex-col h-full justify-between items-middle bg-background rounded w-screen max-w-lg">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-primary/5 border-border">
          <h2 className="font-semibold text-lg m-0 text-foreground flex items-center">
            <FiShoppingCart
              aria-hidden="true"
              className="size-6 shrink-0 me-2"
            />
            Shopping Cart
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex text-base items-center cursor-pointer justify-center text-muted-foreground p-2 focus:outline-none transition-opacity hover:text-red-400"
          >
            <IoClose />
            <span className="font-sens text-sm text-muted-foreground hover:text-red-400 ml-1">
              Close
            </span>
          </button>
        </div>
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full p-4 lg:p-6">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
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

          {items.map((item, i) => (
            <CartItem
              key={i + 1}
              item={item as unknown as Parameters<typeof CartItem>[0]["item"]}
            />
          ))}
        </div>
        <div className="bg-muted/50 dark:bg-muted/30 border-t border-border p-5">
          <p className="flex justify-between font-semibold text-foreground">
            <span>
              <span>Subtotal</span>
              <span className="block text-sm text-muted-foreground font-normal">
                Shipping and taxes calculated at checkout.
              </span>
            </span>
            <span>{formatPrice(cartTotal)}</span>
          </p>

          <div className="flex space-x-3 mt-5">
            <Link
              to="/checkout-cart"
              className="relative h-auto inline-flex items-center justify-center rounded-lg transition-colors text-sm sm:text-base font-medium py-2.5 px-3 bg-background text-foreground hover:bg-muted flex-1 border border-border"
            >
              View Cart
            </Link>
            <button
              type="button"
              onClick={handleCheckout}
              className="relative h-auto inline-flex items-center justify-center rounded-lg transition-colors text-sm sm:text-base font-medium py-2.5 px-3 bg-primary hover:bg-primary/90 text-primary-foreground flex-1 focus:outline-none"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
