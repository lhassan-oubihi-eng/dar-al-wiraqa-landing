"use client";

import React, { useEffect } from "react";
import { PackConfig } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { PackUrgencyBanner } from "@/components/PackUrgencyBanner";
import { BundleShowcase } from "@/components/BundleShowcase";
import { CheckoutSection } from "@/components/CheckoutSection";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

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
      {/* 1. Sticky top banner */}
      <StickyBanner text={pack.announcement} />

      {/* 2. Honest promo banner (no fake scarcity) */}
      <PackUrgencyBanner pack={pack} />

      <main className="mx-auto max-w-[420px] pb-24 bg-white min-h-screen">
        {/* Main headline + ethical social proof */}
        <section className="px-4 pt-4 text-center">
          <h1 className="font-black text-2xl md:text-3xl text-[#111827] leading-snug">{pack.heroHeadline}</h1>
          <p className="mt-2 text-sm font-bold text-[#111827] text-center">
            {pack.socialProof}
          </p>
        </section>

        {/* Static Bundle Showcase */}
        <BundleShowcase pack={pack} />

        {/* 4. Checkout form placed HIGH on the page */}
        <div id="checkout-form" className="mx-4 mt-4 scroll-mt-24">
          <CheckoutSection pack={pack} onCtaClick={() => {}} />
        </div>

        <footer className="border-t border-[#E5E5E5] py-4 text-center mt-6">
          <p className="text-xs text-[#6B7280]">{pack.footer.copyright}</p>
        </footer>
      </main>

      {/* Floating CRO elements */}
      <StickyMobileCTA pack={pack} />
    </>
  );
}
