"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { PackConfig, Book } from "@/data/offers";
import { BookCover } from "@/components/BookCover";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PackSliderProps {
  pack: PackConfig;
  onBuy: (pack: PackConfig) => void;
  ctaText?: string;
}

export function PackSlider({ pack, onBuy, ctaText = "شراء الآن" }: PackSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const books = pack.books;
  const savings = pack.originalPrice - pack.price;

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, books.length - 1)));
  }, [books.length]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || !isDragging) return;
    const touchCurrent = e.touches[0].clientX;
    const diff = touchStart - touchCurrent;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      setTouchStart(null);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStart === null || !isDragging) return;
    const diff = touchStart - e.clientX;
    if (Math.abs(diff) > 80) {
      if (diff > 0) nextSlide();
      else prevSlide();
      setTouchStart(null);
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setTouchStart(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setTouchStart(null);
    setIsDragging(false);
  };

  const currentBook = books[currentIndex];
  const isGift = books.indexOf(currentBook) === books.length - 1;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Marketing Hook Badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D]">
        <span className="text-xs font-extrabold text-[#92400E]">عرض حصري</span>
        <span className="text-[11px] font-medium text-[#78350F]">
          {pack.price} درهم فقط لـ 6 كتب + توصيل مجاني
        </span>
      </div>

      {/* Book Carousel */}
      <div className="relative mb-6">
        <div
          ref={sliderRef}
          className="flex overflow-hidden snap-x snap-mandatory pb-4 -mx-4 px-4"
          role="region"
          aria-label={`كتب باقة ${pack.packName}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {books.map((book, i) => {
            const isGiftBook = i === books.length - 1;
            return (
              <div
                key={book.id}
                className="flex-none w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 snap-center px-4"
              >
                <div className="flex flex-col items-center group">
                  <div className="relative aspect-[5/7] w-full max-w-xs overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <BookCover
                      title={book.title}
                      src={book.coverUrl}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isGiftBook && (
                      <span className="absolute inset-x-0 top-0 z-10 py-1.5 text-center text-[10px] font-extrabold text-white"
                        style={{ background: "linear-gradient(90deg,#15803D,#22c55e)" }}
                      >
                        ��� هدية مجانية
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-center text-sm font-semibold text-[#1F2937] line-clamp-2 px-1">
                    {book.title}
                  </p>
                  {isGiftBook && (
                    <p className="mt-1 text-center text-xs font-medium text-[#15803D]">
                      مُضمن مجاناً مع الباقة
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {(books.length > 1) && (
          <>
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E5E5] text-[#6B7280] shadow-lg transition-all duration-200 hover:bg-white hover:text-[#15803D] disabled:opacity-0 disabled:pointer-events disabled:-translate-x-2"
              aria-label="الكتاب السابق"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex === books.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-[#E5E5E5] text-[#6B7280] shadow-lg transition-all duration-200 hover:bg-white hover:text-[#15803D] disabled:opacity-0 disabled:pointer-events disabled:translate-x-2"
              aria-label="الكتاب التالي"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {books.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "w-8 bg-[#15803D]"
                  : "w-2 bg-[#D1D5DB] hover:bg-[#9CA3AF]"
              }`}
              aria-label={`الذهاب للكتاب ${i + 1}`}
              aria-current={i === currentIndex ? "true" : "false"}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <p className="mt-2 text-center text-xs text-[#9CA3AF]">
          كتاب {currentIndex + 1} من {books.length}
        </p>
      </div>

      {/* Pack Info */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-extrabold text-[#1F2937]">{pack.packName}</h3>
        <p className="mt-1 text-sm text-[#6B7280]">{pack.desc}</p>
      </div>

      {/* Benefits List */}
      <div className="mb-5 space-y-2 border-t border-[#F3F4F6] pt-4">
        {[
          "��� 5 كتب أساسية مختارة بعناية",
          "���� كتاب هدية مجاني (القيمة: 49 درهم)",
          "���� توصيل مجاني لجميع مدن المغرب",
          "���� دفع عند الاستلام — لا دفع مسبق",
          "���� ضمان استرجاع كامل خلال 30 يوم",
        ].map((benefit, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-[#4B5563]">
            <span className="flex-shrink-0 mt-0.5">{benefit.slice(0, 2)}</span>
            <span>{benefit.slice(2)}</span>
          </div>
        ))}
      </div>

      {/* Price Block */}
      <div className="mb-4 flex items-center justify-center gap-3">
        <del className="text-lg text-[#9CA3AF] line-through">{pack.originalPrice} درهم</del>
        <span className="text-3xl font-extrabold text-[#15803D]">{pack.price} درهم</span>
        <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(90deg,#15803D,#22c55e)" }}>
          وفر {savings} درهم
        </span>
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onBuy(pack)}
        className="w-full py-4 rounded-xl font-extrabold text-lg text-white transition-all duration-200 shadow-lg hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#15803D 0%,#16a34a 100%)" }}
        type="button"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {ctaText}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
        <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
}