"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Book } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

interface BookCarouselProps {
  books: Book[];
  giftBookIndex: number;
  onIndexChange?: (index: number) => void;
}

/**
 * Full-bleed book carousel — swipe/arrow/drag to navigate through the
 * 6-book bundle (5 regular + 1 gift). Shows one large cover at a time
 * with title + gift badge beneath.
 */
export function BookCarousel({
  books,
  giftBookIndex,
  onIndexChange,
}: BookCarouselProps) {
  const [idx, setIdx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const goNext = useCallback(() => {
    setIdx((i) => (i + 1) % books.length);
    onIndexChange?.(((idx + 1) % books.length));
  }, [idx, books.length, onIndexChange]);

  const goPrev = useCallback(() => {
    setIdx((i) => (i - 1 + books.length) % books.length);
    onIndexChange?.((idx - 1 + books.length) % books.length);
  }, [idx, books.length, onIndexChange]);

  // Keyboard arrow support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === "INPUT") return;
      if (e.key === "ArrowLeft") goNext();
      if (e.key === "ArrowRight") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  // Touch / mouse drag support
  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    setDragging(false);
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const delta = clientX - startX;
    const threshold = 50;
    if (Math.abs(delta) > threshold) {
      if (delta < 0) goNext();
      else goPrev();
    }
  };

  const current = books[idx];
  const isGift = idx === giftBookIndex;

  return (
    <div className="relative">
      {/* Main cover display */}
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-[#D1D5DB] bg-white shadow-lg"
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <BookCover
          title={current.title}
          src={current.coverUrl}
          className="h-full w-full object-contain"
        />

        {isGift && (
          <span className="absolute top-3 right-3 z-10 rounded-full bg-[#15803D] px-2.5 py-1 text-[10px] font-extrabold text-white">
            🎁 هدية
          </span>
        )}
      </div>

      {/* Book title */}
      <p className="mt-2 text-center text-sm font-bold text-[#1F2937]">
        {current.title}
      </p>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute top-1/2 -translate-y-1/2 -left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#15803D] text-white shadow-md hover:scale-105"
        aria-label="الكتاب السابق"
      >
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute top-1/2 -translate-y-1/2 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#15803D] text-white shadow-md hover:scale-105"
        aria-label="الكتاب التالي"
      >
        <ChevronRight size={16} />
      </button>

      {/* Indicator dots */}
      <div className="mt-3 flex justify-center gap-1">
        {books.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setIdx(i);
              onIndexChange?.(i);
            }}
            className={`h-1.5 w-1.5 rounded-full transition-all ${
              i === idx
                ? "w-4 bg-[#15803D]"
                : "bg-[#D1D5DB] hover:bg-[#9CA3AF]/50"
            }`}
            aria-label={`اذهب إلى الكتاب ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="mt-3 flex justify-center gap-1 overflow-x-auto pb-1">
        {books.map((book, i) => {
          const isThumbGift = i === giftBookIndex;
          return (
            <button
              key={book.id}
              onClick={() => {
                setIdx(i);
                onIndexChange?.(i);
              }}
              className={`relative h-10 w-7 flex-shrink-0 rounded border-2 transition-all ${
                i === idx
                  ? "border-[#15803D]"
                  : "border-[#D1D5DB] hover:border-[#9CA3AF]/50"
              }`}
            >
              <BookCover
                title={book.title}
                src={book.coverUrl}
                className="h-full w-full object-cover"
              />
              {isThumbGift && (
                <span className="absolute top-0 right-0 rounded-bl rounded-tr-[2px] bg-[#15803D] px-[2px] text-[6px]">
                  🎁
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
