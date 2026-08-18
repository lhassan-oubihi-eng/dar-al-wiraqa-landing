"use client";

import React from "react";
import { PackConfig } from "@/data/offers";
import { Truck, CreditCard, Tag, Gift } from "lucide-react";

export function PackUrgencyBanner({ pack }: { pack: PackConfig }) {
  const original = pack.originalPrice;
  const savings = original - pack.price;
  const pct = original > 0 ? Math.round(((original - pack.price) / original) * 100) : 0;

  return (
    <div className="bg-gradient-to-b from-red-600 via-red-700 to-red-800 text-white">
      <div className="mx-auto max-w-[420px] px-4 py-5">
        {/* Header Tag — honest offer, not fake scarcity */}
        <div className="flex justify-center mb-3">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 px-3 py-1 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-amber-300" />
            توصيل مجاني + هدية مع الباقة
          </span>
        </div>

        {/* Main Headline — value, not fake urgency */}
        <h2 className="text-center font-black text-lg md:text-xl leading-snug mb-4">
          اطلب {pack.packName} الآن واحصل على التوصيل المجاني + هدية
        </h2>

        {/* Honest value cards (no fabricated scarcity/social proof) */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-inner">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Tag className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-[10px] font-medium text-red-100 mb-1">السعر بعد الخصم</p>
            <div className="flex items-center justify-center gap-1">
              <span className="bg-white text-red-700 font-black text-sm px-1.5 py-1 rounded-md font-mono tabular-nums">
                {pack.price}
              </span>
              <span className="text-white/90 font-bold text-[10px] self-end pb-1">درهم</span>
            </div>
            <p className="text-[9px] text-amber-200 mt-1">وفر {savings} د.م (-{pct}%)</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-inner">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Truck className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-[10px] font-medium text-red-100 mb-1">التوصيل</p>
            <p className="text-xs font-bold text-white leading-tight">24-48 ساعة</p>
            <p className="text-[9px] text-amber-200 mt-1">لجميع المدن</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center shadow-inner">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-300" />
            </div>
            <p className="text-[10px] font-medium text-red-100 mb-1">الدفع</p>
            <p className="text-xs font-bold text-white leading-tight">عند الاستلام</p>
            <p className="text-[9px] text-emerald-200 mt-1">نقداً</p>
          </div>
        </div>

        <p className="text-center text-xs text-white/80 font-medium">
          ثمن الباقة {original} درهم — تدفع فقط {pack.price} درهم (توصيل مجاني)
        </p>
      </div>
    </div>
  );
}
