"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { STORE, offers, PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

/**
 * The order value used for ad conversion events (MAD). All packs share the
 * same fixed price, sourced from the store config so the pixel value can
 * never drift from the price shown.
 */
const orderValue = STORE.price;

/**
 * Fires the post-purchase conversion event for ad pixels.
 */
interface PixelWindow extends Window {
  fbq?: (type: string, eventName: string, params?: Record<string, unknown>) => void;
}

interface WaOrder {
  name?: string;
  city?: string;
  phone?: string;
  offer?: string;
}

const WA_NUMBER = "212602800548";

/**
 * Discounted price for each additional pack on the thank-you page. Kept as a
 * named constant so the upsell copy, WhatsApp message and math always agree.
 */
const UPSELL_PRICE = 149;

/**
 * LocalStorage-backed external store for the order saved by the checkout
 * form (localStorage "orderData"). Read via useSyncExternalStore so the
 * value hydrates safely (null during SSR) without setState-in-effect.
 */
let cachedSnapshot: { raw: string | null; order: WaOrder | null } | null = null;

function subscribeToStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function readOrderData(): WaOrder | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem("orderData");
  } catch {
    return null;
  }
  if (!cachedSnapshot || cachedSnapshot.raw !== raw) {
    let order: WaOrder | null = null;
    try {
      order = raw ? (JSON.parse(raw) as WaOrder) : null;
    } catch {
      order = null;
    }
    cachedSnapshot = { raw, order };
  }
  return cachedSnapshot.order;
}

/**
 * Builds the fully dynamic, itemized WhatsApp invoice. Works for any base
 * pack (from the saved order) and any combination of selected upsell packs.
 * Pack data (books + gift + price) comes from `offers` — the single source
 * of truth — so the invoice can never drift from what the site displays.
 *
 * The message is emoji-free on purpose: some mobile browsers render certain
 * emoji as broken question-mark symbols once the URL is encoded, so the
 * invoice uses plain text, dashes and bullet points instead.
 */
function buildWaMessage(
  order: WaOrder | null,
  selectedUpsells: PackConfig[]
): string {
  const packsByName = new Map(offers.map((p) => [p.packName, p]));
  const fallbackPack = packsByName.get("باك التمكين والأنوثة") ?? offers[0];

  const basePack = packsByName.get(order?.offer ?? "") ?? fallbackPack;

  const bookTitles = (pack: PackConfig) =>
    pack.books
      .filter((_, i) => i !== pack.giftBookIndex)
      .map((b) => b.title);
  const giftTitle = (pack: PackConfig) =>
    pack.books[pack.giftBookIndex].title.replace(" (هدية مجانية)", "");

  const baseBooksFormatted = bookTitles(basePack)
    .map((b) => `   - ${b}`)
    .join("\n");

  const upsellsFormattedText = selectedUpsells
    .map((upsell) => {
      const packInfo = packsByName.get(upsell.packName);
      if (!packInfo) {
        return `[باقة إضافية]: ${upsell.packName} (${UPSELL_PRICE} درهم)`;
      }
      const uBooks = bookTitles(packInfo)
        .map((b) => `     * ${b}`)
        .join("\n");
      return (
        `[باقة إضافية]: ${packInfo.packName} (${UPSELL_PRICE} درهم)\n` +
        `${uBooks}\n` +
        `     [هدية]: ${giftTitle(packInfo)}`
      );
    })
    .join("\n\n");

  const upsellsTotal = selectedUpsells.length * UPSELL_PRICE;
  const finalTotalPrice = basePack.price + upsellsTotal;

  const customerName = order?.name ?? "زباين دار الوراقة";
  const customerPhone = order?.phone || "غير محدد";
  const customerCity = order?.city ?? "المغرب";

  return (
    `مرحباً دار الوراقة، أؤكد طلبي رسمياً.\n\n` +
    `[تفاصيل الباقة الأساسية]:\n` +
    `- ${basePack.packName} (${basePack.price} درهم)\n` +
    `  الكتب المشمولة:\n` +
    `${baseBooksFormatted}\n` +
    `   [هدية مجانية]: ${giftTitle(basePack)}\n\n` +
    (selectedUpsells.length > 0
      ? `[الباقات الإضافية المختارة]:\n${upsellsFormattedText}\n\n`
      : "") +
    `[الثمن الإجمالي النهائي]: ${finalTotalPrice} درهم (+ توصيل مجاني ودفع عند الاستلام)\n\n` +
    `[معلومات العميل]:\n` +
    `- الاسم: ${customerName}\n` +
    `- الهاتف: ${customerPhone}\n` +
    `- المدينة/العنوان: ${customerCity}\n\n` +
    `أرجو تأكيد الطلب وشحن جميع الباقات معاً. شكراً لكم!`
  );
}

