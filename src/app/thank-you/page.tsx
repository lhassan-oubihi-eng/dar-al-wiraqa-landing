"use client";

import { useEffect } from "react";
import { psychologyPack } from "@/config/psychologyPack";

export const metadata = {
  title: "تم استلام طلبك — دار الوِراقة",
  description: "شكراً لطلبك من دار الوراقة. سيتصل بك فريقنا لتأكيد الطلب.",
};

const orderValue = psychologyPack.price;

/**
 * Fires the post-purchase / post-lead conversion event for ad pixels.
 * The pixel base snippets (FB / TikTok / GA) are injected by your global
 * layout/_document (or dropped into the placeholder below) so they exist as
 * globals before this redirect target renders. Running on a fresh page load
 * (the form redirects here) guarantees the conversion is attributed correctly.
 */
function fireConversion() {
  try {
    const w = window as any;
    if (typeof w.fbq === "function") {
      w.fbq("track", "Purchase", { value: orderValue, currency: "MAD" });
    }
    if (w.ttq && typeof w.ttq.track === "function") {
      w.ttq.track("CompletePayment", { value: orderValue, currency: "MAD" });
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

export default function ThankYouPage() {
  useEffect(() => {
    // Allow external pixel base scripts a tick to register globals.
    const t = setTimeout(fireConversion, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center p-4"
      style={{ background: "var(--color-paper)" }}
    >
      {/* Ad tracking pixel hook: place your FB/TikTok/GA base snippets here. */}

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
          {psychologyPack.packName} — تم استلام طلبك!
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
          href="/"
          className="inline-block w-full rounded-xl bg-[#d4af37] py-3 font-extrabold text-[#3e2723] transition-transform hover:scale-[1.02]"
        >
          العودة إلى المتجر
        </a>

        <footer className="mt-6 text-[11px] text-[#cdbba9]/60">
          {psychologyPack.footer.copyright}
        </footer>
      </div>
    </main>
  );
}
