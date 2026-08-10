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
  "w-full px-3.5 py-3 rounded-lg border border-[#3A2E22] bg-[#352922] text-sm text-[#e8e0d4] placeholder-[#cdbba9]/45 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const payload = {
      _subject: `طلب جديد من دار الوِراقة — ${pack.packName}`,
      packName: pack.packName,
      offer: pack.packName,
      name: form.name,
      phone: form.phone,
      address: form.address,
      books: books,
      price: `${pack.price} درهم`,
      payment: "نقداً عند الاستلام",
      count: pack.books.length,
    };

    // 1. Persist order locally so /thank-you knows which pack was purchased
    // (used to exclude it from the upsell selector and prefill the invoice).
    try {
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          name: form.name,
          city: form.address,
          offer: pack.packName,
        })
      );
    } catch {
      /* non-blocking */
    }

    // 2. Silent lead capture — fire-and-forget POST to /api/order which
    // relays to FormSubmit. sendBeacon survives the page navigation below,
    // so the lead is captured even if the customer bounces on /thank-you.
    const beaconBody = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    let sent = false;
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      sent = navigator.sendBeacon("/api/order", beaconBody);
    }
    if (!sent) {
      fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        console.log("Order payload:", payload);
      });
    }

    // 3. Seamless redirect — the user never sees a FormSubmit page or captcha.
    window.location.href = "/thank-you";
  };

  return (
    <section
      id="orderForm"
      className="mx-4 my-10 rounded-2xl bg-[#241D17] shadow-2xl p-6"
    >
      <h2 className="font-bold text-center text-lg text-[#e8e0d4] mb-1">
        {pack.checkout.title}
      </h2>
      <p className="text-center text-xs text-[#cdbba9]/70 mb-5">
        {pack.checkout.subtitle}
      </p>

      {error && (
        <div className="mb-3 text-center text-[11px] text-red-200 bg-[#7f1d1d]/20 border border-[#7f1d1d]/30 rounded-lg py-1.5">
          {error}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="space-y-3.5">
        <div>
          <label
            className="block text-[11px] font-bold text-[#e8e0d4] mb-1"
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
            autoComplete="name"
          />
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#e8e0d4] mb-1"
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
          <p className="text-[11px] text-[#cdbba9] text-right mt-1">
            سنتصل بك في غضون 24 ساعة لتأكيد طلبك.
          </p>
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#e8e0d4] mb-1"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-[#3e2723] bg-[#d4af37] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
            معلوماتك مشفرة ومحمية بالكامل 100%
          </span>
        </div>
      </form>
    </section>
  );
}
