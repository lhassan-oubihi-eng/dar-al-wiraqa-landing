"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const SLIDES = [
  {
    bg: "linear-gradient(135deg,#F0FDF4 0%,#FFFFFF 100%)",
    title: "باقات 6 كتب بـ 199 درهم فقط",
    subtitle: "شاملة التوصيل — الدفع عند الاستلام لجميع مدن المغرب",
    cta: "تصفح باقات الكتب",
    href: "/",
    textColor: "text-[#1F2937]",
  },
  {
    bg: "linear-gradient(135deg,#FEF3C7 0%,#FFFFFF 100%)",
    title: "استثمارك في المعرفة = استثمار في مستقبلك",
    subtitle: "5 كتب أساسية + 1 هدية مجانية — جودة موثوقة، أسعار لا تقاوم",
    cta: "اكتشف الباقات",
    href: "/",
    textColor: "text-[#1F2937]",
  },
  {
    bg: "linear-gradient(135deg,#D1FAE5 0%,#FFFFFF 100%)",
    title: "معلمة موثوقة في المغرب — دار الوِراقة",
    subtitle: "تغليف مميز • دفع عند الاستلام • توصيل مجاني لجميع المدن",
    cta: "ابدأ الآن",
    href: "/psychology",
    textColor: "text-[#1F2937]",
  },
];

/**
 * Full-width hero banner with auto-advancing slide carousel.
 * Each slide showcases a key value proposition with a clear CTA.
 */
export function HeroBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[idx];

  return (
    <section className="relative overflow-hidden">
      <div
        className="relative flex flex-col items-center justify-center gap-3 px-6 py-12 text-center transition-all duration-500"
        style={{ background: slide.bg }}
      >
        <div className="mx-auto max-w-md">
          <h1 className={`text-2xl font-extrabold leading-tight sm:text-3xl ${slide.textColor}`}>
            {slide.title}
          </h1>
          <p className="mt-2 text-sm text-[#4B5563] sm:text-base">
            {slide.subtitle}
          </p>
        </div>

        <Link
          href={slide.href}
          className="inline-flex items-center gap-2 rounded-full bg-[#15803D] px-6 py-3 text-sm font-extrabold text-white transition-transform hover:scale-105"
        >
          <span>{slide.cta}</span>
          <ShoppingCart size={18} />
        </Link>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 w-6 rounded-full transition-all ${
              i === idx ? "w-8 bg-[#15803D]" : "bg-[#15803D]/30"
            }`}
            aria-label={`الذهاب إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
