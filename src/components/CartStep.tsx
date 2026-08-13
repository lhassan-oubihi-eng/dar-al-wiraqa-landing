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
          <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm text-[#CDBB9C]">السلة فارغة حتى الآن.</p>
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
        <div className="border-t border-[#3A2E22] p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#A68B69]">الإجمالي (الباقات)</span>
            <span className="text-[#F3E6C4]">{baseTotal} درهم</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#A68B69]">باقة إضافية (اختياري)</span>
            <span className="text-[#16a34a]">+{bumpTotal} درهم</span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-[#F3E6C4]">الإجمالي الكلي</span>
            <span className="text-[#D4AF37]">{grandTotal} درهم</span>
          </div>
        </div>
      )}

      <div className="border-t border-[#3A2E22] p-3 flex gap-2">
        <button
          onClick={() => onNext()}
          disabled={items.length === 0}
          className="flex-1 rounded-lg bg-[#16a34a] py-2 text-xs font-bold text-white transition hover:scale-[1.03] disabled:opacity-50"
        >
          تأكيد الطلب
        </button>
      </div>
    </>
  );
}
