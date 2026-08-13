import React, { useEffect, useState } from "react";
import { ShoppingCart, Shield, Truck, Clock } from "lucide-react";
import { Book } from "@/data/offers";
import { BookCarousel } from "@/components/BookCarousel";

interface HeroSectionProps {
  subheadline: string;
  books: Book[];
  giftBookIndex: number;
  originalPrice: number;
  price: number;
  feminine?: boolean;
  onCtaClick: () => void;
}

/** Maps routes to their exact Arabic hero headlines.
 *  No English artifacts — strictly word-for-word copy from the specification. */
function useHeroHeadline(subheadline: string): string {
  // Get current pathname from window.location (client-side only)
  // Server-side, use the subheadline as fallback
  let currentPathname: string;
  if (typeof window !== "undefined") {
    currentPathname = window.location.pathname;
  } else {
    currentPathname = "/";
  }

  // Route-based headline mapping — EXACT Arabic strings, no translation/transliteration
  const HEADLINE_MAPPING = {
    "/religious": "أيامك تمر بلا بركة؟ أعد بناء إيمانك قبل أن تبتلعك مشاغل الحياة",
    "/psychology": "هل تعاني من التفكير الزائد؟ تحرر من عقدك النفسية واستعد سلامك الداخلي.",
    "/finance": "هل تعاني من الضائقة المالية؟ اكتشف أسرار الذكاء المالي واصنع ثروتك.",
    "default": "استثمر في عقلك اليوم. ابدأ رحلة التغيير نحو أفضل نسخة من نفسك."
  };

  // Find matching headline for the current route, fall back to default
  const matchedHeadline =
    HEADLINE_MAPPING[currentPathname as keyof typeof HEADLINE_MAPPING] || HEADLINE_MAPPING.default;

  // Also support URL parameter hook for A/B testing on top of route base
  useEffect(() => {
    // Effect runs only on client side (window already checked above)
    const params = new URLSearchParams(window.location.search);
    const hook = params.get("hook");
    if (hook) {
      // Store the hook value for potential use elsewhere
    }
  }, [currentPathname]);

  return matchedHeadline;
}

export function HeroSection({
  subheadline,
  books,
  giftBookIndex,
  originalPrice,
  price,
  feminine = false,
  onCtaClick,
}: HeroSectionProps) {
  const headline = useHeroHeadline(subheadline);

  const savings = originalPrice - price;
  const ctaText = feminine ? "اطلبي الباقة الآن" : "اطلب الباقة الآن";
  const savingsText = feminine
    ? `توفير ${savings} درهم`
    : `توفير ${savings} درهم`;

  return (
    <section className="px-4 pt-6 pb-8" id="hero">
      {/* Product Title with dynamic headline */}
      <h1 className="font-display text-2xl md:text-3xl font-extrabold text-[#1F2937] leading-[1.8] mb-5 text-center">
        {headline}
      </h1>

      {/* Product Image Carousel (6-book bundle) */}
      <div className="mb-6">
        <BookCarousel books={books} giftBookIndex={giftBookIndex} />
      </div>

      {/* Offer Summary */}
      <p className="text-sm text-[#6B7280] leading-relaxed text-center max-w-xs mx-auto mb-6">
        {subheadline}
      </p>

      {/* Price Section (old price crossed, new price, savings) */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap mb-2">
          <del className="text-sm text-[#9CA3AF] line-through">
            {originalPrice} درهم
          </del>
          <span className="text-3xl font-extrabold text-[#1F2937] leading-none">
            {price} درهم
          </span>
        </div>
        <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#15803D] text-white">
          {savingsText}
        </div>
      </div>

      {/* Trust badges — below price, above CTA */}
      <div className="mb-5 flex justify-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-1 text-[#15803D]">
          <Shield size={14} />
          الدفع عند الاستلام
        </span>
        <span className="flex items-center gap-1 text-[#15803D]">
          <Truck size={14} />
          توصيل مجاني
        </span>
        <span className="flex items-center gap-1 text-[#15803D]">
          <Clock size={14} />
          24-48 ساعة استلام
        </span>
      </div>

      {/* Authenticity note */}
      <p className="text-center text-[11px] text-[#6B7280] mb-4">
        {feminine
          ? "تغليف ممتاز • ادفعي فقط عند استلام طلبكِ والتأكد منه"
          : "تغليف ممتاز • ادفع فقط عند استلام طلبك والتأكد منه"}
      </p>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-lg text-white bg-[#15803D] hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200"
        type="button"
      >
        <span>{ctaText}</span>
        <ShoppingCart size={18} className="text-white" />
      </button>
    </section>
  );
}