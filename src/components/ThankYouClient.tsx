"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    const t = setTimeout(fireConversion, 700);
    return () => clearTimeout(t);
  }, []);

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
          href="https://wa.me/212XXXXXXXXX?text=مرحباً، أريد تأكيد طلبي من متجر دار الوراقة."
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
