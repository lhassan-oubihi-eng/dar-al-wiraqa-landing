"use client";

import { useState, FormEvent } from "react";
import { PackConfig } from "@/data/offers";

const PHONE_RE = /^(06|07)\d{8}$/;

interface CheckoutFormProps {
  pack: PackConfig;
  onSuccess: () => void;
}

export function CheckoutForm({ pack, onSuccess }: CheckoutFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phone || !form.city || !form.address) {
      setError("رجاءً املأ جميع الحقول.");
      return;
    }
    if (!PHONE_RE.test(form.phone)) {
      setError("أدخل رقم هاتف صحيح يبدأ بـ 06 أو 07.");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        name: form.name,
        phone: form.phone,
        city: form.city,
        address: form.address,
        offer: pack.packName,
        price: pack.price,
        fbclid:
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("fbclid") ?? ""
            : "",
      };

      localStorage.setItem("orderData", JSON.stringify(orderData));

      const w = window as unknown as {
        fbq?: (type: string, eventName: string, params?: Record<string, unknown>) => void;
      };
      if (typeof w.fbq === "function") {
        w.fbq("track", "Purchase", {
          currency: "MAD",
          value: pack.price,
          num_items: 1,
          content_name: pack.packName,
        });
        console.log(" Meta Pixel Purchase event fired!", { value: pack.price, currency: "MAD" });
      }

      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? "خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setSubmitting(false);
    }
  };

  return (
    <section
      id="checkout"
      className="mx-auto max-w-2xl px-4 py-10 scroll-mt-20"
      aria-labelledby="checkout-title"
    >
      <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h2 id="checkout-title" className="text-2xl font-extrabold text-[#1F2937]">
            إتمام الطلب — {pack.packName}
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            {pack.checkout.subtitle}
          </p>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block mb-1 text-sm font-medium text-[#374151]"
            >
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-base text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-none transition"
              placeholder="مثال: محمد علي"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1 text-sm font-medium text-[#374151]"
            >
              رقم الهاتف (يبدأ بـ 06 أو 07) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-base text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-none transition"
              placeholder="مثال: 0612345678"
              disabled={submitting}
              maxLength={10}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block mb-1 text-sm font-medium text-[#374151]"
            >
              المدينة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              autoComplete="address-level2"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-base text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-none transition"
              placeholder="مثال: الدار البيضاء"
              disabled={submitting}
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block mb-1 text-sm font-medium text-[#374151]"
            >
              العنوان بالتفصيل (الشارع، الحي، رقم المنزل/الشقة) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              autoComplete="street-address"
              required
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-base text-[#1F2937] placeholder-[#9CA3AF] focus:border-[#15803D] focus:ring-2 focus:ring-[#15803D]/20 outline-none transition resize-none"
              placeholder="مثال: شارع الحسن الثاني، حي الأمل، رقم 45، الطابق 2، شقة 3"
              disabled={submitting}
            />
          </div>

          <div className="rounded-xl bg-[#F0FDF4] p-4 text-center border border-[#BBF7D0]">
            <p className="text-sm text-[#15803D] font-medium">
              <span className="font-extrabold">{pack.price} درهم</span> شامل التوصيل
            </p>
            <p className="mt-1 text-xs text-[#15803D]">
              الدفع نقداً عند الاستلام — لا تدفع شيئاً حتى تستلم طلبك
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-[#15803D] text-white font-extrabold text-lg transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "جاري التأكيد..." : pack.checkout.submitText}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[#9CA3AF]">
          بالضغط على الزر أعلاه، أنت تؤكد طلبك وتوافق على تواصل فريقنا معك خلال 24 ساعة.
        </p>
      </div>
    </section>
  );
}