"use client";

import React, { useEffect, useRef } from "react";
import { PackConfig } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";
import { Gift, Truck, CreditCard, Check, Headphones, ShieldCheck } from "lucide-react";

interface PackLandingProps {
  pack: PackConfig;
}

export function firePixel(name: string, params: Record<string, unknown>) {
  try {
    const w = window as unknown as {
      fbq?: (type: string, eventName: string, p?: Record<string, unknown>) => void;
    };
    w.fbq?.("track", name, params);
  } catch {
    /* ad tracking is non-blocking */
  }
}

export function PackLanding({ pack }: PackLandingProps) {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    firePixel("ViewContent", {
      content_name: pack.packName,
      content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
      content_type: "product_group",
      currency: "MAD",
      value: pack.price,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToForm = () => {
    firePixel("AddToCart", {
      content_name: pack.packName,
      content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
      content_type: "product_group",
      currency: "MAD",
      value: pack.price,
    });
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      document.getElementById("nameInput")?.focus();
    }, 600);
  };

  return (
    <>
      {/* 1. Sticky top banner */}
      <StickyBanner text={pack.tagline} />

      {/* Main content — Direct Response single-column flow */}
      <main className="mx-auto max-w-[420px] pb-6 bg-[#F9F9F9] min-h-screen">

        {/* Top Trust Bar */}
        <div className="bg-white border-b border-gray-200 py-3 px-3">
          <div className="flex items-center justify-around text-sm font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <Headphones className="w-5 h-5 text-rose-500" />
              <span>خدمة ما بعد البيع</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-5 h-5 text-rose-500" />
              <span>التوصيل مجاني</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              <span>مع الضمان</span>
            </div>
          </div>
        </div>

        {/* ===== 2. VISUAL & HOOK ===== */}
        <HeroSection
          books={pack.books}
          price={pack.price}
          originalPrice={pack.originalPrice}
          packName={pack.packName}
          feminine={pack.feminine}
        />

        {/* ===== 3. MINIMALIST VALUE PROPOSITION ===== */}
        <section className="mx-4 my-6">
          <h2 className="text-center text-xl md:text-2xl font-black text-gray-900 mb-4">
            ماذا تحصل؟
          </h2>
          <ul className="space-y-2 text-center">
            {pack.books.map((book, i) => (
              <li
                key={book.id}
                className="flex items-center justify-center gap-2 text-base font-medium text-gray-900"
              >
                {i === pack.giftBookIndex ? (
                  <>
                    <Gift className="w-4 h-4 text-rose-500 inline-block ml-1.5 align-sub" />
                    <span className="text-[#15803D] font-bold">{book.title} (هدية مجانية)</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{book.title}</span>
                  </>
                )}
              </li>
            ))}
            <li className="flex items-center justify-center gap-2 text-base font-medium text-gray-900">
              <Truck className="w-5 h-5 text-rose-500 inline-block ml-1.5 align-sub" />
              <span>توصيل مجاني لجميع مدن المغرب</span>
            </li>
            <li className="flex items-center justify-center gap-2 text-base font-medium text-gray-900">
              <CreditCard className="w-5 h-5 text-rose-500 inline-block ml-1.5 align-sub" />
              <span>دفع نقداً عند الاستلام — لا تدفع شيئاً الآن</span>
            </li>
          </ul>
        </section>

        {/* ===== 4. EMBEDDED DIRECT CHECKOUT FORM ===== */}
        <div ref={formRef} className="mx-4">
          <CheckoutSection pack={pack} onCtaClick={scrollToForm} />
        </div>

        {/* Mobile Sticky Footer */}
        <MobileStickyFooter
          price={pack.price}
          feminine={pack.feminine}
          onCtaClick={scrollToForm}
        />

        {/* Site footer */}
        <footer className="border-t border-[#E5E5E5] py-4 text-center">
          <p className="text-sm text-[#6B7280]">
            {pack.footer.copyright}
          </p>
        </footer>
      </main>
    </>
  );
}
