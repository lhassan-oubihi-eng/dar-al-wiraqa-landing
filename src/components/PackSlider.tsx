"use client";

import { useState, useCallback, useEffect } from "react";
import { PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";
import { ChevronLeft, ChevronRight, Zap, Gift } from "lucide-react";
import Link from "next/link";

interface PackSliderProps {
  pack: PackConfig;
  ctaText?: string;
}

export function PackSlider({ pack, ctaText = "شراء الآن" }: PackSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const books = pack.books;
  const savings = pack.originalPrice - pack.price;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex((index + books.length) % books.length);
  }, [books.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-advance carousel every 3 seconds unless paused
  useEffect(() => {
    if (isPaused || books.length <= 1) return;
    const interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, books.length, goToSlide]);

  return (
    <div 
      className="bg-white border border-[#E5E5E5] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Marketing Hook Badge */}
      <div className="mb-3 inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D] text-center w-full">
        <span className="text-xs font-extrabold text-[#92400E]"><Zap className="w-4 h-4 text-amber-500 fill-amber-500 inline-block ml-1.5 align-sub" /> عرض حصري</span>
        <span className="text-[11px] font-bold text-[#78350F]">
          {pack.price} درهم فقط لـ 6 كتب + توصيل مجاني
        </span>
      </div>

      {/* Book Carousel Slider */}
      <div className="relative mb-4">
        <div className="relative aspect-[5/7] w-full max-w-[220px] mx-auto overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] shadow-md group">
          <BookCover
            title={books[currentIndex].title}
            src={books[currentIndex].coverUrl}
            className="h-full w-full object-cover transition-all duration-500 scale-100"
          />
          {currentIndex === books.length - 1 && (
            <span className="absolute inset-x-0 top-0 z-10 py-1.5 text-center text-[10px] font-extrabold text-white bg-[#15803D] shadow-sm">
              <Gift className="w-4 h-4 text-rose-500 inline-block ml-1.5 align-sub" /> هدية مجانية
            </span>
          )}

          {/* Navigation Arrows */}
          {books.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1F2937] shadow-md hover:bg-white hover:text-[#15803D] transition-all"
                aria-label="الكتاب السابق"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1F2937] shadow-md hover:bg-white hover:text-[#15803D] transition-all"
                aria-label="الكتاب التالي"
              >
                <ChevronLeft size={18} />
              </button>
            </>
          )}
        </div>

        {/* Book Title */}
        <p className="mt-3 text-center text-sm font-bold text-[#1F2937] line-clamp-1 px-2">
          {books[currentIndex].title}
        </p>
        <p className="text-center text-xs text-[#6B7280]">
          كتاب {currentIndex + 1} من {books.length} {currentIndex === books.length - 1 ? "(هدية مجانية)" : ""}
        </p>

        {/* Slide Dots */}
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {books.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); goToSlide(i); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-[#15803D]" : "w-1.5 bg-[#D1D5DB]"
              }`}
              aria-label={`الانتقال للكتاب ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Pack Info */}
      <div className="mb-3 text-center border-t border-[#F3F4F6] pt-3">
        <h3 className="text-xl md:text-2xl font-black text-gray-900">{pack.packName}</h3>
        <p className="mt-0.5 text-sm text-[#6B7280] line-clamp-2">{pack.desc}</p>
      </div>

      {/* Price & CTA Button */}
      <div className="mt-auto pt-2">
        <div className="mb-3 flex items-center justify-center gap-2">
          <del className="text-sm text-[#9CA3AF] line-through">{pack.originalPrice} د.م</del>
          <span className="text-2xl md:text-3xl font-black text-[#15803D]">{pack.price} درهم</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-[#15803D]">
            وفر {savings}
          </span>
        </div>

        <Link
          href={`/checkout/${pack.slug}`}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-extrabold text-lg md:text-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <span>{ctaText}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
