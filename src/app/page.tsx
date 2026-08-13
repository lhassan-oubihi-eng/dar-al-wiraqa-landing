"use client";

import { offers, STORE, PackConfig } from "@/data/offers";
import { HeroBanner } from "@/components/HeroBanner";
import { CategorySection } from "@/components/CategorySection";
import { TrustRibbon } from "@/components/TrustRibbon";
import { useCart } from "@/components/CartContext";

export default function Home() {
  const { addPack } = useCart();

  // Group packs into categories for the organized grid layout.
  const psychological = offers.filter((p) => p.slug === "psychology");
  const religious = offers.filter((p) => p.slug === "religious");
  const selfDev = offers.filter((p) => p.slug === "self-development");
  const finance = offers.filter((p) => p.slug === "finance");
  const entertainment = offers.filter((p) => p.slug === "horror-thriller");
  const empowerment = offers.filter((p) => p.slug === "empowerment");

  const onAdd = (pack: PackConfig) => addPack(pack);

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
        packs={psychological}
        onAdd={onAdd}
      />

      <CategorySection
        title="باقات دينية مميزة"
        subtitle="إرشادات روحانية لتقويم إيمانك يومياً"
        packs={religious}
        onAdd={onAdd}
      />

      <CategorySection
        title="باقات تطوير ذاتي"
        subtitle="استراتيجيات عملية لتطوير نفسك ومهاراتك"
        packs={selfDev}
        onAdd={onAdd}
      />

      <CategorySection
        title="باقات المال والاستثمار"
        subtitle="ادعِ الثروة بعقلية صحيحة وعادات ذكية"
        packs={finance}
        onAdd={onAdd}
      />

      <CategorySection
        title="باقات الرعب والإثارة"
        subtitle="لوحة متكاملة من أفضل روايات الرعب العربيّة"
        packs={entertainment}
        onAdd={onAdd}
      />

      <CategorySection
        title="باقات التمكين والأنوثة"
        subtitle="اكتشري قوتك وحافظي على تقديرك الذاتي"
        packs={empowerment}
        onAdd={onAdd}
      />

      {/* 4. Footer */}
      <footer className="border-t border-[#E5E5E5] py-8 text-center">
        <p className="text-sm text-[#6B7280]">
          {STORE.copyright}
        </p>
      </footer>
    </>
  );
}