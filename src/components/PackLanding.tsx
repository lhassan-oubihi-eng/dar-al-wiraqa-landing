"use client";

import React, { useEffect } from "react";
import { PackConfig } from "@/data/offers";
import { ProductHero } from "@/components/product/ProductSections";
import { CheckoutSection } from "@/components/CheckoutSection";

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
 * Stripped landing page: only the hero block (headline + book list + price)
 * and the checkout form. Every other section has been intentionally removed.
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
      <main className="mx-auto max-w-[460px] pb-12 bg-white min-h-screen">
        {/* HERO — attention + clarity */}
        <ProductHero pack={pack} />

        {/* ORDER — the only remaining conversion step */}
        <div id="checkout-form" className="mx-4 mt-10 scroll-mt-24">
          <CheckoutSection pack={pack} onCtaClick={() => {}} />
        </div>
      </main>
    </>
  );
}
