"use client";

import React, { useEffect, useRef } from "react";
import { PackConfig } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";
import { TrustRibbon } from "@/components/TrustRibbon";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

interface PackLandingProps {
  pack: PackConfig;
}

function firePixel(name: string, params: Record<string, unknown>) {
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

      {/* Main content */}
      <main className="mx-auto max-w-[420px] pb-6">
        {/* 2. HERO SECTION (Attention) */}
        <HeroSection
          headline={pack.headline}
          subheadline={pack.subheadline}
          books={pack.books}
          giftBookIndex={pack.giftBookIndex}
          originalPrice={pack.originalPrice}
          price={pack.price}
          feminine={pack.feminine}
          onCtaClick={scrollToForm}
        />

        {/* 3. Ethical Urgency Banner */}
        <UrgencyBanner text={pack.urgency} />

        {/* COD / delivery trust ribbon */}
        <TrustRibbon />

        {/* Social proof strip */}
        <div
          className="mx-4 my-3 rounded-xl border border-[#3A2E22] px-4 py-3 text-center"
          style={{ background: "var(--color-card)" }}
        >
          <div className="mb-1 text-base tracking-widest text-[#D4AF37]">★★★★★</div>
          <p className="text-xs font-bold text-[#F3E6C4]">
            الباقة الأكثر طلباً في دار الوراقة
          </p>
        </div>

        {/* Named reviews (social proof) */}
        <div className="mx-4 my-3 space-y-2">
          {[
            {
              name: "سامية · الدار البيضاء",
              stars: "⭐⭐⭐⭐⭐",
              copy: "طلبانية البارح ووصلت اليوم. كتب أصلية والتغليف محترم. جودة مزيان بزّاف.",
            },
            {
              name: "يوسف · مراكش",
              stars: "⭐⭐⭐⭐⭐",
              copy: "كنت متشكك فالجودة، لكن الصفحات سميكة والطباعة واضحة. راضي تماماً.",
            },
            {
              name: "فاطمة · طنجة",
              stars: "⭐⭐⭐⭐⭐",
              copy: "من أحسن الاستثمارات هاد العام. تجاوبو معايا بسرعة على الواتساب والتوصيل كان سريع.",
            },
          ].map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-[#3A2E22] px-3.5 py-2.5 text-right"
              style={{ background: "var(--color-card)" }}
            >
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#16a34a]">
                  {r.name}
                </span>
                <span className="text-[11px] text-[#D4AF37]">{r.stars}</span>
              </div>
              <p className="text-[12px] leading-relaxed text-[#CDBB9C]">
                {r.copy}
              </p>
            </div>
          ))}
        </div>

        {/* 4. GOLDEN GUARANTEE */}
        <GuaranteeSection guarantee={pack.guarantee} />

        {/* 6. CHECKOUT FORM */}
        <div ref={formRef}>
          <CheckoutSection pack={pack} namePlaceholder={pack.namePlaceholder} />
        </div>
      </main>

      {/* 7. Mobile Sticky Footer */}
      <MobileStickyFooter
        price={pack.price}
        feminine={pack.feminine}
        onCtaClick={scrollToForm}
      />

      {/* Site footer */}
      <footer className="mt-6 border-t border-[#3A2E22] py-4 text-center text-[11px] text-[#CDBB9C]/70">
        {pack.footer.copyright}
      </footer>

      {/* Exit-intent popup — one-time reassuring COD "reserve now" hook */}
      <ExitIntentPopup
        packName={pack.packName}
        price={pack.price}
        onReserve={scrollToForm}
      />
    </>
  );
}

