"use client";

import { X } from "lucide-react";
import { CartItem } from "@/components/CartContext";
import { CartStep } from "@/components/CartStep";
import { CheckoutStep } from "@/components/CheckoutStep";

export interface CartDrawerPanelProps {
  items: CartItem[];
  packCount: number;
  baseTotal: number;
  grandTotal: number;
  step: "cart" | "checkout";
  form: { name: string; phone: string; city: string };
  onSetForm: (f: { name: string; phone: string; city: string }) => void;
  submitting: boolean;
  error: string | null;
  done: boolean;
  packItems: CartItem[];
  onOpen: (o: boolean) => void;
  onQty: (slug: string, q: number) => void;
  onRemove: (slug: string) => void;
  onNext: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onWhatsApp: () => void;
}

/** Presentational shell for the cart drawer (no logic beyond layout). */
export function CartDrawerPanel(p: CartDrawerPanelProps) {
  const {
    items,
    packCount,
    baseTotal,
    grandTotal,
    step,
    form,
    onSetForm,
    submitting,
    error,
    done,
    packItems,
    onOpen,
    onQty,
    onRemove,
    onNext,
    onSubmit,
    onWhatsApp,
  } = p;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
        onClick={() => onOpen(false)}
      />
      <aside className="fixed inset-y-0 end-0 z-[100] w-full max-w-md overflow-y-auto border-s border-[#E5E5E5] bg-white text-[#1F2937] shadow-2xl flex flex-col">
        <div className="relative border-b border-[#E5E5E5] p-4 text-center">
          <h2 className="font-display text-lg font-bold text-[#1F2937]">
            سلة الشراء
          </h2>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            {packCount} عنصر · {grandTotal} درهم
          </p>
          <button
            onClick={() => onOpen(false)}
            className="absolute end-3 top-3 text-[#6B7280] hover:text-[#15803D]"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="flex-1 overflow-y-auto p-8 text-center">
            <div className="mb-3 text-3xl">✅</div>
            <h3 className="font-display text-lg font-bold text-[#15803D]">
              تم تقديم طلبك!
            </h3>
            <p className="mt-2 text-sm text-[#4B5563]">
              استلمنا طلبك وسنتصل بك لتأكيده.
            </p>
            <button
              onClick={() => onOpen(false)}
              className="mt-5 w-full rounded-xl bg-[#15803D] py-2.5 text-sm font-bold text-white hover:bg-[#16a34a] transition"
            >
              إغلاق
            </button>
          </div>
        ) : step === "cart" ? (
          <CartStep
            items={packItems}
            baseTotal={baseTotal}
            grandTotal={grandTotal}
            onQty={onQty}
            onRemove={onRemove}
            onNext={onNext}
            empty={items.length === 0}
          />
        ) : (
          <CheckoutStep
            form={form}
            onSetForm={onSetForm}
            submitting={submitting}
            error={error}
            onSubmit={onSubmit}
            onWhatsApp={onWhatsApp}
          />
        )}
      </aside>
    </>
  );
}