"use client";

import React, { useEffect, useState } from "react";
import { PackConfig } from "@/data/offers";
import { ShoppingBag } from "lucide-react";

export function StickyMobileCTA({ pack }: { pack: PackConfig }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const form = document.getElementById("checkout-form");
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { root: null, rootMargin: "0px", threshold: 0.15 }
    );

    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const scrollToForm = () => {
    document
      .getElementById("checkout-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-3 border-t border-gray-200 shadow-2xl flex items-center justify-between md:hidden">
      {/* Price on the right (first child in RTL) */}
      <div className="flex items-center gap-1.5 pl-3">
        <span className="text-[11px] font-bold text-gray-500 leading-tight text-right max-w-[90px] line-clamp-1">
          {pack.packName}
        </span>
        <span className="font-black text-lg text-gray-900">{pack.price} د.م</span>
      </div>

      {/* CTA on the left (second child in RTL) */}
      <button
        onClick={scrollToForm}
        type="button"
        className="bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <ShoppingBag className="w-5 h-5 shrink-0" />
        <span>تأكيد الطلب الآن</span>
      </button>
    </div>
  );
}
