import { offers, STORE } from "@/data/offers";
import { HeroBanner } from "@/components/HeroBanner";
import { CategorySection } from "@/components/CategorySection";
import { TrustRibbon } from "@/components/TrustRibbon";

export default function Home() {
  // Group packs into categories for the organized grid layout.
  const bestSellers = offers.filter((p) =>
    ["psychology", "self-development", "religious", "finance"].includes(p.slug)
  );
  const psychological = offers.filter((p) => p.slug === "psychology");
  const religious = offers.filter((p) => p.slug === "religious");
  const selfDev = offers.filter((p) => p.slug === "self-development");
  const finance = offers.filter((p) => p.slug === "finance");
  const entertainment = offers.filter((p) => p.slug === "horror-thriller");
  const empowerment = offers.filter((p) => p.slug === "empowerment");

  return (
    <>
      {/* 1. Hero Banner — YouCan.shop style attention block */}
      <HeroBanner />

      {/* 2. Trust Ribbon — COD / Free Shipping / 24h */}
      <div className="mx-auto max-w-6xl px-4 py-3">
        <TrustRibbon />
      </div>

      {/* 3. Best Sellers — full grid, featured badge on first card */}
      <CategorySection
        title="الأكثر مبيعاً"
        subtitle="أفضل الباقات التي يختارها آلاف العملاء في دار الوِراقة"
        packs={bestSellers}
        featured
      />

      {/* 4. Categories — organized by theme */}
      <CategorySection
        title="باقات علم النفس"
        subtitle="5 كتب نفسية أساسية + هدية مجانية"
        packs={psychological}
      />

      <CategorySection
        title="باقات دينية مميزة"
        subtitle="إرشادات روحانية لتقويم إيمانك يومياً"
        packs={religious}
      />

      <CategorySection
        title="باقات تطوير ذاتي"
        subtitle="استراتيجيات عملية لتطوير نفسك ومهاراتك"
        packs={selfDev}
      />

      <CategorySection
        title="باقات المال والاستثمار"
        subtitle="ادعِ الثروة بعقلية صحيحة وعادات ذكية"
        packs={finance}
      />

      <CategorySection
        title="باقات الرعب والإثارة"
        subtitle="لوحة متكاملة من أفضل روايات الرعب العربيّة"
        packs={entertainment}
      />

      <CategorySection
        title="باقات التمكين والأنوثة"
        subtitle="اكتشري قوتك وحافظي على تقديرك الذاتي"
        packs={empowerment}
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
