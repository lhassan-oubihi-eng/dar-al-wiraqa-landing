import React from "react";

/**
 * COD / delivery trust ribbon — a slim, always-visible strip that keeps the
 * 3 strongest Moroccan COD trust signals in front of a cold visitor:
 * الدفع عند الاستلام · توصيل مجاني · 24 ساعة.
 */
export function TrustRibbon() {
  return (
    <div
      className="mx-4 my-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl px-3 py-2 text-[11px] font-bold text-[#F3E6C4] md:text-[12px]"
      style={{
        background: "linear-gradient(90deg,#271F17,#FFFFFF,#271F17)",
        border: "1px solid var(--color-border)",
      }}
    >
      <span className="flex items-center gap-1.5">🇲🇦 الدفع عند الاستلام</span>
      <span className="flex items-center gap-1.5">🚚 توصيل مجاني</span>
      <span className="flex items-center gap-1.5">⚡ 24 ساعة</span>
    </div>
  );
}
