import { useState } from "react";
import { useCartStore } from "@stores/useCartStore";
import { notifyError, notifySuccess } from "@utils/toast";
import type { Product, CartItem } from "@appTypes/index";

interface CartProduct extends Partial<Product> {
  id?: string;
  _id?: string;
  title?: string | Record<string, string>;
  inCampaign?: boolean;
  campaignRemainingStock?: number;
  variant?: Record<string, unknown>;
  variants?: Array<Record<string, unknown>>;
  stock?: number;
  [key: string]: unknown;
}

interface UseAddToCartReturn {
  item: number;
  setItem: React.Dispatch<React.SetStateAction<number>>;
  totalItems: number;
  handleAddItem: (product: CartProduct, quantity?: number) => void;
  handleIncreaseQuantity: (product: CartProduct & { quantity?: number }) => void;
}

const getMaxStock = (product: CartProduct): number => {
  if (product?.inCampaign && product?.campaignRemainingStock != null) {
    return product.campaignRemainingStock;
  }
  const variants = product?.variants;
  if (Array.isArray(variants) && variants.length > 0) {
    const variant = product?.variant as { quantity?: number } | undefined;
    return (variant?.quantity as number) ?? 0;
  }
  return (product?.stock as number) ?? 0;
};

const useAddToCart = (): UseAddToCartReturn => {
  const [item, setItem] = useState(1);
  const { addItem, items, updateItemQuantity, totalItems } = useCartStore();

  const handleAddItem = (product: CartProduct, quantity?: number): void => {
    const qty = quantity ?? item;
    const result = items.find((i) => i.id === (product.id ?? product._id));
    const { variants, categories, description, campaign, ...updatedProduct } =
      product as CartProduct & {
        categories?: unknown;
        description?: unknown;
        campaign?: unknown;
      };

    const maxStock = getMaxStock(product);

    if (result !== undefined) {
      const cartItem = result as unknown as CartItem & { quantity?: number };
      if ((cartItem.quantity ?? 0) + qty <= maxStock) {
        addItem(updatedProduct as { id: string; price: number; [key: string]: unknown }, qty);
        notifySuccess(`${qty} ${String(product.title ?? "")} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    } else {
      if (qty <= maxStock) {
        addItem(updatedProduct as { id: string; price: number; [key: string]: unknown }, qty);
        notifySuccess(`${qty} ${String(product.title ?? "")} added to cart!`);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  const handleIncreaseQuantity = (
    product: CartProduct & { quantity?: number }
  ): void => {
    const result = items?.find(
      (p) => p.id === (product.id ?? product._id)
    );
    const maxStock = getMaxStock(product);

    if (result) {
      const cartItem = result as unknown as CartItem & { quantity?: number };
      if ((cartItem.quantity ?? 0) + item <= maxStock) {
        updateItemQuantity(result.id, (product.quantity ?? 0) + 1);
      } else {
        notifyError("Insufficient stock!");
      }
    }
  };

  return {
    item,
    setItem,
    totalItems,
    handleAddItem,
    handleIncreaseQuantity,
  };
};

export default useAddToCart;
