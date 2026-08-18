"use client";

import { useState, FormEvent } from "react";
import { PackConfig } from "@/data/offers";
import { ShoppingBag, PackageCheck, Truck, ShieldCheck, CheckCircle2, User, Phone, MapPin } from "lucide-react";

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
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      setError(message);
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
          <h2 id="checkout-title" className="text-2xl md:text-3xl font-black text-gray-900">
            إتمام الطلب — {pack.packName}
          </h2>
          <p className="mt-2 text-base text-[#6B7280]">
            {pack.checkout.subtitle}
          </p>
        </div>

        {/* Honest offer banner (no fake scarcity) */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4 text-right shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
              <Truck className="w-5 h-5 text-emerald-700"/>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 text-sm md:text-base">
                توصيل مجاني + الدفع عند الاستلام
              </h4>
              <p className="text-xs md:text-sm text-emerald-700 font-medium mt-0.5">
                {pack.price} درهم فقط — لا تدفع شيئاً حتى تستلم طلبك
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block mb-1.5 text-lg font-bold text-[#374151]"
            >
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#15803D] focus-within:ring-2 focus-within:ring-[#15803D]/20 transition-all bg-white">
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
                placeholder="مثال: محمد علي"
                disabled={submitting}
              />
              <div className="bg-gray-50 border-l border-[#D1D5DB] px-3 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1.5 text-lg font-bold text-[#374151]"
            >
              رقم الهاتف (يبدأ بـ 06 أو 07) <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#15803D] focus-within:ring-2 focus-within:ring-[#15803D]/20 transition-all bg-white">
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                required
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
                placeholder="مثال: 0612345678"
                disabled={submitting}
                maxLength={10}
              />
              <div className="bg-gray-50 border-l border-[#D1D5DB] px-3 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="city"
              className="block mb-1.5 text-lg font-bold text-[#374151]"
            >
              المدينة <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#15803D] focus-within:ring-2 focus-within:ring-[#15803D]/20 transition-all bg-white">
              <input
                type="text"
                id="city"
                name="city"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
                placeholder="مثال: الدار البيضاء"
                disabled={submitting}
              />
              <div className="bg-gray-50 border-l border-[#D1D5DB] px-3 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block mb-1.5 text-lg font-bold text-[#374151]"
            >
              العنوان بالتفصيل (الشارع، الحي، رقم المنزل/الشقة) <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#15803D] focus-within:ring-2 focus-within:ring-[#15803D]/20 transition-all bg-white">
              <textarea
                id="address"
                name="address"
                autoComplete="street-address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none resize-none"
                placeholder="مثال: شارع الحسن الثاني، حي الأمل، رقم 45، الطابق 2، شقة 3"
                disabled={submitting}
              />
              <div className="bg-gray-50 border-l border-[#D1D5DB] px-3 flex items-start pt-3.5 justify-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl mb-4">
            <span className="font-semibold text-gray-700 text-sm md:text-base">ثمن الباقة</span>
            <span className="font-bold text-emerald-700 text-base md:text-lg">{pack.price} درهم</span>
          </div>

          <div className="rounded-xl bg-[#F0FDF4] p-4 text-center border border-[#BBF7D0] mb-5">
            <p className="text-sm text-[#15803D]">
              الدفع نقداً عند الاستلام — لا تدفع شيئاً حتى تستلم طلبك
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>{submitting ? "جاري التأكيد..." : pack.checkout.submitText}</span>
            <ShoppingBag className="w-6 h-6 shrink-0" />
          </button>
        </form>

        {/* Lucide Trust Badges — 2x2 compact grid */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 pt-4 border-t border-gray-100 text-right text-xs">
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-lg text-emerald-900">
            <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span><strong>معاينة قبل الدفع</strong></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
            <Truck className="w-5 h-5 text-gray-600 shrink-0" />
            <span><strong>توصيل 24-48 ساعة</strong></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span><strong>ضمان استرجاع 14 يوماً</strong></span>
          </div>
          <div className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span><strong>طباعة فاخرة</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}