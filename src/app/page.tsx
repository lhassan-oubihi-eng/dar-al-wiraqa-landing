import { offers, STORE } from "@/data/offers";
import { PackCard } from "@/components/PackCard";

export default function Home() {
  return (
    <>
      {/* Header */}
      <header
        className="relative overflow-hidden border-b text-center"
        style={{
          borderColor: "var(--color-border)",
          background:
            "linear-gradient(180deg, var(--color-paper), var(--color-card))",
        }}
      >
        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-4 pb-3">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "var(--color-gold-light)" }}>
            دار الوِراقة
          </h1>
          <p className="mt-1 text-sm md:text-base" style={{ color: "var(--color-ink-light)" }}>
            {STORE.tagline}
          </p>
        </div>
      </header>

      {/* Offers banner */}
      <div className="sticky top-0 z-20">
        <div
          className="shadow-lg"
          style={{
            background: "linear-gradient(90deg,#3E2723,#241D17)",
            borderBottom: "1px solid rgba(212,175,55,.25)",
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-2 text-center md:flex-row md:gap-6">
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide"
                style={{ background: "rgba(212,175,55,.18)", color: "var(--color-gold-light)" }}
              >
                عرض محدود
              </span>
              <p className="text-sm font-bold text-[#e8e0d4] md:text-base">
                باك 5 كتب بـ{" "}
                <span className="text-lg font-bold" style={{ color: "#ffe3b3" }}>
                  199 درهم
                </span>{" "}
                شامل التوصيل
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Packs grid */}
      <main className="mx-auto max-w-6xl px-4 py-5">
        <h2 className="mb-3 text-lg font-bold md:text-xl" style={{ color: "var(--color-gold-light)" }}>
          عروض خاصة
        </h2>
        <div className="grid grid-cols-2 gap-3 pb-2 md:gap-5 lg:grid-cols-3">
          {offers.map((pack) => (
            <PackCard key={pack.slug} pack={pack} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 text-center"
        style={{ borderColor: "var(--color-border)" }}
      >
        <p className="text-sm opacity-60" style={{ color: "var(--color-ink-light)" }}>
          {STORE.copyright}
        </p>
      </footer>
    </>
  );
}
