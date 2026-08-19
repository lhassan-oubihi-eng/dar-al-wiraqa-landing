"use client";

import React, { useEffect } from "react";
import { PackConfig } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { PackUrgencyBanner } from "@/components/PackUrgencyBanner";
import { TrustRibbon } from "@/components/TrustRibbon";
import { BundleShowcase } from "@/components/BundleShowcase";
import { CheckoutSection } from "@/components/CheckoutSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import {
  ProductHero,
  OutcomeSection,
  ForYouIfSection,
  ContentPreviewSection,
  TrustSection,
  FaqSection,
  CrossSellSection,
} from "@/components/product/ProductSections";

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

/**
 * Universal product-page system. Every bundle flows through the same
 * conversion journey — ATTENTION → DESIRE → RELEVANCE → VALUE →
 * UNDERSTANDING → TRUST → OBJECTION REMOVAL → ORDER → CROSS-SELL.
 * Sections pull only from `pack` data, so any new bundle automatically
 * inherits the full architecture.
 */
export function PackLanding({ pack }: PackLandingProps) {
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

  return (
    <>
      {/* 1. Top announcement + honest daily-offer banner */}
      <StickyBanner text={pack.announcement} />
      <PackUrgencyBanner pack={pack} />

      <main className="mx-auto max-w-[420px] pb-8 bg-white min-h-screen">
        {/* 2. HERO — attention + clarity + CTA */}
        <ProductHero pack={pack} />

        {/* 2b. TRUST BAR — early reassurance for cold ad traffic */}
        <TrustRibbon />

        {/* 3. OUTCOMES — desire / what's in it for me */}
        <OutcomeSection pack={pack} />

        {/* 4. FOR YOU IF — relevance + honest self-selection */}
        <ForYouIfSection pack={pack} />

        {/* 5. BUNDLE SHOWCASE — what you get + price + guarantee */}
        <BundleShowcase pack={pack} />

        {/* 6. CONTENT PREVIEW — understanding + demonstrated value */}
        <ContentPreviewSection pack={pack} />

        {/* 7. TRUST — legitimate signals only */}
        <TrustSection pack={pack} />

        {/* 8. FAQ — objection handling */}
        <FaqSection pack={pack} />

        {/* 9. ORDER — low-risk decision */}
        <div id="checkout-form" className="mx-4 mt-4 scroll-mt-24">
          <CheckoutSection pack={pack} onCtaClick={() => {}} />
        </div>

        {/* 10. CROSS-SELL — recover undecided / related interest */}
        <CrossSellSection pack={pack} />

        <footer className="border-t border-[#E5E5E5] py-4 text-center mt-6">
          <p className="text-xs text-[#6B7280]">{pack.footer.copyright}</p>
        </footer>
      </main>

      {/* Floating CRO element */}
      <StickyMobileCTA pack={pack} />
    </>
  );
}
