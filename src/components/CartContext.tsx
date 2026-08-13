"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { PackConfig } from "@/data/offers";

export interface CartItem {
  pack: PackConfig;
  quantity: number;
  bump: boolean;
}

export interface CartContextValue {
  items: CartItem[];
  addPack: (pack: PackConfig, quantity?: number, bump?: boolean) => void;
  removePack: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  toggleBump: (slug: string) => void;
  clearCart: () => void;
  itemCount: number;
  packCount: number;
  baseTotal: number;
  bumpTotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "dar-al-wiraqa-cart";
export const ADDED_BUMP_PRICE = 49; // mirrors CheckoutSection order-bump

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage (SSR-safe).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        setItems(parsed.filter((it) => it?.pack?.slug));
      }
    } catch {
      /* ignore corrupt cache */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* non-blocking */
    }
  }, [items]);

  const addPack = (pack: PackConfig, quantity = 1, bump = false) => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.pack.slug === pack.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          pack,
          quantity: copy[idx].quantity + quantity,
          bump: copy[idx].bump || bump,
        };
        return copy;
      }
      return [...prev, { pack, quantity, bump }];
    });
  };

  const removePack = (slug: string) =>
    setItems((prev) => prev.filter((it) => it.pack.slug !== slug));

  const updateQuantity = (slug: string, quantity: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.pack.slug === slug
          ? { ...it, quantity: Math.max(1, Math.min(9, quantity)) }
          : it
      )
    );

  const toggleBump = (slug: string) =>
    setItems((prev) =>
      prev.map((it) => (it.pack.slug === slug ? { ...it, bump: !it.bump } : it))
    );

  const clearCart = () => setItems([]);

  const packCount = items.reduce((n, it) => n + it.quantity, 0);
  const baseTotal = items.reduce(
    (n, it) => n + it.pack.price * it.quantity,
    0
  );
  const bumpTotal = items.reduce(
    (n, it) => n + (it.bump ? ADDED_BUMP_PRICE * it.quantity : 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addPack,
        removePack,
        updateQuantity,
        toggleBump,
        clearCart,
        itemCount: items.length,
        packCount,
        baseTotal,
        bumpTotal,
        grandTotal: baseTotal + bumpTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart used outside CartProvider");
  return ctx;
}