function fireConversion(total: number) {
  try {
    const w = window as PixelWindow;
    if (typeof w.fbq === "function") {
      w.fbq("track", "Purchase", {
        currency: "MAD",
        value: total,
        num_items: 1,
        content_name: "Dar Al Wiraqa Pack",
      });
    }
  } catch {
    /* ad tracking is non-blocking */
  }
}

export function ThankYouClient() {
  const order = useSyncExternalStore(
    subscribeToStorage,
    readOrderData,
    () => null
  );

  const [selectedUpsells, setSelectedUpsells] = useState<PackConfig[]>([]);

  const upsellCount = selectedUpsells.length;
  const upsellTotal = upsellCount * UPSELL_PRICE;
  const finalTotal = orderValue + upsellTotal;

  useEffect(() => {
    const t = setTimeout(() => fireConversion(finalTotal), 700);
    return () => clearTimeout(t);
  }, [finalTotal]);

  const alternatives = useMemo(() => {
    const purchased = order?.offer ?? null;
    return offers.filter((p) => (purchased ? p.packName !== purchased : true));
  }, [order]);

  const toggleUpsell = (pack: PackConfig) => {
    setSelectedUpsells((prev) =>
      prev.some((p) => p.slug === pack.slug)
        ? prev.filter((p) => p.slug !== pack.slug)
        : [...prev, pack]
    );
  };

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildWaMessage(order, selectedUpsells)
  )}`;

  const confirmLabel =
    upsellCount > 0
      ? `تأكيد الطلب الموحد عبر الواتساب (${finalTotal} درهم)`
      : "تأكيد الطلب عبر الواتساب";

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center p-4 bg-[#F9F9F9]"
    >
      <div className="mx-auto w-full max-w-md rounded-2xl p-8 text-center shadow-lg bg-white border border-[#E5E5E5]">
        <div className="mb-4 flex justify-center text-[#15803D]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="font-extrabold text-xl mb-2 text-[#1F2937]">
          {STORE.name} — تم استلام طلبك!
        </h1>
        <p className="text-sm text-[#4B5563] mb-1">
          شكراً لك في دار الوِراقة.
        </p>
        <p className="text-sm text-[#4B5563] mb-1">
          طلبيتك تم تسجيلها وستصلك في أقرب وقت.
        </p>
        <hr className="border-[#E5E5E5] my-4" />
        <p className="text-sm text-[#4B5563] mb-4">
          إجمالي الطلب:{" "}
          <span className="text-[#15803D] font-bold">{finalTotal} درهم</span>
          {upsellCount > 0 && (
            <span className="text-xs text-[#6B7280]">
              {" "}
              (شامل {upsellCount} باقة إضافية)
            </span>
          )}
        </p>
        <p className="text-xs text-[#6B7280] mb-6">
          برجاء إبقاء هاتفك مفتوحاً؛ سيتصل بك فريقنا خلال 24 ساعة لتأكيد الطلب.
        </p>

        {/* Post-purchase upsell — genuine value offer, not fake urgency */}
        <div className="rounded-2xl p-5 text-center border border-[#E5E5E5] bg-[#F9F9F9]">
          <h2 className="mb-1 text-sm font-extrabold text-[#1F2937]">
            أضف باقات إضافية لطلبيتك بخصم خاص
          </h2>
          <p className="mb-4 text-xs text-[#6B7280]">
            <span className="font-bold text-[#15803D]">
              {UPSELL_PRICE} درهم للباقة
            </span>{" "}
            بدلاً من{" "}
            <del className="text-[#9CA3AF]">{STORE.price} درهم</del> — بدون
            مصاريف شحن إضافية
          </p>

          <p className="mb-2 text-right text-[11px] font-bold text-[#6B7280]">
            اضغط على الباقات لإضافتها أو إزالتها (يمكنك اختيار عدة باقات):
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {alternatives.map((p) => {
              const isSelected = selectedUpsells.some(
                (s) => s.slug === p.slug
              );
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggleUpsell(p)}
                  aria-pressed={isSelected}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-right transition-all duration-200 ${
                    isSelected
                      ? "border-[#15803D] bg-white shadow-[0_0_12px_rgba(22,163,74,.15)]"
                      : "border-[#E5E5E5] bg-white hover:border-[#15803D]/60"
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-[#1F2937] leading-snug">
                      {p.packName}
                    </span>
                    <span
                      className={`block text-[10px] ${
                        isSelected
                          ? "font-bold text-[#15803D]"
                          : "text-[#9CA3AF]"
                      }`}
                    >
                      {isSelected
                        ? `✓ تمت الإضافة (+${UPSELL_PRICE} درهم)`
                        : `${UPSELL_PRICE} درهم`}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#15803D] text-[10px] font-black text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedUpsells.map((p) => (
            <div
              key={p.slug}
              className="mb-4 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] p-3 text-right last:mb-0"
            >
              <p className="mb-2 text-[11px] font-bold text-[#15803D]">
                محتوى باقة {p.packName}:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {p.books.map((b) => (
                  <div key={b.id} className="flex flex-col items-center">
                    <div className="relative h-20 w-14 overflow-hidden rounded shadow-md">
                      <BookCover
                        title={b.title}
                        src={b.coverUrl}
                        className="h-full w-full object-cover"
                      />
                      {b.gift && (
                        <span
                          className="absolute top-0 right-0 rounded px-1 text-[7px] font-black"
                          style={{ background: "#15803D", color: "#fff" }}
                        >
                          هدية
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-center text-[9px] leading-tight text-[#4B5563]">
                      {b.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {upsellCount > 0 && (
            <p className="mt-3 text-[11px] text-[#6B7280]">
              تمت إضافة{" "}
              <span className="font-bold text-[#15803D]">
                {upsellCount} باقة
              </span>{" "}
              — زر الواتساب أسفل الصفحة سيرسل فاتورة موحدة بكل الباقات.
            </p>
          )}
        </div>

        {/* Live price summary — always above the final WhatsApp button */}
        <div className="mt-5 rounded-xl border border-[#E5E5E5] bg-[#F9F9F9] px-4 py-3 text-sm text-[#4B5563]">
          <p>
            إجمالي الطلب:{" "}
            <span className="font-bold text-[#1F2937]">{orderValue} درهم</span>
            {upsellCount > 0 && (
              <>
                {" "}
                +{" "}
                <span className="font-bold text-[#1F2937]">
                  {upsellTotal} درهم
                </span>
              </>
            )}
            <span className="mx-1 text-[#9CA3AF]">=</span>
            <span className="font-black text-[#15803D]">{finalTotal} درهم</span>
          </p>
          <p className="mt-1 text-[11px] text-[#6B7280]">
            (+ توصيل مجاني — الدفع عند الاستلام)
          </p>
        </div>

        {/* Final WhatsApp confirmation button — at the bottom of the page */}
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block w-full rounded-xl bg-[#25D366] py-4 text-base font-extrabold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {confirmLabel}
        </a>

        <footer className="mt-5 text-[11px] text-[#9CA3AF]">
          {STORE.copyright}
        </footer>
      </div>
    </main>
  );
}
