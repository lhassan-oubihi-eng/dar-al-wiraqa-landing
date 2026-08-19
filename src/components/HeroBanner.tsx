"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowDown, ShoppingBag } from "lucide-react";

const PACK_SLIDES = [
  {
    bg: "linear-gradient(135deg,#F9FAFB 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "باقة علم النفس",
    headline: "الباقة الأكثر مبيعاً في المغرب — افهم عقلك ونفسيتك بـ 199 درهم فقط!",
    subtitle: "توصيل مجاني لجميع المدن + الدفع عند الاستلام",
    cta: "افتحم الباقة",
    href: "/checkout/psychology",
  },
  {
    bg: "linear-gradient(135deg,#FEF3C7 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "باقة المال والاستثمار",
    headline: "غير مستقبلك المالي — 6 كتب أساسية للنجاح والاستثمار بـ 199 درهم!",
    subtitle: "سرار الأغنياء وعادات النجاح المالي بين يديك",
    cta: "افتحم الباقة",
    href: "/checkout/finance",
  },
  {
    bg: "linear-gradient(135deg,#F3F4F6 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "باقة الكتب الدينية",
    headline: "زوّد معرفتك الدينية — كتب إسلامية قيمة + هدية مجانية وتوصيل مجاني!",
    subtitle: "تقويم الإيمان والتدبر اليومي — الدفع عند الاستلام",
    cta: "افتحم الباقة",
    href: "/checkout/religious",
  },
  {
    bg: "linear-gradient(135deg,#EDE9FE 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "باقة التطوير الذاتي",
    headline: "اكتسب مهارات العصر وطور شخصيتك — 6 كتب بـ 199 درهم!",
    subtitle: "استثمارك الحقيقي في النجاح الشخصي والمهني",
    cta: "افتحم الباقة",
    href: "/checkout/self-development",
  },
  {
    bg: "linear-gradient(135deg,#FFE4E6 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "باقة التمكين والأنوثة",
    headline: "اكتشري قوتك وحافظي على تقديرك الذاتي — باقة بـ 199 درهم!",
    subtitle: "أفضل المراجع لبناء الثقة والتأثير الإيجابي",
    cta: "افتحم الباقة",
    href: "/checkout/empowerment",
  },
  {
    bg: "linear-gradient(135deg,#E2E8F0 0%,#FFFFFF 100%)",
    badge: "عرض لفترة محدودة",
    title: "مكتبة دار الوِراقة",
    headline: "جميع باقات الكتب المتاحة — شحن مجاني و EVP عند الاستلام",
    subtitle: "تصفح جميع الباقات واختر ما يناسب اهتماماتك",
    cta: "تصفح الباقات",
    isScroll: true,
  },
];

export function HeroBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % PACK_SLIDES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const slide = PACK_SLIDES[idx];

  const handleCtaClick = (e: React.MouseEvent) => {
    if (slide.isScroll) {
      e.preventDefault();
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-[#E5E5E5] shadow-sm">
      <div
        className="relative flex flex-col items-center justify-center gap-3 px-6 py-10 text-center transition-all duration-700 min-h-[220px]"
        style={{ background: slide.bg }}
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-sm border border-amber-200 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-extrabold text-[#1F2937]">{slide.badge}</span>
        </div>

        <div className="mx-auto max-w-lg">
          <h2 className="text-base font-bold text-[#111827] uppercase tracking-wide mb-1">
            {slide.title}
          </h2>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-2">
            {slide.headline}
          </h1>
          <p className="text-sm sm:text-base font-medium text-[#4B5563]">
            {slide.subtitle}
          </p>
        </div>

        <Link
          href={slide.href || "#"}
          onClick={handleCtaClick}
          className="inline-flex items-center gap-2 rounded-full bg-[#111827] hover:bg-[#111827] px-8 py-4 text-base font-extrabold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <span>{slide.cta}</span>
          {slide.isScroll ? <ArrowDown size={18} /> : <ShoppingBag size={18} />}
        </Link>
      </div>

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 bg-white/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
        {PACK_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === idx ? "w-6 bg-[#111827]" : "w-1.5 bg-[#9CA3AF]"
            }`}
            aria-label={`الذهاب إلى الشريحة ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}