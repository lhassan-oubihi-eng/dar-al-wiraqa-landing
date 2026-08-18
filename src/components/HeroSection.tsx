"use client";

import React, { useState, useEffect } from "react";
import { BookCover } from "@/components/BookCover";
import { Book } from "@/data/offers";
import { ChevronLeft, ChevronRight, Gift, Truck } from "lucide-react";

interface HeroSectionProps {
  books: Book[];
  price: number;
  originalPrice: number;
  packName: string;
  feminine?: boolean;
}

/**
  * Compact Visual & Hook — Super efficient height, fast scroll-to-form.
  */
export function HeroSection({
  books,
  price,
  originalPrice,
  packName,
  feminine = false,
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex((index + books.length) % books.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, books.length]);

  const savings = originalPrice - price;

  return (
    <section className="px-3 pt-3 pb-3 text-center bg-white border-b border-[#E5E5E5] shadow-xs">
      <h1 className="font-display text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">
        {packName}
      </h1>

      {/* Compact Book Cover Slider */}
      <div className="relative mx-auto mb-2 w-full max-w-[180px]">
        <div className="relative aspect-[5/7] w-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] shadow-md">
          <BookCover
            title={books[currentIndex].title}
            src={books[currentIndex].coverUrl}
            className="h-full w-full object-cover"
          />
          {currentIndex === books.length - 1 && (
            <span className="absolute inset-x-0 top-0 z-10 py-1 text-center text-[10px] font-extrabold text-white bg-[#15803D]">
              <Gift className="w-4 h-4 text-emerald-600 inline-block ml-1.5 align-sub" /> هدية مجانية
            </span>
          )}

          {books.length > 1 && (
            <>
              <button
                onClick={() => goToSlide(currentIndex - 1)}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1F2937] shadow hover:bg-white hover:text-[#15803D]"
                aria-label="السابق"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => goToSlide(currentIndex + 1)}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#1F2937] shadow hover:bg-white hover:text-[#15803D]"
                aria-label="التالي"
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>

        <p className="mt-1 text-xs font-bold text-[#1F2937] line-clamp-1">
          {books[currentIndex].title}
        </p>

        {/* Dots */}
        <div className="mt-1 flex items-center justify-center gap-1">
          {books.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1 rounded-full transition-all ${
                i === currentIndex ? "w-4 bg-[#15803D]" : "w-1 bg-[#D1D5DB]"
              }`}
              aria-label={`الكتاب ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Price tag */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <del className="text-base text-[#9CA3AF] line-through">{originalPrice} درهم</del>
        <span className="text-3xl font-black text-[#15803D]">{price} درهم</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-[#15803D]">
          وفر {savings} د.م
        </span>
      </div>
      
      <p className="text-sm font-bold text-[#15803D]">
        {feminine ? (
          <>
            <Truck className="w-4 h-4 text-emerald-600 inline-block ml-1.5 align-sub" /> توصيل مجاني + الدفع عند الاستلام (لا تدفلي شيئاً الآن)
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 text-emerald-600 inline-block ml-1.5 align-sub" /> توصيل مجاني + الدفع عند الاستلام (لا تدفع شيئاً الآن)
          </>
        )}
      </p>
    </section>
  );
}
