import { Link } from "react-router-dom";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

// Internal imports
import useAddToCart from "@hooks/useAddToCart";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { useCartStore } from "@stores/useCartStore";

interface CartItemVariant {
  size?: string;
  [key: string]: unknown;
}

interface CartItemData {
  id: string;
  slug?: string;
  title: string;
  image?: string | string[];
  price: number;
  quantity: number;
  variant?: CartItemVariant;
  variants?: unknown[];
}

interface CartItemProps {
  item: CartItemData;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateItemQuantity, removeItem } = useCartStore();
  const { handleIncreaseQuantity } = useAddToCart();
  const { formatPrice } = useUtilsFunction();

  return (
    <div className="group w-full h-auto flex justify-start items-center gap-4 p-3 rounded-xl transition-colors relative hover:bg-muted/50">
      <div className="relative flex shrink-0 cursor-pointer">
        <Link to={`/product/${item.slug || item.id}`}>
          <ImageWithFallback
            img
            width={40}
            height={40}
            src={
              Array.isArray(item.image)
                ? item.image[0]
                : (item.image as string | undefined)
            }
            alt={item.title}
            className="size-20 flex-none rounded-xl bg-muted object-cover ring-1 ring-border/60 transition group-hover:ring-primary/40"
          />
        </Link>
      </div>
      <div className="flex flex-col w-full overflow-hidden gap-1.5">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <Link
              to={`/product/${item.slug || item.id}`}
              className="block truncate text-sm font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
            {item.variant?.size && (
              <span className="mt-1 inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {item.variant.size}
              </span>
            )}
            <span className="block text-xs text-muted-foreground mt-0.5">
              {formatPrice(item.price)} each
            </span>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            aria-label="Remove item"
            className="shrink-0 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 text-base cursor-pointer transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center p-0.5 border border-border bg-muted/50 text-foreground rounded-lg">
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="grid size-7 place-items-center rounded-md text-foreground cursor-pointer hover:bg-card hover:text-primary transition-colors"
            >
              <FiMinus />
            </button>
            <p className="w-8 text-center text-sm font-semibold text-foreground tabular-nums">
              {item.quantity}
            </p>
            <button
              onClick={() =>
                handleIncreaseQuantity(
                  item as Parameters<typeof handleIncreaseQuantity>[0]
                )
              }
              aria-label="Increase quantity"
              className="grid size-7 place-items-center rounded-md text-foreground cursor-pointer hover:bg-card hover:text-primary transition-colors"
            >
              <FiPlus />
            </button>
          </div>

          <div className="font-bold text-primary text-sm md:text-base leading-5 tabular-nums">
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
