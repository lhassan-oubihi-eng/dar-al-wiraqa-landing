import React from "react";

/**
 * COD / delivery trust ribbon — a slim, always-visible strip that keeps the
 * 3 strongest Moroccan COD trust signals in front of a cold visitor:
 * الدفع عند الاستلام · توصيل مجاني · 24 ساعة.
 */
export function TrustRibbon() {
  return (
    <div
      className="mx-4 my-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl px-3 py-2 text-xs font-bold text-[#4B5563] md:text-sm"
      style={{
        background: "#F9F9F9",
        border: "1px solid #E5E5E5",
      }}
    >
      <span className="flex items-center gap-1.5 text-[#15803D]">🇲🇦 الدفع عند الاستلام</span>
      <span className="flex items-center gap-1.5 text-[#15803D]">🚚 توصيل مجاني</span>
      <span className="flex items-center gap-1.5 text-[#15803D]">⚡ 24 ساعة استلام</span>
    </div>
  );
}
