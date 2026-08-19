"use client";

import React from "react";
import { PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";
import { Gift, Truck, Check, Search, Zap, BookOpen } from "lucide-react";

const GUARANTEES = [
  { icon: Search, label: "معاينة قبل الدفع" },
  { icon: Zap, label: "توصيل 24-48 ساعة" },
  { icon: BookOpen, label: "طباعة نقية ومريحة" },
];

export function BundleShowcase({ pack }: { pack: PackConfig }) {
  const savings = pack.originalPrice - pack.price;

  return (
    <section className="mx-4 mt-4">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
        {/* Book covers with titles directly underneath */}
        <div className="grid grid-cols-3 gap-2.5">
          {pack.books.map((book, i) => {
            const isGift = i === pack.giftBookIndex;
            return (
              <div key={book.id} className="flex flex-col">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] shadow-sm">
                  <BookCover
                    title={book.title}
                    src={book.coverUrl}
                    className="h-full w-full object-cover"
                  />
                  {isGift && (
                    <span className="absolute inset-x-0 bottom-0 bg-[#047857] text-white text-[10px] font-extrabold py-1 flex items-center justify-center gap-1">
                      <Gift className="w-3 h-3 text-amber-300" />
                      🎁 هدية مجانية
                    </span>
                  )}
                </div>
                <p className="mt-1 text-center text-[11px] font-bold text-[#111827] leading-tight line-clamp-2">
                  {book.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Price anchor */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-gray-400 line-through text-base">
            {pack.originalPrice} درهم
          </span>
          <span className="text-3xl font-black text-[#047857]">
            {pack.price} درهم
          </span>
          <span className="bg-[#047857] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            وفر {savings} د.م
          </span>
        </div>
        <p className="text-center text-sm font-bold text-[#047857] mt-1 flex items-center justify-center gap-1">
          <Truck className="w-4 h-4 text-[#047857]" />
          شامل التوصيل المجاني
        </p>

        {/* 3-point guarantee strip — compact 1-row flex */}
        <div className="mt-4 flex flex-row items-stretch gap-2">
          {GUARANTEES.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.label}
                className="flex-1 flex items-center justify-center gap-1.5 border border-[#047857]/20 rounded-lg bg-white px-1.5 py-2"
              >
                <Icon className="w-4 h-4 text-[#047857] shrink-0" />
                <span className="text-[10px] font-bold text-[#111827] leading-tight">{g.label}</span>
              </div>
            );
          })}
        </div>

        {/* Book checklist with green checkmarks */}
        <div className="mt-4 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
          <ul className="space-y-1.5">
            {pack.books.map((book, i) => (
              <li
                key={book.id}
                className="flex items-center gap-2 text-sm font-medium text-[#111827]"
              >
                <Check className="w-4 h-4 text-[#047857] shrink-0" />
                <span className={i === pack.giftBookIndex ? "text-[#047857] font-extrabold" : ""}>
                  {book.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
