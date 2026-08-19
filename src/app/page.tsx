import { offers, STORE } from "@/data/offers";
import { TrustRibbon } from "@/components/TrustRibbon";
import { BookCover } from "@/components/BookCover";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-[640px] bg-white min-h-screen">
      {/* Intro — customer intent first */}
      <section className="px-4 pt-8 pb-2 text-center">
        <p className="text-sm font-bold text-[#047857]">دار الوِراقة — مكتبتك المغربية</p>
        <h1 className="mt-1 font-black text-2xl text-[#111827] leading-snug">
          اختر مجموعتك القادمة من الكتب
        </h1>
        <p className="mt-2 text-sm text-[#4B5563] leading-relaxed">
          باقات كتب مختارة بعناية بـ 199 درهم شامل التوصيل، وتدفع نقداً عند الاستلام.
        </p>
      </section>

      <div className="mx-4">
        <TrustRibbon />
      </div>

      {/* Curated bundles — one card per category, intent-driven */}
      <section className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {offers.map((pack) => (
          <Link
            key={pack.slug}
            href={`/${pack.slug}`}
            className="block bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex gap-2 justify-center mb-3">
              {pack.books.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  className="w-1/3 max-w-[90px] aspect-[3/4] overflow-hidden rounded-lg border border-[#E5E5E5] bg-[#F9F9F9]"
                >
                  <BookCover title={b.title} src={b.coverUrl} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-center text-xs font-bold text-[#047857]">{pack.category}</p>
            <h2 className="text-center font-black text-lg text-[#111827] mt-0.5 line-clamp-1">
              {pack.packName}
            </h2>
            <p className="text-center text-xs text-[#4B5563] mt-1 line-clamp-2 min-h-[2rem]">
              {pack.outcomes[0] ?? pack.desc}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-xl font-black text-[#047857]">{pack.price} درهم</span>
            </div>
            <span className="mt-3 block w-full text-center bg-[#047857] text-white font-extrabold text-sm py-3 rounded-xl">
              اكتشف الباقة
            </span>
          </Link>
        ))}
      </section>

      <footer className="border-t border-[#E5E5E5] py-8 text-center">
        <p className="text-sm text-[#6B7280]">{STORE.copyright}</p>
      </footer>
    </main>
  );
}
