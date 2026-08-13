import React, { useState } from "react";
import { Lock } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface CheckoutSectionProps {
  pack: PackConfig;
  namePlaceholder?: string;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

const INPUT_CLASSES =
    "w-full px-3.5 py-3 rounded-lg border border-[#3A2E22] bg-[#2C1B16] text-sm text-[#F3E6C4] placeholder-[#A68B69] focus:outline-none focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a]";

export function CheckoutSection({
  pack,
  namePlaceholder = "محمد علي",
}: CheckoutSectionProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bump, setBump] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phone || !form.address) {
      setError("رجاءً املأ جميع الحقول.");
      return;
    }

    if (!/^(06|07)\d{8}$/.test(form.phone)) {
      setError("أدخل رقم هاتف صحيح يبدأ بـ 06 أو 07.");
      return;
    }

    setIsSubmitting(true);

    const books = pack.books
      .map(
        (b, i) =>
          `${String(b.id).padStart(3, "0")} — ${b.title}` +
          (i === pack.giftBookIndex ? " [هدية]" : "")
      )
      .join("\n");

    // Silent lead capture — POST directly to FormSubmit's AJAX endpoint from
    // the browser. This is the reliable path: the browser automatically sends
    // the Origin header FormSubmit requires (server-to-server relays get
    // blocked as spam). The AJAX endpoint returns JSON and never shows a
    // "Thank You" page or captcha. keepalive:true lets the request finish
    // even though we redirect immediately below.
    const greedyAdd = bump
      ? `${pack.giftBookIndex >= 0 ? "\n" : ""}[➕ باقة إضافية بسعر مخفض: 49 درهم]`
      : "";
    const formData = {
      _subject: `طلب جديد من دار الوِراقة — ${pack.packName}`,
      _captcha: "false",
      _template: "table",
      name: form.name,
      phone: form.phone,
      city: form.address,
      offer: pack.packName,
      books: books + greedyAdd,
      price: `${pack.price} درهم` + (bump ? ` + 49 درهم (باقة إضافية)` : ""),
      payment: "نقداً عند الاستلام",
      count: pack.books.length + (bump ? 1 : 0),
    };

    // Track a "started checkout" event for retargeting (Meta).
    try {
      const w = window as unknown as { fbq?: (t: string, e: string, p?: unknown) => void };
      w.fbq?.("track", "InitiateCheckout", {
        content_name: pack.packName,
        content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
        content_type: "product_group",
        currency: "MAD",
        value: pack.price + (bump ? 49 : 0),
      });
    } catch {
      /* non-blocking */
    }

    fetch("https://formsubmit.co/ajax/lhossainoubihi1@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
      keepalive: true,
    }).catch((err) => {
      console.error("FormSubmit direct send failed:", err);
    });

    // Fire a browser "Lead" event too — Meta can optimise on qualified intent
    // (form submit) while purchase-volume is still low for COD.
    try {
      const w = window as unknown as { fbq?: (t: string, e: string, p?: unknown) => void };
      w.fbq?.("track", "Lead", {
        currency: "MAD",
        value: pack.price + (bump ? 49 : 0),
        content_name: pack.packName,
      });
    } catch {
      /* non-blocking */
    }

    // Server-side call to /api/order for the Meta Conversions API (CAPI) —
    // recovers conversions lost to iOS ATT / ad-blockers. Uses keepalive so it
    // survives the hard redirect to /thank-you below.
    const fbclid = new URLSearchParams(window.location.search).get("fbclid") ?? "";
    try {
      fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          packName: pack.packName,
          books,
          price: pack.price + (bump ? 49 : 0),
          count: pack.books.length + (bump ? 1 : 0),
          fbclid,
        }),
        keepalive: true,
      }).catch((err) => {
        console.error("CAPI /api/order call failed:", err);
      });
    } catch {
      /* non-blocking */
    }

    // 1. Persist order locally so /thank-you knows which pack was purchased
    // (used to exclude it from the upsell selector and prefill the invoice).
    try {
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          name: form.name,
          city: form.address,
          phone: form.phone,
          offer: pack.packName,
          bump: bump ? 49 : 0,
        })
      );
    } catch {
      /* non-blocking */
    }

    // 2. Seamless redirect — the user never sees a FormSubmit page or captcha.
    window.location.href = "/thank-you";
  };

  return (
    <section
      id="orderForm"
            className="mx-4 my-10 rounded-2xl bg-[#241D17] shadow-xl p-6 border border-[#3A2E22]"
    >
      <h2 className="font-bold text-center text-lg text-[#F3E6C4] mb-1">
        {pack.checkout.title}
      </h2>
      <p className="text-center text-xs text-[#CDBB9C]/80 mb-5">
        {pack.checkout.subtitle}
      </p>

      {error && (
        <div className="mb-3 text-center text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg py-1.5">
          {error}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="space-y-3.5">
        <div>
          <label
            className="block text-[11px] font-bold text-[#F3E6C4] mb-1"
            htmlFor="nameInput"
          >
            الاسم الكامل
          </label>
          <input
            id="nameInput"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={INPUT_CLASSES}
            placeholder={namePlaceholder}
            required
            autoFocus
            autoComplete="name"
          />
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#F3E6C4] mb-1"
            htmlFor="phone"
          >
            رقم الهاتف
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={INPUT_CLASSES}
            placeholder="06XXXXXXXX"
            inputMode="numeric"
            required
            autoComplete="tel"
          />
          <p className="text-[11px] text-[#CDBB9C] text-right mt-1">
            {pack.feminine
              ? "سنتصل بكِ في غضون 24 ساعة لتأكيد طلبكِ."
              : "سنتصل بك في غضون 24 ساعة لتأكيد طلبك."}
          </p>
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#F3E6C4] mb-1"
            htmlFor="address"
          >
            المدينة والعنوان الكامل
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className={INPUT_CLASSES}
            placeholder="مثال: الدار البيضاء، شارع الحسن الثاني رقم 12"
            required
            autoComplete="street-address"
          />
        </div>

        {/* Order bump: cheap add-on to raise average order value */}
        <div className="rounded-xl border border-[#16a34a]/40 bg-[#271F17] p-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={bump}
              onChange={(e) => setBump(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#16a34a] focus:ring-[#16a34a]"
            />
            <span className="text-left text-[12px] leading-snug text-[#F3E6C4]">
              🎁 <span className="font-bold">أضف باقة ثانية بخصم خاص</span> —{" "}
              <span className="font-bold text-[#16a34a]">فقط 49 درهم</span>{" "}
              <span className="text-[#A68B69] line-through">(عوض 199 درهم)</span>
              <br />
              <span className="text-[10px] text-[#CDBB9C]">
                تصلك كلتا الباقتين معاً والتوصيل لا يزال مجانياً.
              </span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-[#16a34a] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{ opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? (
            <span>جاري تأكيد الطلب...</span>
          ) : (
            <span>{pack.checkout.submitText}</span>
          )}
        </button>

        <div className="flex justify-center items-center gap-1 mt-3">
          <Lock size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500">
            {pack.feminine
              ? "معلوماتكِ مشفرة ومحمية بالكامل 100%"
              : "معلوماتك مشفرة ومحمية بالكامل 100%"}
          </span>
        </div>
      </form>
    </section>
  );
}
