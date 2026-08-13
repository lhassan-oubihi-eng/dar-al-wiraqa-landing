"use client";

import { useState, useEffect } from "react";
import {
  useCart,
  CartItem,
  ADDED_BUMP_PRICE,
} from "@/components/CartContext";
import { CartDrawerPanel } from "@/components/CartDrawerPanel";

export interface CartDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PHONE_RE = /^(06|07)\d{8}$/;

/**
 * Controller for the mini-cart. Owns cart state interactions + order
 * submission (POSTs the whole basket to /api/order for server-side lead
 * capture + Meta CAPI). Rendering lives in <CartDrawerPanel />.
 */
export function CartDrawer({ open: controlled, onOpenChange }: CartDrawerProps) {
  const {
    items,
    removePack,
    updateQuantity,
    toggleBump,
    clearCart,
    baseTotal,
    bumpTotal,
    grandTotal,
    packCount,
  } = useCart();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Close drawer on Escape + body-scroll lock.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prev;
    };
  }, [open, setOpen]);

  const reset = () => {
    setStep("cart");
    setError(null);
    setForm({ name: "", phone: "", city: "" });
    setDone(false);
  };
  const handleOpen = (o: boolean) => {
    setOpen(o);
    if (o) reset();
  };
  const handleQty = (slug: string, next: number) => {
    if (next < 1 || next > 9) return;
    updateQuantity(slug, next);
  };

  const buildLines = (): string => {
    const lines: string[] = [];
    for (const it of items) {
      const books = it.pack.books
        .map((b, i) => {
          const gift = i === it.pack.giftBookIndex ? " [هدية]" : "";
          return `${String(b.id).padStart(3, "0")} — ${b.title}${gift}`;
        })
        .join("\n");
      lines.push(
        `• ${it.pack.packName} ×${it.quantity} → ${it.pack.price * it.quantity} درهم` +
          (it.bump ? ` + ${ADDED_BUMP_PRICE * it.quantity} درهم (باقة إضافية)` : "") +
          ` | منشأ:\n${books}`
      );
    }
    return lines.join("\n\n");
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.phone || !form.city) {
      setError("رجاءً املأ جميع الحقول.");
      return;
    }
    if (!PHONE_RE.test(form.phone)) {
      setError("أدخل رقم هاتف صحيح يبدأ بـ 06 أو 07.");
      return;
    }
    if (items.length === 0) {
      setError("السلة فارغة.");
      return;
    }
    setSubmitting(true);

    const payload = {
      name: form.name,
      phone: form.phone,
      address: form.city,
      packName: items.map((it) => it.pack.packName).join(" + "),
      books: buildLines(),
      price: `${grandTotal} درهم`,
      count: items.reduce(
        (n, it) =>
          n + it.pack.books.length * it.quantity + (it.bump ? it.quantity : 0),
        0
      ),
      fbclid:
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("fbclid") ?? ""
          : "",
    };

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "فشل تسجيل الطلب.");
      clearCart();
      setDone(true);
    } catch (err: any) {
      setError(err?.message ?? "خطأ غير متوقع.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (items.length === 0) return;
    const summary = items
      .map((it) => `${it.pack.packName} x${it.quantity} @ ${it.pack.price}د`)
      .join(" + ");
    const msg = encodeURIComponent(
      `طلب من دار الوِراقة\n${summary}\nالمجموع: ${grandTotal} درهم\nالاسم: ${form.name}\nالهاتف: ${form.phone}\nالمدينة/العنوان: ${form.city}`
    );
    window.open(
      `https://wa.me/212600000000?text=${msg}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!open) return null;

  return (
    <CartDrawerPanel
      items={items}
      packCount={packCount}
      baseTotal={baseTotal}
      bumpTotal={bumpTotal}
      grandTotal={grandTotal}
      step={step}
      form={form}
      onSetForm={setForm}
      submitting={submitting}
      error={error}
      done={done}
      packItems={items as CartItem[]}
      onOpen={handleOpen}
      onQty={handleQty}
      onRemove={removePack}
      onToggleBump={toggleBump}
      onNext={() => setStep("checkout")}
      onSubmit={handleConfirm}
      onWhatsApp={handleWhatsApp}
    />
  );
}

