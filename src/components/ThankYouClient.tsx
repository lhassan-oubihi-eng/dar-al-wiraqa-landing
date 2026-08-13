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
 *
 * The Meta Pixel Purchase event is fired in the document <head> by the
 * thank-you page's Script (fb-pixel). The TikTok and GA4 base snippets belong
 * in the document <head> as well; their conversions are fired here with a
 * short delay so the globals have registered before we call them.
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
 *
 * The message is returned UNENCODED; the caller wraps it in
 * encodeURIComponent() exactly once so the Arabic text survives the wa.me
 * link intact.
 */
function buildWaMessage(
  order: WaOrder | null,
  selectedUpsells: PackConfig[]
): string {
  const packsByName = new Map(offers.map((p) => [p.packName, p]));
  const fallbackPack = packsByName.get("باك التمكين والأنوثة") ?? offers[0];

  // 1. Resolve the base pack from the saved order (fallback = empowerment).
  const basePack = packsByName.get(order?.offer ?? "") ?? fallbackPack;

  const bookTitles = (pack: PackConfig) =>
    pack.books
      .filter((_, i) => i !== pack.giftBookIndex)
      .map((b) => b.title);
  const giftTitle = (pack: PackConfig) =>
    pack.books[pack.giftBookIndex].title.replace(" (هدية مجانية)", "");

  // 2. Base pack book list + gift, plain-text formatting.
  const baseBooksFormatted = bookTitles(basePack)
    .map((b) => `   - ${b}`)
    .join("\n");

  // 3. Upsell pack details with their own book lists, when selected.
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

  // 4. Total price = base pack + each upsell.
  const upsellsTotal = selectedUpsells.length * UPSELL_PRICE;
  const finalTotalPrice = basePack.price + upsellsTotal;

  // 5. Customer details (fallbacks so the invoice is never blank).
  const customerName = order?.name ?? "زباين دار الوراقة";
  const customerPhone = order?.phone || "غير محدد";
  const customerCity = order?.city ?? "المغرب";

  // 6. Final message — clean text only (no emojis, no glitch-prone icons),
  //    encoded exactly once by the caller.
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
    /* Meta Purchase — dynamic value so AOV (incl. upsells) is reported */
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

  /* Fire conversion on mount and again whenever the upsell total changes,
     so AOV (base + added packs) is always reported accurately. */
  useEffect(() => {
    const t = setTimeout(() => fireConversion(finalTotal), 700);
    return () => clearTimeout(t);
  }, [finalTotal]);

  /**
   * Alternative packs for the upsell selector, excluding the one the customer
   * just purchased (matched by pack name from the saved order). Falls back to
   * showing every pack when no order data is available.
   */
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
      ? `تأكيد الطلب الموحد عبر الواتساب (${finalTotal} درهم) 💬`
      : "تأكيد الطلب عبر الواتساب 💬";

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Ad tracking pixel hook: paste your FB Pixel / TikTok / GA base
          snippets here (in the page <head> via a shared layout or _document). */}

      <div
        className="mx-auto w-full max-w-md rounded-2xl p-8 text-center shadow-2xl"
        style={{
          background: "var(--color-card)",
          color: "var(--color-ink)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="mb-4 flex justify-center text-[#16a34a]">
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

        <h1 className="font-extrabold text-xl mb-2">
          {STORE.name} — تم استلام طلبك!
        </h1>
        <p className="text-[#CDBB9C] text-sm mb-1">
          شكراً لثقتك في دار الوِراقة.
        </p>
        <p className="text-[#CDBB9C] text-sm mb-1">
          طلبيتك تم تسجيلها وستصلك في أقرب وقت.
        </p>
        <hr className="border-[#3A2E22] my-4" />
        <p className="text-sm text-[#CDBB9C] mb-4">
          إجمالي الطلب:{" "}
          <span className="text-[#16a34a] font-bold">{finalTotal} درهم</span>
          {upsellCount > 0 && (
            <span className="text-xs text-[#CDBB9C]/70">
              {" "}
              (شامل {upsellCount} باقة إضافية)
            </span>
          )}
        </p>
        <p className="text-xs text-[#CDBB9C] mb-6">
          📞 برجاء إبقاء هاتفك مفتوحاً؛ سيتصل بك فريقنا خلال 24 ساعة لتأكيد
          الطلب.
        </p>

        {/* Post-purchase upsell — interactive multi-select visual pack preview */}
        <div
          className="rounded-2xl p-5 text-center border border-[#16a34a]/40"
          style={{
            background: "linear-gradient(180deg,#FFFFFF 0%,#271F17 100%)",
            boxShadow: "0 0 20px rgba(22,163,74,.12)",
          }}
        >
          <h2 className="mb-1 text-sm font-extrabold text-[#F3E6C4]">
            🎁 أضف باقات إضافية لطلبيتك بخصم خاص
          </h2>
          <p className="mb-4 text-xs text-[#CDBB9C]">
            <span className="font-bold text-[#16a34a]">
              {UPSELL_PRICE} درهم للباقة
            </span>{" "}
            بدلاً من{" "}
            <del className="text-[#A68B69]">{STORE.price} درهم</del> — بدون
            مصاريف شحن إضافية
          </p>

          <p className="mb-2 text-right text-[11px] font-bold text-[#CDBB9C]/80">
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
                      ? "border-[#16a34a] bg-[#271F17] shadow-[0_0_12px_rgba(22,163,74,.25)]"
                                    : "border-[#3A2E22] bg-[#241D17] hover:border-[#16a34a]/60"
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-[#F3E6C4] leading-snug">
                      {p.packName}
                    </span>
                    <span
                      className={`block text-[10px] ${
                        isSelected
                          ? "font-bold text-[#16a34a]"
                          : "text-[#CDBB9C]/70"
                      }`}
                    >
                      {isSelected
                        ? `✓ تمت الإضافة (+${UPSELL_PRICE} درهم)`
                        : `${UPSELL_PRICE} درهم`}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-[10px] font-black text-white">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* X-Ray previews: 6 book covers + titles for every selected pack */}
          {selectedUpsells.map((p) => (
            <div
              key={p.slug}
                        className="mb-4 rounded-xl border border-[#3A2E22] bg-[#241D17] p-3 text-right last:mb-0"
            >
              <p className="mb-2 text-[11px] font-bold text-[#16a34a]">
                📚 محتوى باقة {p.packName}:
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
                          style={{ background: "#16a34a", color: "#fff" }}
                        >
                          هدية
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-center text-[9px] leading-tight text-[#CDBB9C]">
                      {b.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {upsellCount > 0 && (
            <p className="mt-3 text-[11px] text-[#CDBB9C]/80">
              ✅ تمت إضافة{" "}
              <span className="font-bold text-[#16a34a]">
                {upsellCount} باقة
              </span>{" "}
              — زر الواتساب أسفل الصفحة سيرسل فاتورة موحدة بكل الباقات.
            </p>
          )}
        </div>

        {/* Live price summary — always above the final WhatsApp button */}
              <div className="mt-5 rounded-xl border border-[#16a34a]/40 bg-[#241D17] px-4 py-3 text-sm text-[#CDBB9C]">
          <p>
            إجمالي الطلب:{" "}
            <span className="font-bold text-[#F3E6C4]">{orderValue} درهم</span>
            {upsellCount > 0 && (
              <>
                {" "}
                +{" "}
                <span className="font-bold text-[#F3E6C4]">
                  {upsellTotal} درهم
                </span>
              </>
            )}
            <span className="mx-1 text-[#CDBB9C]">=</span>
            <span className="font-black text-[#16a34a]">{finalTotal} درهم</span>
          </p>
          <p className="mt-1 text-[11px] text-[#CDBB9C]/70">
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

        <footer className="mt-5 text-[11px] text-[#CDBB9C]/60">
          {STORE.copyright}
        </footer>
      </div>
    </main>
  );
}
