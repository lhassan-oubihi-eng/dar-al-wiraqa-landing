import React, { useState } from "react";
import { PackConfig } from "@/config/psychologyPack";

interface CheckoutSectionProps {
  pack: PackConfig;
}

interface FormData {
  name: string;
  phone: string;
  city: string;
  address: string;
}

const CITY_OPTIONS = [
  "الدار البيضاء",
  "الرباط",
  "مراكش",
  "طنجة",
  "أكادير",
  "فاس",
  "مكناس",
  "وجدة",
  "سلا",
  "القنيطرة",
  "أخرى",
];

const INPUT_CLASSES =
  "w-full px-3.5 py-3 rounded-lg border border-[#3A2E22] bg-[#352922] text-sm text-[#e8e0d4] placeholder-[#cdbba9]/45 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]";

export function CheckoutSection({ pack }: CheckoutSectionProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    city: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phone || !form.address || !form.city) {
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
          `${String(b.id).padStart(3, "0")} — ${b.title} (${b.author})` +
          (i === pack.giftBookIndex ? " [هدية]" : "")
      )
      .join("\n");

    const payload = {
      _subject: `طلب جديد من دار الوِراقة — ${pack.packName}`,
      name: form.name,
      phone: form.phone,
      city: form.city,
      address: form.address,
      message: `${pack.packName} — ${form.city}\n${books}`,
      books: books,
      price: `${pack.price} درهم`,
      payment: "نقداً عند الاستلام",
      count: pack.books.length,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        console.log("Order payload:", payload);
      });

      window.location.href = "/thank-you";
    } catch {
      setError("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="orderForm"
      className="mx-4 my-8 rounded-2xl bg-[#241D17] shadow-2xl p-6"
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
            htmlFor="name"
          >
            الاسم الكامل
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className={INPUT_CLASSES}
            placeholder="محمد علي"
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
          <p className="text-sm text-[#cdbba9] text-right mt-1">
            سنتصل بك في غضون 24 ساعة لتأكيد طلبك.
          </p>
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#e8e0d4] mb-1"
            htmlFor="city"
          >
            المدينة
          </label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            className={INPUT_CLASSES}
            defaultValue=""
            required
          >
            <option value="" disabled hidden>
              اختر المدينة
            </option>
            {CITY_OPTIONS.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#e8e0d4] mb-1"
            htmlFor="address"
          >
            العنوان الكامل
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            className={INPUT_CLASSES}
            placeholder="مثال: شارع الحسن الثاني رقم 12"
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
            <span>جارٍ إرسال الطلب...</span>
          ) : (
            <span>{pack.checkout.submitText}</span>
          )}
        </button>
      </form>
    </section>
  );
}
