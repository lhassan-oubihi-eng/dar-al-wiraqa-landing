"use client";

import { X } from "lucide-react";
import { CartItem } from "@/components/CartContext";
import { CartStep } from "@/components/CartStep";
import { CheckoutStep } from "@/components/CheckoutStep";

export interface CartDrawerPanelProps {
  items: CartItem[];
  packCount: number;
  baseTotal: number;
  bumpTotal: number;
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
  onToggleBump: (slug: string) => void;
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
    bumpTotal,
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
    onToggleBump,
    onNext,
    onSubmit,
    onWhatsApp,
  } = p;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={() => onOpen(false)}
      />
      <aside className="fixed inset-y-0 end-0 z-[100] w-full max-w-md overflow-y-auto border-s border-[#3A2E22] bg-[#1B120F] text-[#CDBB9C] shadow-2xl flex flex-col">
        <div className="relative border-b border-[#3A2E22] p-4 text-center">
          <h2 className="font-display text-lg font-bold text-[#F3E6C4]">
            سلة الشراء
          </h2>
          <p className="mt-0.5 text-xs text-[#A68B69]">
            {packCount} عنصر · {grandTotal} درهم
          </p>
          <button
            onClick={() => onOpen(false)}
            className="absolute end-3 top-3 text-[#A68B69] hover:text-[#F3E6C4]"
            aria-label="إغلاف"
          >
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="flex-1 overflow-y-auto p-8 text-center">
            <div className="mb-3 text-3xl">✅</div>
            <h3 className="font-display text-lg font-bold text-[#16a34a]">
              تم تقديم طلبك!
            </h3>
            <p className="mt-2 text-sm text-[#CDBB9C]">
              استلمنا طلبك وسنتصل بك لتأكيده. سلة الشراء أُفرقت.
            </p>
            <button
              onClick={() => onOpen(false)}
              className="mt-5 w-full rounded-lg bg-[#16a34a] py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              إغلاق
            </button>
          </div>
        ) : step === "cart" ? (
          <CartStep
            items={packItems}
            baseTotal={baseTotal}
            bumpTotal={bumpTotal}
            grandTotal={grandTotal}
            onQty={onQty}
            onRemove={onRemove}
            onToggleBump={onToggleBump}
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
