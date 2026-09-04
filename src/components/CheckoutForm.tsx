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
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "المرجو إدخال الاسم الكامل";
    if (!form.phone.trim()) e.phone = "المرجو إدخال رقم الهاتف";
    else if (!/^(06|07)\d{8}$/.test(form.phone.trim())) e.phone = "رقم غير صالح — يجب أن يبدأ بـ 06 أو 07 ويتكون من 10 أرقام";
    if (!form.address.trim() || form.address.trim().length < 4) e.address = "المرجو إدخال العنوان الكامل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
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
        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-5 md:p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h2 id="checkout-title" className="text-2xl md:text-3xl font-black text-gray-900">
            إتمام الطلب — {pack.packName}
          </h2>
        </div>

        {/* Honest offer banner (no fake scarcity) */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-4 text-right shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gray-100 text-[#1E3A8A] rounded-lg shrink-0">
              <Truck className="w-5 h-5 text-[#1E3A8A]"/>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm md:text-base">
                الدفع عند الاستلام
              </h4>
              <p className="text-xs md:text-sm text-[#1E3A8A] font-medium mt-0.5">
                {pack.price} درهم فقط — لا تدفع شيئاً حتى تستلم طلبك
              </p>
            </div>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label
                htmlFor="name"
                className="block mb-1.5 text-lg font-bold text-[#1E3A8A]"
              >
                الاسم <span className="text-red-500">*</span>
              </label>
              <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.name ? "border-red-500 ring-2 ring-red-500/20" : "border-[#D1D5DB] focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
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
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if(errors.name) setErrors(prev=>({...prev, name: undefined})); }}
                  aria-invalid={!!errors.name}
                  className="w-full px-4 py-4 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                   placeholder="الاسم"
                  disabled={submitting}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.name}</p>}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block mb-1.5 text-lg font-bold text-[#1E3A8A]"
              >
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.phone ? "border-red-500 ring-2 ring-red-500/20" : "border-[#D1D5DB] focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
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
                  onChange={(e) => { const v=e.target.value.replace(/\D/g,"").slice(0,10); setForm({ ...form, phone: v }); if(errors.phone) setErrors(prev=>({...prev, phone: undefined})); }}
                  aria-invalid={!!errors.phone}
                  className="w-full px-4 py-4 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                  placeholder="06XXXXXXXX"
                  disabled={submitting}
                  maxLength={10}
                />
             </div>
             {errors.phone && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.phone}</p>}
           </div>

           <div>
             <label
               htmlFor="address"
               className="block mb-1.5 text-lg font-bold text-[#1E3A8A]"
             >
               العنوان <span className="text-red-500">*</span>
             </label>
             <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.address ? "border-red-500 ring-2 ring-red-500/20" : "border-[#D1D5DB] focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
               <div className="bg-gray-100 border-l border-[#D1D5DB] px-3 flex items-start pt-3.5 justify-center">
                 <MapPin className="w-5 h-5 text-gray-400" />
               </div>
               <textarea
                 id="address"
                 name="address"
                 autoComplete="street-address"
                 required
                 value={form.address}
                 onChange={(e) => { setForm({ ...form, address: e.target.value }); if(errors.address) setErrors(prev=>({...prev, address: undefined})); }}
                 aria-invalid={!!errors.address}
                 rows={3}
                 className="w-full px-4 py-3.5 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none resize-none"
                 placeholder="العنوان"
                 disabled={submitting}
               />
             </div>
             {errors.address && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.address}</p>}
           </div>

          <div className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl mb-4">
            <span className="font-semibold text-gray-700 text-sm md:text-base">ثمن الباقة</span>
            <span className="font-bold text-[#1E3A8A] text-base md:text-lg">{pack.price} درهم</span>
          </div>

          <div className="rounded-xl bg-[#F9FAFB] p-4 text-center border border-[#E5E7EB] mb-5">
            <p className="text-sm text-[#1E3A8A]">
              الدفع نقداً عند الاستلام — لا تدفع شيئاً حتى تستلم طلبك
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
              className="w-full bg-[#22C55E] text-white font-extrabold text-lg py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 animate-soft-pulse"
            >
              <ShoppingCart className="w-6 h-6 shrink-0" />
              <span>{submitting ? "جاري الإرسال..." : pack.ctaText}</span>
          </button>

        </form>
      </div>
    </section>
  );
}