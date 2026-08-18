"use client";

import React, { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";

interface ExitIntentPopupProps {
  packName: string;
  price: number;
  onReserve: () => void;
}

/**
 * Exit-intent popup — appears once (per browser) when the visitor moves the
 * mouse toward the top of the viewport (the classic "about to leave" signal).
 * It reframes the reassuring COD message ("احجز مكانك بلا دفع الآن") as the
 * exit hook and scrolls straight to the checkout form on click.
 *
 * Completely optional UX: it never blocks, auto-dismisses, and stores a flag
 * so a returning visitor (e.g. via retargeting) isn't nagged again.
 */
export function ExitIntentPopup({
  packName,
  price,
  onReserve,
}: ExitIntentPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const KEY = "daw_exit_seen";
    let seen = false;
    try {
      seen = window.localStorage.getItem(KEY) === "1";
    } catch {
      /* non-blocking */
    }
    if (seen) return;

    const onMouseOut = (e: MouseEvent) => {
      // Only when leaving toward the top (y <= 0) — the true exit intent.
      if (e.clientY <= 0) {
        setOpen(true);
        try {
          window.localStorage.setItem(KEY, "1");
        } catch {
          /* non-blocking */
        }
        document.removeEventListener("mouseout", onMouseOut);
      }
      // Also trigger when the tab loses visibility (mobile).
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setOpen(true);
        try {
          window.localStorage.setItem(KEY, "1");
        } catch {
          /* non-blocking */
        }
      }
    };

    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,.55)" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl"
        style={{ background: "var(--color-card)", color: "var(--color-ink)" }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="إغلاق"
          className="absolute top-3 left-3 rounded-full p-1.5 hover:bg-[#F3F4F6]"
        >
          <X size={18} className="text-[#F3E6C4]" />
        </button>

        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-2xl"
          style={{ background: "#271F17" }}
        >
          <Gift className="w-8 h-8 text-amber-300 inline-block align-sub" />
        </div>
        <h3 className="text-xl md:text-2xl font-black mb-1">
          لا تغادر الباقة الآن!
        </h3>
        <p className="text-base text-[#F3E6C4] leading-relaxed mb-4">
          «{packName}» بـ <strong className="text-[#16a34a] text-lg">{price} درهم</strong>{" "}
          شامل التوصيل — والدفع <strong>عند الاستلام</strong>. احجز مكانك الآن
          وبلا أي دفع مسبق.
        </p>
        <button
          onClick={() => {
            setOpen(false);
            onReserve();
          }}
          className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-4 text-lg font-extrabold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          احجز الباقة الآن — بلا دفع مسبق
        </button>
        <button
          onClick={() => setOpen(false)}
          className="mt-2 w-full text-sm text-[#A68B69] underline"
        >
          لا شكراً، سأعيد التفكير
        </button>
      </div>
    </div>
  );
}
