import React from "react";
import { ShoppingCart } from "lucide-react";
import { Book } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  books: Book[];
  giftBookIndex: number;
  originalPrice: number;
  price: number;
  feminine?: boolean;
  onCtaClick: () => void;
}

export function HeroSection({
  headline,
  subheadline,
  books,
  giftBookIndex,
  originalPrice,
  price,
  feminine = false,
  onCtaClick,
}: HeroSectionProps) {
  const savings = originalPrice - price;
  const ctaText = feminine ? "اطلبي الباقة الآن" : "اطلب الباقة الآن";
  const savingsText = feminine
    ? `وفّري ${savings} درهم!`
    : `وفر ${savings} درهم!`;

  return (
    <section className="px-4 pt-8 pb-10" id="hero">
      {/* 1. Headline */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#e8e0d4] leading-[1.8] mb-6 text-center">
        {headline}
      </h1>

      {/* 2. Product Image (6-book bundle — clear grid, no overlap) */}
      <div className="mx-auto mb-6 grid w-full max-w-md grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {books.map((book, index) => {
          const isGift = index === giftBookIndex;
          return (
            <div key={book.id} className="flex flex-col items-center">
              <div
                className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg"
                style={{
                  background: "linear-gradient(160deg,#3a2e22,#241d17)",
                  border: isGift
                    ? "1px solid #b8860b"
                    : "1px solid rgba(212,175,55,.35)",
                }}
              >
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-contain"
                />
                {isGift && (
                  <span
                    className="absolute top-1 right-1 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-black"
                    style={{ background: "#d4af37", color: "#3e2723" }}
                  >
                    هدية
                  </span>
                )}
              </div>
              <span className="mt-1.5 text-center text-[10px] font-bold leading-tight text-[#cdbba9]">
                {book.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Offer Summary Line */}
      <p className="text-sm text-[#cdbba9]/85 leading-relaxed text-center max-w-xs mx-auto mb-6">
        {subheadline}
      </p>

      {/* 4. Price Section (old price, current price, savings badge) */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
          <del className="text-sm text-[#cdbba9]/50 line-through">
            {originalPrice} درهم
          </del>
          <span className="text-3xl font-extrabold text-[#e8e0d4] leading-none">
            {price} درهم
          </span>
        </div>
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ background: "#d4af37", color: "#3e2723" }}
        >
          {savingsText}
        </div>
      </div>

      {/* 5. CTA Button */}
      <button
        onClick={onCtaClick}
        className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-lg bg-[#d4af37] text-[#3e2723] transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
        type="button"
      >
        <span>{ctaText}</span>
        <ShoppingCart size={18} className="text-[#3e2723]" />
      </button>
    </section>
  );
}
