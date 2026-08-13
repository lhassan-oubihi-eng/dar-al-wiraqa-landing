"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { CartDrawer } from "@/components/CartDrawer";

/** Floating "open cart" button with a live item-count badge. */
export function CartButton() {
  const { packCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="فتح السلة"
        className="fixed bottom-5 end-5 z-[100] flex h-13 w-13 items-center justify-center rounded-full bg-[#16a34a] text-white shadow-xl shadow-black/40 transition hover:scale-105"
      >
        <ShoppingCart size={22} />
        {packCount > 0 && (
          <span className="absolute -top-1 -end-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1 text-[10px] font-extrabold text-[#131010]">
            {packCount}
          </span>
        )}
      </button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
