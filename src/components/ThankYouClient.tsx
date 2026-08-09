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
 * exact pack, name and city with zero typing.
 */
function buildWaMessage(order: WaOrder | null): string {
  const base = "مرحباً دار الوراقة، أؤكد طلبي.";
  if (!order) return base;
  return [
    base,
    `الباقة: ${order.offer ?? "-"}`,
    `الاسم: ${order.name ?? "-"}`,
    `المدينة/العنوان: ${order.city ?? "-"}`,
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

        <footer className="mt-6 text-[11px] text-[#cdbba9]/60">
          {STORE.copyright}
        </footer>
      </div>
    </main>
  );
}
