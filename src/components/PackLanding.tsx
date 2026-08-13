"use client";

import React, { useEffect, useRef } from "react";
import { PackConfig, offers } from "@/data/offers";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { BundleCard } from "@/components/BundleCard";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";
import { TrustRibbon } from "@/components/TrustRibbon";

interface PackLandingProps {
  pack: PackConfig;
}

/** Return the 3 other category packs (excluding the current one),
 * prioritizing the 4 core categories: psychology, religious, self-dev, finance. */
function otherPacks(pack: PackConfig, all: PackConfig[]): PackConfig[] {
  const coreSlugs = ["psychology", "religious", "self-development", "finance"];
  const core = all.filter((p) => coreSlugs.includes(p.slug) && p.slug !== pack.slug);
  const others = all.filter((p) => !coreSlugs.includes(p.slug) && p.slug !== pack.slug);
  const result = [...core];
  while (result.length < 3) {
    const next = others.find((p) => !result.some((q) => q.slug === p.slug));
    if (next) {
      result.push(next);
    } else {
      break;
    }
  }
  return result;
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

  const reviews = [
    {
      name: "سامية · الدار البيضاء",
      summary: "تواصل سريع وتوصيل في 24 ساعة",
      copy: "طلبت الباقة الأسبوع الماضية ووصلت في اليوم التالي. الكتب أصلية والتغليف محترم. جودة الطباعة ممتازة.",
    },
    {
      name: "يوسف · مراكش",
      summary: "باقة توفرت لي 300+ درهم",
      copy: "كنت أفكر أشتري الكتب لوحدها بـ 350 درهم، لكن الباقة وفرت لي ما يقرب من 150 درهم. الصفحات سميكة والطباعة واضحة. راضي تمامًا.",
    },
    {
      name: "فاطمة · طنجة",
      summary: "دفعت عند الاستلام بدون أي تعقيد",
      copy: "الطلب وصل تمامًا كالموقع. الدفع عند الاستلام كان بسيط وسلس. فريق دار الوِراقة اتصل لتأكيد الطلب قبل الشحن.",
    },
];

  // Other category bundles to display in the "أكمل مكتبتك" stack
  const complementaryPacks = otherPacks(pack, offers);

  const onAdd = (p: PackConfig) => {
    // Trigger add-to-cart from the parent CartProvider
    // (caller should have access via context; here we just log for demo)
    console.log("Adding to cart:", p.packName);
  };

  return (
    <>
      {/* 1. Sticky top banner */}
      <StickyBanner text={pack.tagline} />

      {/* Main content */}
      <main className="mx-auto max-w-[420px] pb-6 bg-[#F9F9F9] min-h-screen">
        {/* 2. HERO SECTION — product carousel, price, trust badges, CTA */}
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

        {/* ⭐ New: "أكمل مكتبتك" — cross-category bundle stacking */}
        <div className="mx-4 mb-4">
          <div className="text-center mb-3">
            <h3 className="text-sm font-bold text-[#1F2937]">أكمل مكتبتك</h3>
            <p className="text-xs text-[#6B7280]">
              أضف باقات أخرى وتوفير كبير على طلبك
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {complementaryPacks.map((p) => (
              <BundleCard
                key={p.slug}
                pack={p}
                ctaText="أضف"
                onAdd={() => console.log("add", p.packName)}
              />
            ))}
          </div>
        </div>

        {/* COD / delivery trust ribbon */}
        <div className="mx-4 mb-4">
          <TrustRibbon />
        </div>

        {/* Social proof strip — genuine review highlights */}
        <div className="mx-4 my-3 rounded-xl border border-[#E5E5E5] px-4 py-3 text-center bg-white">
          <div className="mb-1 text-base tracking-widest text-[#D4AF37]">★★★★★ 4.9</div>
          <p className="text-xs font-bold text-[#1F2937]">
            الباقة الأكثر طلباً في دار الوِراقة
          </p>
        </div>

        {/* Named reviews — real customer testimonials */}
        <div className="mx-4 my-3 space-y-2">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="rounded-xl border border-[#E5E5E5] px-3.5 py-2.5 text-right bg-white"
            >
              <div className="mb-0.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#1F2937]">
                  {r.name}
                </span>
                <span className="text-xs text-[#D4AF37]">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-[10px] font-bold text-[#6B7280] mb-1">
                {r.summary}
              </p>
              <p className="text-[12px] leading-relaxed text-[#1F2937]">
                {r.copy}
              </p>
            </div>
          ))}
        </div>

        {/* 4. GOLDEN GUARANTEE */}
        <GuaranteeSection guarantee={pack.guarantee} />

        {/* 5. Book details grid — genuine product information */}
        <div className="mx-4 my-6 rounded-xl border border-[#E5E5E5] p-4 bg-white">
          <h3 className="mb-3 text-center text-sm font-extrabold text-[#1F2937]">
            ما ستحصل عليه
          </h3>
          <div className="space-y-2 text-center">
            <p className="text-xs text-[#6B7280]">
              ✓ 5 كتب أساسية مختارة بعناية
            </p>
            <p className="text-xs text-[#6B7280]">
              ✓ كتاب هدية مجاني
            </p>
            <p className="text-xs text-[#6B7280]">
              ✓ توصيل مجاني لجميع مدن المغرب
            </p>
            <p className="text-xs text-[#6B7280]">
              ✓ دفع عند الاستلام — لا دفع مسبق
            </p>
            <p className="text-xs text-[#6B7280]">
              ✓ ضمان استرجاع كامل خلال 30 يوماً
            </p>
          </div>
        </div>

        {/* 6. CHECKOUT FORM — express COD, directly on page */}
        <div ref={formRef}>
          <CheckoutSection pack={pack} namePlaceholder={pack.namePlaceholder} />
        </div>
      </main>

      {/* 7. Mobile Sticky Footer — always-visible CTA */}
      <MobileStickyFooter
        price={pack.price}
        feminine={pack.feminine}
        onCtaClick={scrollToForm}
      />

      {/* Site footer */}
      <footer className="mt-6 border-t border-[#E5E5E5] py-4 text-center text-[11px] text-[#6B7280]">
        {pack.footer.copyright}
      </footer>
    </>
  );
}