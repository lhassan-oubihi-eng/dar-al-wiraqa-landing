import React from "react";
import { Truck, Zap, Banknote } from "lucide-react";

/**
 * COD / delivery trust ribbon — a slim, always-visible strip that keeps the
 * 3 strongest Moroccan COD trust signals in front of a cold visitor:
 * الدفع عند الاستلام · توصيل مجاني · 24 ساعة.
 */
export function TrustRibbon() {
  return (
    <div
      className="mx-4 my-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl px-3 py-2 text-sm font-bold text-[#4B5563] md:text-base"
      style={{
        background: "#F9F9F9",
        border: "1px solid #E5E5E5",
      }}
    >
      <span className="flex items-center gap-1.5 text-[#15803D]">
        <Banknote className="w-5 h-5 text-rose-500 inline-block ml-1.5 align-sub" /> الدفع عند الاستلام
      </span>
      <span className="flex items-center gap-1.5 text-[#15803D]">
        <Truck className="w-5 h-5 text-rose-500 inline-block ml-1.5 align-sub" /> توصيل مجاني
      </span>
      <span className="flex items-center gap-1.5 text-[#15803D]">
        <Zap className="w-4 h-4 text-amber-500 fill-amber-500 inline-block ml-1.5 align-sub" /> 24 ساعة استلام
      </span>
    </div>
  );
}
