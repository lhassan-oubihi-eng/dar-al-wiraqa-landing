"use client";

import React from "react";
import { ShoppingCart } from "lucide-react";
import { PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

/**
 * Reusable bundle card — same markup on homepage, category pages, and landing
 * pages. The caller provides `onAdd` (which should call CartProvider's
 * `addPack`). The component only shows rating if realReviewCount > 0.
 */
export function BundleCard({
  pack,
  ctaText = "أضف إلى السلة",
  onAdd,
  realRating,
  realReviewCount,
}: {
  pack: PackConfig;
  ctaText?: string;
  onAdd?: (pack: PackConfig) => void;
  /** Average rating (e.g., 4.7) — only shown if realReviewCount > 0 */
  realRating?: number;
  /** Number of approved reviews — if 0 or undefined, no rating is shown */
  realReviewCount?: number;
}) {
  // Compute savings from the store-level original vs current price
  const savings = pack.originalPrice - pack.price;
  const hasRealReviews = (realReviewCount ?? 0) > 0;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Mini cover strip (6-book bundle) */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {pack.books.map((book, i) => {
          const isGift = i === pack.books.length - 1;
          return (
            <div key={book.id} className="flex flex-col">
              <div className="relative aspect-[5/7] overflow-hidden rounded-md border border-[#D1D5DB]">
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-cover transition-transform duration-200"
                />
                {isGift && (
                  <span
                    className="absolute inset-x-0 top-0 z-10 py-0.5 text-center text-[8px] font-extrabold text-white"
                    style={{ background: "linear-gradient(90deg,#15803D,#22c55e)" }}
                  >
                    هدية
                  </span>
                )}
              </div>
              <span className="mt-1 line-clamp-1 text-center text-[8px] font-bold text-[#4B5563]">
                {book.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bundle title + real rating (only if we have real reviews) */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-[#1F2937] line-clamp-2">
          {pack.packName}
        </h3>
        {hasRealReviews && realRating && (
          <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
            <span className="text-[#D4AF37]">★★★★★</span>
            <span className="text-[9px]">
              {realRating.toFixed(1)} ({realReviewCount} طلب)
            </span>
          </p>
        )}
      </div>

      {/* Value prop — 1-line subtitle */}
      <p className="text-sm text-[#6B7280] mb-3 line-clamp-1">
        {pack.desc.replace(" + كتاب هدية 🎁", "").trim()}
      </p>

      {/* Price block */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <del className="text-sm text-[#9CA3AF] line-through">
            {pack.originalPrice} درهم
          </del>
          <span className="text-2xl font-bold text-[#15803D]">
            {pack.price} درهم
          </span>
        </div>
        <span className="text-sm text-[#15803D] font-medium">
         وفرت {savings} درهم
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={() => onAdd?.(pack)}
        className="w-full py-2.5 px-4 rounded-full font-semibold text-lg text-white bg-[#15803D] hover:bg-[#16a34a] transition-colors"
        type="button"
      >
        {ctaText}
        <ShoppingCart size={14} className="ml-2" />
      </button>
    </div>
  );
}