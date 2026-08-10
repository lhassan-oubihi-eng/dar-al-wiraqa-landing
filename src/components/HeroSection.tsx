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

      {/* 2. Product Image (3D fanned book stack) */}
      <div className="relative mx-auto w-full max-w-md h-64 mb-6">
        <div className="relative w-full h-full origin-bottom md:scale-125">
          {/* soft ground glow anchoring the fan */}
          <div
            className="absolute bottom-0 left-1/2 h-5 w-72 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 70%)",
            }}
          />
          {books.map((book, index) => {
            const isGift = index === giftBookIndex;
            const count = books.length;
            const fromCenter = index - (count - 1) / 2;
            const offsetX = fromCenter * 46;
            const rotation = fromCenter * 7;
            return (
              <div
                key={book.id}
                className="absolute bottom-5 left-1/2 -ml-[45px] rounded-lg overflow-hidden"
                style={{
                  width: "90px",
                  height: "135px",
                  transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
                  zIndex: count - Math.round(Math.abs(fromCenter)),
                  boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                  border: isGift
                    ? "1px solid #b8860b"
                    : "1px solid rgba(212,175,55,.45)",
                }}
              >
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-cover"
                />
                {isGift && (
                  <span
                    className="absolute -top-2 -right-2 z-10 rounded-full px-1.5 py-0.5 text-[8px] font-black"
                    style={{ background: "#d4af37", color: "#3e2723" }}
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
