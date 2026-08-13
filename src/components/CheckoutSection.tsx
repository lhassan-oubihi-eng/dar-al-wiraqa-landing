import React, { useState } from "react";
import { Lock, Shield, Truck, Clock } from "lucide-react";
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
  "w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-[#F9F9F9] text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D]";

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

    const formData = {
      _subject: `طلب جديد من دار الوِراقة — ${pack.packName}`,
      _captcha: "false",
      _template: "table",
      name: form.name,
      phone: form.phone,
      city: form.address,
      offer: pack.packName,
      books,
      price: `${pack.price} درهم`,
      payment: "نقداً عند الاستلام",
      count: pack.books.length,
    };

    try {
      const w = window as unknown as { fbq?: (t: string, e: string, p?: unknown) => void };
      w.fbq?.("track", "InitiateCheckout", {
        content_name: pack.packName,
        content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
        content_type: "product_group",
        currency: "MAD",
        value: pack.price,
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

    try {
      const w = window as unknown as { fbq?: (t: string, e: string, p?: unknown) => void };
      w.fbq?.("track", "Lead", {
        currency: "MAD",
        value: pack.price,
        content_name: pack.packName,
      });
    } catch {
      /* non-blocking */
    }

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
          price: pack.price,
          count: pack.books.length,
          fbclid,
        }),
        keepalive: true,
      }).catch((err) => {
        console.error("CAPI /api/order call failed:", err);
      });
    } catch {
      /* non-blocking */
    }

    try {
      localStorage.setItem(
        "orderData",
        JSON.stringify({
          name: form.name,
          city: form.address,
          phone: form.phone,
          offer: pack.packName,
          bump: 0,
        })
      );
    } catch {
      /* non-blocking */
    }

    window.location.href = "/thank-you";
  };

  return (
    <section
      id="orderForm"
      className="mx-4 my-8 rounded-2xl bg-white shadow-lg p-6 border border-[#E5E5E5]"
    >
      <h2 className="font-bold text-center text-xl text-[#1F2937] mb-1">
        {pack.checkout.title}
      </h2>
      <p className="text-center text-sm text-[#6B7280] mb-5">
        {pack.checkout.subtitle}
      </p>

      {/* Trust badges — below heading, above form */}
      <div className="mb-5 flex justify-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-1 text-[#15803D]">
          <Shield size={14} />
          الدفع عند الاستلام
        </span>
        <span className="flex items-center gap-1 text-[#15803D]">
          <Truck size={14} />
          توصيل مجاني
        </span>
        <span className="flex items-center gap-1 text-[#15803D]">
          <Clock size={14} />
          استلامك في 24-48 ساعة
        </span>
      </div>

      {/* Simple order total — strictly the base pack price */}
      <div className="mb-5 rounded-xl bg-[#F9F9F9] p-3.5 text-center">
        <span className="text-sm text-[#6B7280]">المجموع</span>
        <span className="ml-2 text-xl font-extrabold text-[#1F2937]">
          {pack.price} درهم
        </span>
        <span className="text-xs text-[#6B7280]">
          {" "}
          — {pack.feminine
            ? "الدفع عند الاستلام بلا أي رسوم"
            : "الدفع عند الاستلام بلا أي رسوم"}
        </span>
      </div>

      {error && (
        <div className="mb-3 text-center text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-lg py-1.5">
          {error}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="space-y-4">
        <div>
          <label
            className="block text-[11px] font-bold text-[#1F2937] mb-1"
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
            className="block text-[11px] font-bold text-[#1F2937] mb-1"
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
          <p className="text-[11px] text-[#6B7280] text-right mt-1">
            {pack.feminine
              ? "سنتصل بكِ في غضون 24 ساعة لتأكيد طلبكِ."
              : "سنتصل بك في غضون 24 ساعة لتأكيد طلبك."}
          </p>
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#1F2937] mb-1"
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
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-lg text-white bg-[#15803D] hover:bg-[#16a34a] active:scale-[0.98] transition-all duration-200 disabled:opacity-70"
        >
          {isSubmitting ? (
            <span>جاري تأكيد الطلب...</span>
          ) : (
            <span>{pack.checkout.submitText}</span>
          )}
        </button>

        <div className="flex justify-center items-center gap-1 mt-3">
          <Lock size={14} className="text-[#9CA3AF]" />
          <span className="text-xs text-[#9CA3AF]">
            {pack.feminine
              ? "معلوماتكِ مشفرة ومحمية بالكامل 100%"
              : "معلوماتك مشفرة ومحمية بالكامل 100%"}
          </span>
        </div>
      </form>
    </section>
  );
}
