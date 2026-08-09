import React, { useState } from "react";
import { PackConfig } from "@/config/psychologyPack";

interface CheckoutSectionProps {
  pack: PackConfig;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

export function CheckoutSection({ pack }: CheckoutSectionProps) {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
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

    // Prepare payload from central config
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
      address: form.address,
      message: `${pack.packName}\n${books}`,
      books: books,
      price: `${pack.price} درهم`,
      payment: "نقداً عند الاستلام",
      count: pack.books.length,
    };

    try {
      // Placeholder async — swap the URL for your real backend/API endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));
      await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {
        // Gracefully handle when /api/order is not present (e.g. static export)
        console.log("Order payload:", payload);
      });

      // Redirect to the confirmation page so ad-tracking pixels
      // (FB / TikTok / GA) fire on a fresh page load, not an alert/modal.
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
      className="mx-4 my-8 rounded-2xl bg-white shadow-2xl p-6"
    >
      <h2 className="font-bold text-center text-lg text-[#3e2723] mb-1">
        {pack.checkout.title}
      </h2>
      <p className="text-center text-xs text-[#5d4538]/70 mb-5">
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
            className="block text-[11px] font-bold text-[#3e2723] mb-1"
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
            className="w-full px-3.5 py-3 rounded-lg border border-[#eaeaea] text-sm text-[#3e2723] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            placeholder="الاسم الكامل"
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#3e2723] mb-1"
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
            className="w-full px-3.5 py-3 rounded-lg border border-[#eaeaea] text-sm text-[#3e2723] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            placeholder="06XXXXXXXX"
            inputMode="numeric"
            required
             autoComplete="tel"
           />
           <p className="text-sm text-gray-500 text-right mt-1">
             سنتصل بك في غضون 24 ساعة لتأكيد طلبك.
           </p>
         </div>

        <div>
          <label
            className="block text-[11px] font-bold text-[#3e2723] mb-1"
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
            className="w-full px-3.5 py-3 rounded-lg border border-[#eaeaea] text-sm text-[#3e2723] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            placeholder="مثال: الدار البيضاء، شارع الحسن الثاني رقم 12"
            required
            autoComplete="street-address"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-2 bg-[#d4af37] text-[#3e2723] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
