"use client";

import { offers, STORE } from "@/data/offers";
import { HeroBanner } from "@/components/HeroBanner";
import { CategorySection } from "@/components/CategorySection";
import { TrustRibbon } from "@/components/TrustRibbon";

export default function Home() {
  return (
    <>
      {/* 1. Hero Banner — YouCan.shop style attention block */}
      <HeroBanner />

      {/* 2. Trust Ribbon — COD / Free Shipping / 24h */}
      <div className="mx-auto max-w-6xl px-4 py-3">
        <TrustRibbon />
      </div>

      {/* 3. Categories — organized by theme */}
      <CategorySection
        title="باقات علم النفس"
        subtitle="5 كتب نفسية أساسية + هدية مجانية"
        packs={offers.filter((p) => p.slug === "psychology")}
      />

      <CategorySection
        title="باقات دينية مميزة"
        subtitle="إرشادات روحانية لتقويم إيمانك يومياً"
        packs={offers.filter((p) => p.slug === "religious")}
      />

      <CategorySection
        title="باقات تطوير ذاتي"
        subtitle="استراتيجيات عملية لتطوير نفسك ومهاراتك"
        packs={offers.filter((p) => p.slug === "self-development")}
      />

      <CategorySection
        title="باقات المال والاستثمار"
        subtitle="ادعِ الثروة بعقلية صحيحة وعادات ذكية"
        packs={offers.filter((p) => p.slug === "finance")}
      />

      <CategorySection
        title="باقات الرعب والإثارة"
        subtitle="لوحة متكاملة من أفضل روايات الرعب العربيّة"
        packs={offers.filter((p) => p.slug === "horror-thriller")}
      />

      <CategorySection
        title="باقات التمكين والأنوثة"
        subtitle="اكتشري قوتك وحافظي على تقديرك الذاتي"
        packs={offers.filter((p) => p.slug === "empowerment")}
      />

      {/* 5. Footer */}
      <footer className="border-t border-[#E5E5E5] py-8 text-center">
        <p className="text-sm text-[#6B7280]">
          {STORE.copyright}
        </p>
      </footer>
    </>
  );
}