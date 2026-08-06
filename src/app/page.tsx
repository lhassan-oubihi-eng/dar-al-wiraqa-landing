"use client";

import React, { useState, useEffect, useRef } from "react";
import { psychologyPack } from "@/config/psychologyPack";
import { StickyBanner } from "@/components/StickyBanner";
import { HeroSection } from "@/components/HeroSection";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { ValuePropSection } from "@/components/ValuePropSection";
import { GuaranteeSection } from "@/components/GuaranteeSection";
import { CheckoutSection } from "@/components/CheckoutSection";
import { MobileStickyFooter } from "@/components/MobileStickyFooter";
import { CheckCircle } from "lucide-react";

export default function Home() {
  const [orderComplete, setOrderComplete] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (orderComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [orderComplete]);

  const handleSuccess = () => {
    setOrderComplete(true);
  };

  const handleCloseSuccess = () => {
    setOrderComplete(false);
  };

  if (orderComplete) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(62, 39, 35, 0.7)" }}
        onClick={handleCloseSuccess}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center mb-3 text-[#d4af37]">
            <CheckCircle size={48} />
          </div>
          <h3 className="font-bold text-lg text-[#3e2723] mb-3">
            تم تأكيد طلبك بنجاح!
          </h3>
          <p className="text-sm text-[#5d4538]/80 mb-4">
            شكراً لثقتك في دار الوِراقة. طلبيتك في الطريق إليك وستصلك في
            أقرب وقت ممكن.
          </p>
          <p className="text-xs text-[#5d4538]/70 mb-4">
            برجاء إبقاء هاتفك مفتوحاً، سيتصل بك موزع التوصيل قريباً.
          </p>
          <button
            onClick={handleCloseSuccess}
            className="w-full py-2.5 rounded-xl font-bold text-sm"
            style={{ background: "#d4af37", color: "#3e2723" }}
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. Ad-cession Sticky Banner */}
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

        {/* 6. CHECKOUT FORM (Action) */}
        <div ref={formRef}>
          <CheckoutSection pack={psychologyPack} onSuccess={handleSuccess} />
        </div>

        {/* Other packs footer (keep users browsing inside the store) */}
        <section className="mt-10 mx-4">
          <h2 className="font-display text-center text-[#d4af37] text-sm mb-3">
            باقي الباكات الخاصة بنا
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {psychologyPack.otherPacks.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className="block p-2.5 rounded-xl border border-[#eaeaea] bg-white text-center hover:border-[#d4af37] hover:shadow-sm transition"
              >
                <p className="text-xs font-semibold text-[#3e2723]">
                  {p.label}
                </p>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* 7. Mobile Sticky Footer (only on mobile, value-driven copy) */}
      <MobileStickyFooter
        price={psychologyPack.price}
        onCtaClick={scrollToForm}
      />

      {/* Site footer */}
      <footer className="text-center py-4 text-[11px] text-[#5d4538]/70 border-t border-[#eaeaea] mt-6">
        {psychologyPack.footer.copyright}
      </footer>
    </>
  );
}
