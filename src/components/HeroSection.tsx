import React from "react";
import { ShoppingCart } from "lucide-react";
import { Book } from "@/data/offers";
import { BookCarousel } from "@/components/BookCarousel";

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
    <section className="px-4 pt-6 pb-8" id="hero">
      {/* Star rating + reviews */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center gap-1 rounded-full bg-[#241D17] px-3 py-1.5">
          <span className="text-sm text-[#D4AF37]">★★★★★</span>
          <span className="text-[10px] font-bold text-[#F3E6C4]">
            4.9 (87 طلب)
          </span>
        </div>
      </div>

      {/* 1. Headline / Product Title */}
      <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#F3E6C4] leading-[1.8] mb-5 text-center">
        {headline}
      </h1>

      {/* 2. Product Image Carousel (6-book bundle) */}
      <div className="mb-6">
        <BookCarousel books={books} giftBookIndex={giftBookIndex} />
      </div>

      {/* 3. Offer Summary Line */}
      <p className="text-sm text-[#F3E6C4]/85 leading-relaxed text-center max-w-xs mx-auto mb-6">
        {subheadline}
      </p>

      {/* 4. Price Section (old price, current price, savings badge) */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
          <del className="text-sm text-[#A68B69] line-through">
            {originalPrice} درهم
          </del>
          <span className="text-3xl font-extrabold text-[#F3E6C4] leading-none">
            {price} درهم
          </span>
        </div>
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold"
          style={{ background: "#16a34a", color: "#fff" }}
        >
          {savingsText}
        </div>
      </div>

      {/* Trust badges */}
      <div className="mb-5 flex justify-center gap-4 text-[11px] font-bold">
        <span className="flex items-center gap-1 text-[#16a34a]">
          💵 الدفع عند الاستلام
        </span>
        <span className="flex items-center gap-1 text-[#16a34a]">
          🚚 توصيل مجاني
        </span>
      </div>

      {/* 5. CTA Button */}
      <button
        onClick={onCtaClick}
        className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-lg bg-[#16a34a] text-white transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
        type="button"
      >
        <span>{ctaText}</span>
        <ShoppingCart size={18} className="text-white" />
      </button>
    </section>
  );
}
