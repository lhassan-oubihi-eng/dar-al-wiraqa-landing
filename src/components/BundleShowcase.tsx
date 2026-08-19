"use client";

import React from "react";
import { PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";
import { Gift, Truck } from "lucide-react";

export function BundleShowcase({ pack }: { pack: PackConfig }) {
  const savings = pack.originalPrice - pack.price;

  return (
    <section className="mx-4 mt-4">
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
        <h2 className="text-center font-black text-xl text-gray-900 mb-3">
          {pack.packName}
        </h2>

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
                    <span className="absolute inset-x-0 bottom-0 bg-[#15803D] text-white text-[10px] font-extrabold py-1 flex items-center justify-center gap-1">
                      <Gift className="w-3 h-3 text-amber-300" />
                      🎁 هدية مجانية
                    </span>
                  )}
                </div>
                <p className="mt-1 text-center text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">
                  {book.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* High-contrast price badge */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-gray-400 line-through text-base">
            {pack.originalPrice} درهم
          </span>
          <span className="text-3xl font-black text-[#15803D]">
            {pack.price} درهم
          </span>
          <span className="bg-[#15803D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            وفر {savings} د.م
          </span>
        </div>
        <p className="text-center text-sm font-bold text-[#15803D] mt-1 flex items-center justify-center gap-1">
          <Truck className="w-4 h-4 text-emerald-600" />
          شامل التوصيل المجاني
        </p>
      </div>
    </section>
  );
}
