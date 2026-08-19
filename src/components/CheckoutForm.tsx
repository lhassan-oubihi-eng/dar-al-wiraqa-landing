"use client";

import { useState, FormEvent } from "react";
import { PackConfig } from "@/data/offers";
import { ShoppingCart, Truck, User, Phone, MapPin } from "lucide-react";

interface CheckoutFormProps {
  pack: PackConfig;
  onSuccess: () => void;
}

export function CheckoutForm({ pack, onSuccess }: CheckoutFormProps) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        name: form.name,
        phone: form.phone,
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
        console.error(message);
        setSubmitting(false);
      }
  };

  return (
    <section
      id="checkout"
      className="mx-auto max-w-2xl px-4 py-10 scroll-mt-20"
      aria-labelledby="checkout-title"
    >
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-6 md:p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h2 id="checkout-title" className="text-2xl md:text-3xl font-black text-gray-900">
            إتمام الطلب — {pack.packName}
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label
              htmlFor="name"
              className="block mb-1.5 text-lg font-bold text-[#111827]"
            >
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/20 transition-all bg-white">
              <div className="bg-gray-100 border-l border-[#D1D5DB] px-3 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                autoComplete="name"
                required
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="الاسم الكامل"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block mb-1.5 text-lg font-bold text-[#111827]"
            >
              رقم الهاتف (الواتساب) <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/20 transition-all bg-white">
              <div className="bg-gray-100 border-l border-[#D1D5DB] px-3 flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                autoComplete="tel"
                required
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="رقم الهاتف (الواتساب)"
                disabled={submitting}
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block mb-1.5 text-lg font-bold text-[#111827]"
            >
              المدينة والحَيّ (أو العنوان بالتفصيل) <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-[#D1D5DB] focus-within:border-[#047857] focus-within:ring-2 focus-within:ring-[#047857]/20 transition-all bg-white">
              <div className="bg-gray-100 border-l border-[#D1D5DB] px-3 flex items-start pt-3.5 justify-center">
                <MapPin className="w-5 h-5 text-gray-400" />
              </div>
              <textarea
                id="address"
                name="address"
                autoComplete="street-address"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none resize-none"
                placeholder="المدينة والحَيّ (أو العنوان بالتفصيل)"
                disabled={submitting}
              />
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

            <p className="text-center text-xs font-bold text-[#047857] mb-3 flex items-center justify-center gap-1">
            <span aria-hidden>⭐⭐⭐⭐⭐</span>
            <span>{pack.trustLine}</span>
          </p>

          <button
            type="submit"
            disabled={submitting}
              className="w-full bg-[#047857] text-white font-extrabold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-6 h-6 shrink-0" />
              <span>{submitting ? "جاري التأكيد..." : pack.ctaText}</span>
          </button>
        </form>
      </div>
    </section>
  );
}