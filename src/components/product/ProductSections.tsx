"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown, Truck, Banknote, ShieldCheck, Headphones } from "lucide-react";
import { PackConfig, offers, getOfferBySlug } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

/* ============================================================
 * Universal, data-driven product-page sections.
 * Every section receives `pack` and renders only what the data
 * provides — so a new bundle added to data.json tomorrow inherits
 * the full conversion architecture automatically.
 * ============================================================ */

const ACCENT = "#111827";
const CARD = "bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4";
const HEADING = "text-center font-black text-xl text-[#111827] mb-3";

/* ---------- 1. HERO: attention + clarity ---------- */
export function ProductHero({ pack }: { pack: PackConfig }) {
  return (
    <section className="px-5 pt-6 text-center">
      <h1 className="font-black text-3xl md:text-4xl text-[#1E3A8A] leading-snug">
        {pack.heroHeadline}
      </h1>

      {/* Book covers with titles underneath, 3 per row */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {pack.books.map((b, i) => (
          <div key={b.id} className="flex flex-col">
            <div
              className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] shadow-sm ${
                i === pack.giftBookIndex ? "ring-2 ring-[#1E3A8A]" : ""
              }`}
            >
              <BookCover title={b.title} src={b.coverUrl} className="h-full w-full object-cover" />
              {i === pack.giftBookIndex && (
                <span className="absolute inset-x-0 bottom-0 bg-[#1E3A8A] text-white text-[10px] font-extrabold py-1">
                  🎁 هدية
                </span>
              )}
            </div>
            <p className="mt-1 text-center text-[11px] font-bold text-[#111827] leading-tight line-clamp-2">
              كتاب {b.title}
            </p>
          </div>
        ))}
      </div>

      {/* Price block */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        <span className="text-gray-400 line-through text-base">
          {pack.originalPrice} درهم
        </span>
        <span className="text-3xl font-black text-[#1E3A8A]">
          {pack.price} درهم
        </span>
      </div>
      <p className="text-center text-sm font-bold text-[#1E3A8A] mt-2">
        الدفع عند الاستلام
      </p>
    </section>
  );
}

/* ---------- 2. OUTCOMES: sell the result, not the books ---------- */
export function OutcomeSection({ pack }: { pack: PackConfig }) {
  if (!pack.outcomes.length) return null;
  return (
    <section className="mx-4 mt-4">
      <div className={CARD}>
        <h2 className={HEADING}>ماذا ستجني من هذه الباقة؟</h2>
        <ul className="space-y-2">
          {pack.outcomes.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-medium text-[#111827]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#111827]/10 text-[#111827] text-xs font-bold">
                {i + 1}
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 3. FOR YOU IF: relevance + honest self-selection ---------- */
export function ForYouIfSection({ pack }: { pack: PackConfig }) {
  if (!pack.forYouIf.length && !pack.notForYouIf.length) return null;
  return (
    <section className="mx-4 mt-4">
      <div className={CARD}>
        <h2 className={HEADING}>هذه الباقة مناسبة لك إذا…</h2>
        <ul className="space-y-2">
          {pack.forYouIf.map((x, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#111827]">
              <Check className="w-4 h-4 text-[#111827] shrink-0 mt-0.5" />
              <span>{x}</span>
            </li>
          ))}
        </ul>

        {pack.notForYouIf.length > 0 && (
          <>
            <h3 className="mt-4 mb-2 text-center font-bold text-base text-[#6B7280]">
              وقد لا تكون الأنسب إذا…
            </h3>
            <ul className="space-y-2">
              {pack.notForYouIf.map((x, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#6B7280]">
                  <X className="w-4 h-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

/* ---------- 4. CONTENT PREVIEW: show value before asking ---------- */
export function ContentPreviewSection({ pack }: { pack: PackConfig }) {
  return (
    <section className="mx-4 mt-4">
      <div className={CARD}>
        <h2 className={HEADING}>استكشف محتوى الباقة</h2>
        {pack.previewNote && (
          <p className="text-center text-xs text-[#6B7280] mb-3">{pack.previewNote}</p>
        )}
        <ul className="space-y-3">
          {pack.books.map((b, i) => (
            <li key={b.id} className="flex gap-3">
              <div className="w-12 h-16 shrink-0 overflow-hidden rounded-md border border-[#E5E5E5] bg-[#F9F9F9]">
                <BookCover title={b.title} src={b.coverUrl} className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111827] leading-tight">
                  {b.title}
                  {i === pack.giftBookIndex ? " 🎁 (هدية)" : ""}
                </p>
                <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 5. TRUST: legitimate signals only ---------- */
export function TrustSection({ pack }: { pack: PackConfig }) {
  const items = [
    { icon: Banknote, t: "الدفع عند الاستلام", d: "لا تدفع أي مبلغ قبل استلام باقتك وفحصها." },
    { icon: Truck, t: "توصيل مجاني لجميع المدن", d: "نوصّل لباب منزلك في كل مدن المغرب." },
    { icon: ShieldCheck, t: "فحص قبل الدفع", d: "تأكد من الكتب عند التسليم قبل أن تدفع." },
    { icon: Headphones, t: "خدمة ما بعد البيع", d: "فريقنا يتابع معك من الطلب حتى الاستلام." },
  ];
  return (
    <section className="mx-4 mt-4">
      <div className="bg-[#F9F9F9] rounded-2xl border border-[#E5E5E5] shadow-sm p-4">
        <h2 className={HEADING}>لماذا تثق بطلبك من دار الوِراقة؟</h2>
        <ul className="space-y-2.5">
          {items.map((it, i) => {
            const Icon = it.icon;
            const isCOD = it.icon === Banknote;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#111827]/10 text-[#111827]">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <p className={`text-sm ${isCOD ? "font-extrabold" : "font-bold"} text-[#111827]`}>{it.t}</p>
                  <p className={`text-xs text-[#4B5563] ${isCOD ? "font-bold" : ""}`}>{it.d}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 6. FAQ / OBJECTION HANDLING ---------- */
export function FaqSection({ pack }: { pack: PackConfig }) {
  const faqs = pack.faqs ?? [];
  const [open, setOpen] = useState<number | null>(null);
  if (!faqs.length) return null;
  return (
    <section className="mx-4 mt-4">
      <div className={CARD}>
        <h2 className={HEADING}>أسئلة شائعة</h2>
        <div className="divide-y divide-[#E5E5E5]">
          {faqs.map((f, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-2 py-3 text-right"
                aria-expanded={open === i}
              >
                <span className="text-sm font-bold text-[#111827]">{f.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#111827] transition-transform shrink-0 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="pb-3 text-xs text-[#4B5563] leading-relaxed">{f.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. CROSS-SELL: relevant recommendations ---------- */
export function CrossSellSection({ pack }: { pack: PackConfig }) {
  const slugs = pack.crossSell ?? [];
  const recs = slugs
    .map((s) => getOfferBySlug(s))
    .filter((p): p is PackConfig => Boolean(p) && p!.slug !== pack.slug);
  if (!recs.length) return null;
  return (
    <section className="mx-4 mt-4 mb-4">
      <h2 className={HEADING}>قد يعجبك أيضاً</h2>
      <div className="grid grid-cols-1 gap-3">
        {recs.map((r) => (
          <Link
            key={r.slug}
            href={`/${r.slug}`}
            className="block bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-3 flex items-center gap-3 active:scale-[0.99] transition-all"
          >
            <div className="flex -space-x-2">
              {r.books.slice(0, 3).map((b) => (
                <div key={b.id} className="w-10 h-14 overflow-hidden rounded-md border border-white shadow-sm">
                  <BookCover title={b.title} src={b.coverUrl} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#111827] line-clamp-1">{r.packName}</p>
              <p className="text-xs text-[#6B7280] line-clamp-1">{r.outcomes[0] ?? r.desc}</p>
            </div>
            <span className="text-sm font-black text-[#111827] whitespace-nowrap">
              {r.price} درهم
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
