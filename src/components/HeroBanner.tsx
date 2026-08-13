"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const SLIDES = [
  {
    bg: "linear-gradient(135deg,#16a34a 0%,#22c55e 100%)",
    title: "باقات 6 كتب بـ 199 درهم فقط",
    subtitle: "شاملة التوصيل — الدفع عند الاستلام لجميع مدن المغرب",
    cta: "تصفح باقات الكتب",
    href: "/",
  },
  {
    bg: "linear-gradient(135deg,#D4AF37 0%,#16a34a 100%)",
    title: "استثمارك في المعرفة = استثمار في مستقبلك",
    subtitle: "5 كتب أساسية + 1 هدية — جودة موثوقة، أسعار لا تقاوم",
    cta: "اكتشف الباقات",
    href: "/",
  },
  {
    bg: "linear-gradient(135deg,#22c55e 0%,#16a34a 100%)",
    title: "أول 50 طلبية تحصل معها هدية إضافية!",
    subtitle: "كتاب 'الليالي البيضاء' مجاناً — عرض محدود حتى نفاد الطلبات",
    cta: "احجز الآن",
    href: "/psychology",
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
        className="relative flex flex-col items-center justify-center gap-3 px-6 py-14 text-center text-white transition-all duration-500"
        style={{ background: slide.bg }}
      >
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
            {slide.title}
          </h1>
          <p className="mt-2 text-sm opacity-90 sm:text-base">
            {slide.subtitle}
          </p>
        </div>

        <Link
          href={slide.href}
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold text-[#16a34a] transition-transform hover:scale-105"
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
              i === idx ? "w-8 bg-white" : "bg-white/40"
            }`}
            aria-label={`الذهاب إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>

      {/* Book covers strip — always show a preview of the 6-book bundle */}
      <div className="absolute inset-0 -z-10 hidden opacity-10 sm:grid">
        <div className="absolute bottom-4 left-4 grid grid-cols-6 gap-0.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-[2/3] w-8 rounded border border-white/30"
              style={{
                background: `linear-gradient(135deg,#FFFFFF,#F3F4F6)`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
