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
  ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  gtag?: (event: string, name: string, params?: Record<string, unknown>) => void;
}

interface WaOrder {
  name?: string;
  city?: string;
  offer?: string;
}

const WA_NUMBER = "212602800548";

/**
 * Discounted price for adding a second pack on the thank-you page. Kept as a
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
 * Pre-fills the WhatsApp confirmation message with the order saved by the
 * checkout form (localStorage "orderData"). If the customer added a second
 * pack via the visual upsell selector, it compiles one unified invoice with
 * both orders so operations can ship them together in a single package.
 */
function buildWaMessage(
  order: WaOrder | null,
  addedPack: PackConfig | null
): string {
  if (!order && !addedPack) return "مرحباً دار الوراقة، أؤكد طلبي رسمياً. 📦";

  if (addedPack) {
    return [
      "مرحباً دار الوراقة، أؤكد طلبي رسمياً. 📦",
      "",
      "📌 الطلب الأساسي:",
      `- الباقة الأولى: ${order?.offer ?? "-"} (${orderValue} درهم)`,
      "",
      "🔥 الباقة الإضافية المختارة:",
      `- الباقة الثانية: ${addedPack.packName} (${UPSELL_PRICE} درهم)`,
      `- الإجمالي الكلي: ${orderValue + UPSELL_PRICE} درهم (+ توصيل مجاني)`,
      "",
      "👤 معلومات العميل:",
      `- الاسم: ${order?.name ?? "-"}`,
      `- المدينة/العنوان: ${order?.city ?? "-"}`,
      "",
      "أرجو تأكيد الطلب وشحنه معاً. شكراً لكم!",
    ].join("\n");
  }

  return [
    "مرحباً دار الوراقة، أؤكد طلبي رسمياً. 📦",
    "",
    "📌 تفاصيل الطلب:",
    `- الباقة: ${order?.offer ?? "-"}`,
    `- السعر: ${orderValue} درهم`,
    "",
    "👤 معلومات العميل:",
    `- الاسم: ${order?.name ?? "-"}`,
    `- المدينة/العنوان: ${order?.city ?? "-"}`,
    "",
    "أرجو تأكيد الطلب وشحنه. شكراً لكم!",
  ].join("\n");
}

