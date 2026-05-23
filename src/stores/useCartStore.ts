import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartStoreItem {
  id: string;
  price: number;
  quantity: number;
  itemTotal: number;
  [key: string]: unknown;
}

interface CartState {
  items: CartStoreItem[];
  isEmpty: boolean;
  totalItems: number;
  cartTotal: number;
  addItem: (
    item: { id: string; price: number; [key: string]: unknown },
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  emptyCart: () => void;
  inCart: (id: string) => boolean;
  getItem: (id: string) => CartStoreItem | undefined;
}

function computeDerived(items: CartStoreItem[]) {
  const totalItems = items.reduce((sum, i) => sum + (i.quantity ?? 0), 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + i.price * (i.quantity ?? 0),
    0
  );
  return { totalItems, cartTotal, isEmpty: items.length === 0 };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isEmpty: true,
      totalItems: 0,
      cartTotal: 0,

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          let newItems: CartStoreItem[];
          if (existing) {
            newItems = state.items.map((i) => {
              if (i.id !== item.id) return i;
              const newQty = (i.quantity ?? 0) + quantity;
              return { ...i, quantity: newQty, itemTotal: i.price * newQty };
            });
          } else {
            const newItem: CartStoreItem = {
              ...item,
              quantity,
              itemTotal: item.price * quantity,
            };
            newItems = [...state.items, newItem];
          }
          return { items: newItems, ...computeDerived(newItems) };
        });
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          return { items: newItems, ...computeDerived(newItems) };
        });
      },

      updateItemQuantity: (id, quantity) => {
        set((state) => {
          let newItems: CartStoreItem[];
          if (quantity <= 0) {
            newItems = state.items.filter((i) => i.id !== id);
          } else {
            newItems = state.items.map((i) => {
              if (i.id !== id) return i;
              return { ...i, quantity, itemTotal: i.price * quantity };
            });
          }
          return { items: newItems, ...computeDerived(newItems) };
        });
      },

      emptyCart: () => {
        set({ items: [], isEmpty: true, totalItems: 0, cartTotal: 0 });
      },

      inCart: (id) => get().items.some((i) => i.id === id),

      getItem: (id) => get().items.find((i) => i.id === id),
    }),
    { name: "kachabazar-cart" }
  )
);
