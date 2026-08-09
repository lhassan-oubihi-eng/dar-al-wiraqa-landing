"use client";

import { useEffect, useSyncExternalStore } from "react";
import { STORE } from "@/data/offers";

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
const UPSELL_PRICE = 120;

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
 * checkout form (localStorage "orderData"), so the customer confirms the
 * exact pack, price, name and city with zero typing.
 */
function buildWaMessage(order: WaOrder | null): string {
  if (!order) return "مرحباً دار الوراقة، أؤكد طلبي رسمياً. 📦";
  return [
    "مرحباً دار الوراقة، أؤكد طلبي رسمياً. 📦",
    "",
    "📌 تفاصيل الطلب:",
    `- الباقة: ${order.offer ?? "-"}`,
    `- السعر: ${orderValue} درهم`,
    "",
    "👤 معلومات العميل:",
    `- الاسم: ${order.name ?? "-"}`,
    `- المدينة/العنوان: ${order.city ?? "-"}`,
    "",
    "أرجو تأكيد الطلب وشحنه. شكراً لكم!",
  ].join("\n");
}

/**
 * Pre-fills the WhatsApp upgrade message for the post-purchase upsell. It
 * carries the original order context (pack, name, city) plus the second-pack
 * request at the discounted rate, so the operations team can append it to the
 * same shipment without asking the customer anything.
 */
function buildUpsellMessage(order: WaOrder | null): string {
  return [
    "مرحباً دار الوراقة، أريد إضافة باك ثاني لطلبي. 🎁",
    "",
    "📌 طلبي الحالي:",
    `- الباقة: ${order?.offer ?? "-"}`,
    `- الاسم: ${order?.name ?? "-"}`,
    `- المدينة/العنوان: ${order?.city ?? "-"}`,
    "",
    "✨ أطلب إضافة باك ثاني:",
    `- بـ ${UPSELL_PRICE} درهم فقط`,
    "- بدون مصاريف شحن إضافية",
    "",
    "أرجو إضافة الباك الثاني لنفس الطلب وتأكيده. شكراً لكم!",
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

  useEffect(() => {
    const t = setTimeout(fireConversion, 700);
    return () => clearTimeout(t);
  }, []);

  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildWaMessage(order)
  )}`;

  const upsellHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    buildUpsellMessage(order)
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
          تأكيد الطلب عبر الواتساب (تسريع الشحن) 💬
        </a>

        {/* Post-purchase upsell — second pack at a discounted rate */}
        <div
          className="mt-6 rounded-2xl p-5 text-center"
          style={{
            background: "linear-gradient(180deg,#2E251C 0%,#241D17 100%)",
            border: "1px solid rgba(212,175,55,.6)",
            boxShadow: "0 0 20px rgba(212,175,55,.15)",
          }}
        >
          <span
            className="mb-3 inline-block rounded-full px-3 py-1 text-[10px] font-black text-[#3e2723]"
            style={{ background: "#d4af37" }}
          >
            عرض خاص لطلبك 🎁
          </span>
          <p className="mb-1 text-sm font-extrabold text-[#e8e0d4]">
            أضف باك ثاني بـ{" "}
            <span className="text-[#d4af37]">{UPSELL_PRICE} درهم</span> فقط
          </p>
          <p className="mb-3 text-xs text-[#cdbba9]">
            بدون مصاريف شحن إضافية — كتب مختارة بعناية تصلك مع نفس الطلب
          </p>
          <p className="mb-4 text-xs text-[#cdbba9]/70">
            <del className="text-[#cdbba9]/50">قيمة الباك {STORE.price} درهم</del>
            <span className="mr-2 font-bold text-[#d4af37]">
              وفّر {STORE.price - UPSELL_PRICE} درهم
            </span>
          </p>
          <a
            href={upsellHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-xl bg-[#d4af37] py-4 text-base font-extrabold text-[#3e2723] transition-transform hover:scale-[1.02]"
          >
            نعم، أريد الباك الثاني بخصم 💬
          </a>
          <p className="mt-3 text-[11px] text-[#cdbba9]/70">
            سيُضاف لنفس طلبك عند اتصال فريقنا بك لتأكيد الطلب.
          </p>
        </div>

        <footer className="mt-6 text-[11px] text-[#cdbba9]/60">
          {STORE.copyright}
        </footer>
      </div>
    </main>
  );
}