function fireConversion() {
  try {
    const w = window as PixelWindow;
    if (w.ttq && typeof w.ttq.track === "function") {
      w.ttq.track("CompletePayment", { currency: "MAD", value: orderValue });
    }
    if (typeof w.gtag === "function") {
      w.gtag("event", "purchase", {
        currency: "MAD",
        value: orderValue,
        transaction_id: "dar-alwiraqa-order",
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

  const [selectedPack, setSelectedPack] = useState<PackConfig | null>(null);
  const [addedPack, setAddedPack] = useState<PackConfig | null>(null);

  useEffect(() => {
    const t = setTimeout(fireConversion, 700);
    return () => clearTimeout(t);
  }, []);

  /**
   * Alternative packs for the upsell selector, excluding the one the customer
   * just purchased (matched by pack name from the saved order). Falls back to
   * showing every pack when no order data is available.
   */
  const alternatives = useMemo(() => {
    const purchased = order?.offer ?? null;
    return offers.filter((p) => (purchased ? p.packName !== purchased : true));
  }, [order]);

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildWaMessage(order, addedPack)
  )}`;

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
        <div className="mb-4 flex justify-center text-[#d4af37]">
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
        <p className="text-[#cdbba9]/85 text-sm mb-1">
          شكراً لثقتك في دار الوِراقة.
        </p>
        <p className="text-[#cdbba9]/85 text-sm mb-1">
          طلبيتك تم تسجيلها وستصلك في أقرب وقت.
        </p>
        <hr className="border-[#3A2E22] my-4" />
        <p className="text-sm text-[#cdbba9] mb-4">
          إجمالي الطلب:{" "}
          <span className="text-[#d4af37] font-bold">{orderValue} درهم</span>
          {addedPack && (
            <>
              {" "}
              + {UPSELL_PRICE} درهم ={" "}
              <span className="text-[#d4af37] font-bold">
                {orderValue + UPSELL_PRICE} درهم
              </span>
            </>
          )}
        </p>
        <p className="text-xs text-[#cdbba9]/70 mb-6">
          📞 برجاء إبقاء هاتفك مفتوحاً؛ سيتصل بك فريقنا خلال 24 ساعة لتأكيد
          الطلب.
        </p>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full rounded-xl bg-[#25D366] py-4 text-base font-extrabold text-white transition-transform hover:scale-[1.02]"
        >
          {addedPack
            ? "تأكيد الطلبين عبر الواتساب 💬"
            : "تأكيد الطلب عبر الواتساب (تسريع الشحن) 💬"}
        </a>

        {/* Post-purchase upsell — interactive visual pack preview */}
        <div
          className="mt-6 rounded-2xl p-5 text-center"
          style={{
            background: "linear-gradient(180deg,#2E251C 0%,#241D17 100%)",
            border: "1px solid rgba(212,175,55,.6)",
            boxShadow: "0 0 20px rgba(212,175,55,.15)",
          }}
        >
          <h2 className="mb-1 text-sm font-extrabold text-[#e8e0d4]">
            🎁 أضف باك ثاني لطلبيتك بخصم خاص
          </h2>
          <p className="mb-4 text-xs text-[#cdbba9]">
            <span className="font-bold text-[#d4af37]">
              {UPSELL_PRICE} درهم فقط
            </span>{" "}
            بدلاً من{" "}
            <del className="text-[#cdbba9]/50">{STORE.price} درهم</del> — بدون
            مصاريف شحن إضافية
          </p>

          <p className="mb-2 text-right text-[11px] font-bold text-[#cdbba9]/80">
            اختر الباقة التي تريد إضافتها:
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {alternatives.map((p) => {
              const isSelected = selectedPack?.slug === p.slug;
              const isAdded = addedPack?.slug === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setSelectedPack(p)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-right transition-all duration-200 ${
                    isSelected
                      ? "border-[#d4af37] bg-[#3a2e1f]"
                      : "border-[#3A2E22] bg-[#2B241C] hover:border-[#d4af37]/60"
                  }`}
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold text-[#e8e0d4] leading-snug">
                      {p.packName}
                    </span>
                    <span className="block text-[10px] text-[#cdbba9]/70">
                      {isAdded
                        ? "✓ تمت الإضافة"
                        : `${UPSELL_PRICE} درهم`}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* X-Ray preview: 6 book covers + titles of the selected pack */}
          {selectedPack && (
            <div className="mb-4 rounded-xl border border-[#3A2E22] bg-[#1d1712] p-3 text-right">
              <p className="mb-2 text-[11px] font-bold text-[#d4af37]">
                📚 محتوى باقة {selectedPack.packName}:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {selectedPack.books.map((b) => (
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
                          style={{ background: "#d4af37", color: "#3e2723" }}
                        >
                          هدية
                        </span>
                      )}
                    </div>
                    <span className="mt-1 text-center text-[9px] leading-tight text-[#cdbba9]/85">
                      {b.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add button — revealed once a pack is selected */}
          {selectedPack && (
            <button
              type="button"
              onClick={() => setAddedPack(selectedPack)}
              className="w-full rounded-xl bg-[#d4af37] py-3.5 px-4 text-sm font-extrabold text-[#3e2723] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              أضف هذه الباقة لطلبيتي بـ {UPSELL_PRICE} درهم 🚀
            </button>
          )}

          {addedPack && (
            <p className="mt-3 text-[11px] text-[#cdbba9]/80">
              ✅ تمت إضافة{" "}
              <span className="font-bold text-[#e8e0d4]">
                {addedPack.packName}
              </span>{" "}
              — اضغط زر الواتساب الأخضر أعلاه لإرسال الفاتورة الموحدة.
            </p>
          )}
        </div>

        <footer className="mt-6 text-[11px] text-[#cdbba9]/60">
          {STORE.copyright}
        </footer>
      </div>
    </main>
  );
}
