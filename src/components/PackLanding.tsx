"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { PackConfig, offers } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { ValuePropSection } from "@/components/ValuePropSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";

interface PackLandingProps {
  pack: PackConfig;
}

export function PackLanding({ pack }: PackLandingProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    // Auto-focus the name input after scroll to trigger the mobile virtual keyboard
    setTimeout(() => {
      const nameInput = document.getElementById("name");
      if (nameInput) {
        nameInput.focus();
      }
    }, 800);
  };

  const otherPacks = offers.filter((o) => o.slug !== pack.slug);

  return (
    <>
      {/* 1. Sticky top banner */}
      <StickyBanner text={pack.tagline} />

      {/* Main content */}
      <main className="mx-auto max-w-[420px] pb-24">
        {/* 2. HERO SECTION (Attention) */}
        <HeroSection
          headline={pack.headline}
          subheadline={pack.subheadline}
          books={pack.books}
          giftBookIndex={pack.giftBookIndex}
          originalPrice={pack.originalPrice}
          price={pack.price}
          onCtaClick={scrollToForm}
        />

        {/* 3. Ethical Urgency Banner */}
        <UrgencyBanner text={pack.urgency} />

        {/* Social proof strip */}
        <div
          className="mx-4 my-3 rounded-xl border border-[#3A2E22] px-4 py-3 text-center"
          style={{ background: "var(--color-card)" }}
        >
          <div className="mb-1 text-base tracking-widest text-[#d4af37]">★★★★★</div>
          <p className="text-xs font-bold text-[#e8e0d4]">
            الباقة الأكثر طلباً في دار الوراقة
          </p>
        </div>

        {/* 4. VALUE & DESIRE SECTION */}
        <ValuePropSection
          title={pack.valuePropTitle}
          benefits={pack.benefits}
        />

        {/* 5. GOLDEN GUARANTEE */}
        <GuaranteeSection guarantee={pack.guarantee} />

        {/* 6. CHECKOUT FORM */}
        <div ref={formRef}>
          <CheckoutSection pack={pack} />
        </div>
      </main>

      {/* Other packs — clean cross-links */}
      <section className="mx-4 mb-6 rounded-2xl p-5" style={{ background: "var(--color-card)" }}>
        <h3 className="mb-3 text-center text-sm font-bold text-[#e8e0d4]">
          باقات أخرى قد تناسبك
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {otherPacks.map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className="rounded-full border border-[#3A2E22] px-3.5 py-1.5 text-[11px] font-bold text-[#cdbba9] transition-colors hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              {o.emoji} {o.packName}
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Mobile Sticky Footer */}
      <MobileStickyFooter
        price={pack.price}
        onCtaClick={scrollToForm}
      />

      {/* Site footer */}
      <footer className="mt-6 border-t border-[#3A2E22] py-4 text-center text-[11px] text-[#cdbba9]/70">
        {pack.footer.copyright}
      </footer>
    </>
  );
}
