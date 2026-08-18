"use client";

import { useEffect } from "react";
import { PackConfig } from "@/data/offers";
import { firePixel } from "@/components/PackLanding";
import { HeroSection } from "@/components/HeroSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { Headphones, Truck, ShieldCheck, Check } from "lucide-react";

export function CheckoutPageClient({ pack }: { pack: PackConfig }) {
  useEffect(() => {
    firePixel("ViewContent", {
      content_name: pack.packName,
      content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
      content_type: "product_group",
      currency: "MAD",
      value: pack.price,
    });
  }, [pack]);

  return (
    <main className="mx-auto max-w-[420px] pb-6 bg-[#F9F9F9] min-h-screen">
      {/* Top Minimal Trust Bar */}
      <div className="bg-white border-b border-gray-200 py-3 px-3">
        <div className="flex items-center justify-around text-sm font-bold text-gray-700">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-5 h-5 text-emerald-600" />
            <span>خدمة ما بعد البيع</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>التوصيل مجاني</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>مع الضمان</span>
          </div>
        </div>
      </div>

      {/* ===== 1. COMPACT VISUAL HOOK & PRICE ===== */}
      <HeroSection
        books={pack.books}
        price={pack.price}
        originalPrice={pack.originalPrice}
        packName={pack.packName}
        feminine={pack.feminine}
      />

      {/* ===== 2. IMMEDIATE CHECKOUT FORM ===== */}
      <div className="mx-3">
        <CheckoutSection pack={pack} onCtaClick={() => {}} />
      </div>

      {/* ===== 3. PACK CONTENTS CHECKLIST (COMPACT) ===== */}
      <section className="mx-3 mt-4 bg-white p-3.5 rounded-2xl border border-[#E5E5E5] shadow-sm">
        <h2 className="text-center text-base font-extrabold text-gray-900 mb-2.5">
          تفاصيل الكتب الموجودة في الباقة:
        </h2>
        <ul className="space-y-1.5">
          {pack.books.map((book, i) => (
            <li
              key={book.id}
              className="flex items-center gap-2 text-sm font-medium text-[#1F2937]"
            >
              {i === pack.giftBookIndex ? (
                <>
                  <span className="text-emerald-600 font-bold flex-shrink-0">هدية:</span>
                  <span className="text-emerald-700 font-extrabold">{book.title}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="line-clamp-1">{book.title}</span>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Site footer */}
      <footer className="border-t border-[#E5E5E5] py-4 text-center mt-6">
        <p className="text-xs text-[#6B7280]">
          {pack.footer.copyright}
        </p>
      </footer>
    </main>
  );
}
