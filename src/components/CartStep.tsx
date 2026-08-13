"use client";

import { ShoppingCart } from "lucide-react";
import { CartItem } from "@/components/CartContext";
import { CartItemRow } from "@/components/CartItemRow";

interface CartStepProps {
  items: CartItem[];
  baseTotal: number;
  bumpTotal: number;
  grandTotal: number;
  empty: boolean;
  onQty: (slug: string, q: number) => void;
  onRemove: (slug: string) => void;
  onToggleBump: (slug: string) => void;
  onNext: () => void;
}

/** The "cart contents" step: list of packs + live totals + confirm button. */
export function CartStep({
  items,
  baseTotal,
  bumpTotal,
  grandTotal,
  empty,
  onQty,
  onRemove,
  onToggleBump,
  onNext,
}: CartStepProps) {
  return (
    <>
      {empty ? (
        <div className="flex-1 overflow-y-auto p-8 text-center">
          <ShoppingCart size={40} className="mx-auto mb-2 opacity-40 text-[#9CA3AF]" />
          <p className="text-sm text-[#4B5563]">السلة فارغة حتى الآن.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((it: CartItem) => (
            <CartItemRow
              key={it.pack.slug}
              item={it}
              onQty={onQty}
              onRemove={onRemove}
              onToggleBump={onToggleBump}
            />
          ))}
        </div>
      )}

      {!empty && (
        <div className="border-t border-[#E5E5E5] p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6B7280]">الإجمالي (الباقات)</span>
            <span className="text-[#1F2937]">{baseTotal} درهم</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6B7280]">باقة إضافية (اختياري)</span>
            <span className="text-[#15803D]">+{bumpTotal} درهم</span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-[#1F2937]">الإجمالي الكلي</span>
            <span className="text-[#D4AF37]">{grandTotal} درهم</span>
          </div>
        </div>
      )}

      <div className="border-t border-[#E5E5E5] p-3 flex gap-2">
        <button
          onClick={() => onNext()}
          disabled={items.length === 0}
          className="flex-1 rounded-xl bg-[#15803D] py-2 text-xs font-bold text-white hover:bg-[#16a34a] disabled:opacity-50 transition"
        >
          تأكيد الطلب
        </button>
      </div>
    </>
  );
}
