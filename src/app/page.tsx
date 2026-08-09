"use client";

import React, { useRef } from "react";
import { psychologyPack } from "@/config/psychologyPack";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { ValuePropSection } from "@/components/ValuePropSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";

export default function Home() {
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

  return (
    <>
      {/* 1. Sticky top banner */}
      <StickyBanner text={psychologyPack.tagline} />

      {/* Main content */}
      <main className="max-w-[420px] mx-auto pb-24">
        {/* 2. HERO SECTION (Attention) — Hook + transformation headline + 3D mockup + price anchoring + CTA */}
        <HeroSection
          headline={psychologyPack.headline}
          subheadline={psychologyPack.subheadline}
          books={psychologyPack.books}
          giftBookIndex={psychologyPack.giftBookIndex}
          originalPrice={psychologyPack.originalPrice}
          price={psychologyPack.price}
          onCtaClick={scrollToForm}
        />

        {/* 3. Ethical Urgency Banner (scarcity for free gift) */}
        <UrgencyBanner text={psychologyPack.urgency} />

        {/* 4. VALUE & DESIRE SECTION (Interest & Desire) — Moved up beneath the Hero */}
        <ValuePropSection
          title={psychologyPack.valuePropTitle}
          benefits={psychologyPack.benefits}
        />

        {/* 5. GOLDEN GUARANTEE (Trust — eliminates risk hesitation) */}
        <GuaranteeSection guarantee={psychologyPack.guarantee} />

        {/* 6. CHECKOUT FORM (Action) — on success the form redirects to /thank-you */}
        <div ref={formRef}>
          <CheckoutSection pack={psychologyPack} />
        </div>
      </main>

      {/* 7. Mobile Sticky Footer (only on mobile, value-driven copy) */}
      <MobileStickyFooter
        price={psychologyPack.price}
        onCtaClick={scrollToForm}
      />

      {/* Site footer */}
      <footer className="text-center py-4 text-[11px] text-[#cdbba9]/70 border-t border-[#3A2E22] mt-6">
        {psychologyPack.footer.copyright}
      </footer>
    </>
  );
}
