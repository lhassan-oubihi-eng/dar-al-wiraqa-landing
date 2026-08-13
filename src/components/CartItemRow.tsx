"use client";

import { X } from "lucide-react";
import { CartItem, ADDED_BUMP_PRICE } from "@/components/CartContext";

interface CartItemRowProps {
  item: CartItem;
  onQty: (slug: string, q: number) => void;
  onRemove: (slug: string) => void;
  onToggleBump: (slug: string) => void;
}

/** Single pack row inside the cart drawer: qty picker, bump toggle, line total. */
export function CartItemRow({
  item,
  onQty,
  onRemove,
  onToggleBump,
}: CartItemRowProps) {
  const { pack, quantity, bump } = item;
  const lineTotal =
    pack.price * quantity + (bump ? ADDED_BUMP_PRICE * quantity : 0);

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] p-3">
      <div className="flex items-start gap-2.5">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="line-clamp-1 text-[11px] font-bold text-[#1F2937]">
            {pack.packName}
          </span>
          <X
            size={12}
            className="mt-0.5 cursor-pointer text-[#9CA3AF] opacity-60 hover:text-[#15803D]"
            onClick={() => onRemove(pack.slug)}
          />
        </div>

        <div className="mt-1 flex-1 space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#6B7280]">
              {pack.books.length} كتب · {pack.price} درهم/الباقة
            </span>
            <div className="flex items-center gap-0.5 rounded border border-[#D1D5DB] bg-white text-[11px] text-[#1F2937]">
              <button
                type="button"
                onClick={() => onQty(pack.slug, quantity - 1)}
                className="px-1.5 py-0.5 hover:text-[#15803D]"
              >
                −
              </button>
              <span className="px-0.5">{quantity}</span>
              <button
                type="button"
                onClick={() => onQty(pack.slug, quantity + 1)}
                className="px-1.5 py-0.5 hover:text-[#15803D]"
              >
                +
              </button>
            </div>
          </div>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={bump}
              onChange={() => onToggleBump(pack.slug)}
              className="h-3 w-3 rounded border-[#D1D5DB] text-[#15803D] focus:ring-[#15803D]"
            />
            <span className="text-[10px] text-[#6B7280]">
              أضف باقة ثانية بخصم (١٤٩ درهم)
            </span>
          </label>

          <div className="text-end text-xs font-bold text-[#D4AF37]">
            {lineTotal} درهم
          </div>
        </div>
      </div>
    </div>
  );
}
