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
  onCtaClick: () => void;
}

export function HeroSection({
  headline,
  subheadline,
  books,
  giftBookIndex,
  originalPrice,
  price,
  onCtaClick,
}: HeroSectionProps) {
  const savings = originalPrice - price;

  return (
    <section className="px-4 pt-8 pb-10" id="hero">
      {/* 1. Headline */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#e8e0d4] leading-[1.8] mb-6 text-center">
        {headline}
      </h1>

      {/* 2. Product Image (3D stacked book mockup) */}
      <div className="relative mx-auto w-52 h-60 mb-6 flex items-end justify-center">
        <div className="relative w-full h-full">
          {books.map((book, index) => {
            const isGift = index === giftBookIndex;
            const offset = (books.length - 1 - index) * 5;
            const rotation = (index - 2) * 3;
            return (
              <div
                key={book.id}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg overflow-hidden"
                style={{
                  width: "60px",
                  height: "90px",
                  transform: `rotate(${rotation}deg) translateX(${offset}px)`,
                  zIndex: books.length - index,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.22)",
                  border: isGift ? "1px solid #b8860b" : "1px solid rgba(212,175,55,.4)",
                }}
              >
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-cover"
                />
                {isGift && (
                  <span
                    className="absolute -top-1 -right-1 text-[6px] font-bold uppercase"
                    style={{ color: "#d4af37" }}
                  >
                    هدية
                  </span>
                )}
              </div>
            );
          })}
        </div>
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
          وفر {savings} درهم!
        </div>
      </div>

      {/* 5. CTA Button */}
      <button
        onClick={onCtaClick}
        className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-lg bg-[#d4af37] text-[#3e2723] transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
        type="button"
      >
        <span>اطلب الباقة الآن</span>
        <ShoppingCart size={18} className="text-[#3e2723]" />
      </button>
    </section>
  );
}
