"use client";

import React, { useState } from "react";
import { User, Phone, MapPin, ShoppingCart } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface CheckoutSectionProps {
  pack: PackConfig;
  onCtaClick?: () => void;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
}

/**
 * High-converting CRO checkout form matching exact requested specifications.
 */
export function CheckoutSection({ pack }: CheckoutSectionProps) {
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "المرجو إدخال الاسم الكامل";
    if (!form.phone.trim()) e.phone = "المرجو إدخال رقم الهاتف";
    else if (!/^(06|07)\d{8}$/.test(form.phone.trim())) e.phone = "رقم غير صالح — يجب أن يبدأ بـ 06 أو 07 ويتكون من 10 أرقام";
    if (!form.address.trim() || form.address.trim().length < 4) e.address = "المرجو إدخال العنوان الكامل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const v = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((prev) => ({ ...prev, [name]: v }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    const books = pack.books
      .map(
        (b, i) =>
          `${String(b.id).padStart(3, "0")} — ${b.title}` +
          (i === pack.giftBookIndex ? " [هدية]" : "")
      )
      .join("\n");

    const formData = {
      o_name: form.name,
      o_phone: form.phone,
      o_address: form.address,
      offer: pack.packName,
      books,
      price: `${pack.price} درهم`,
      payment: "نقداً عند الاستلام",
      count: pack.books.length,
    };

    try {
      const w = window as unknown as {
        fbq?: (t: string, e: string, p?: unknown) => void;
      };
      w.fbq?.("track", "InitiateCheckout", {
        content_name: pack.packName,
        content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
        content_type: "product_group",
        currency: "MAD",
        value: pack.price,
      });
      w.fbq?.("track", "Purchase", {
        content_name: pack.packName,
        content_ids: pack.books.map((b) => String(b.id).padStart(3, "0")),
        content_type: "product_group",
        currency: "MAD",
        value: pack.price,
        num_items: 1,
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
          address: form.address,
          phone: form.phone,
          offer: pack.packName,
          bump: 0,
        })
      );
    } catch {
      /* non-blocking */
    }

    setTimeout(function () {
      window.location.href = "/thank-you";
    }, 800);
  };

  return (
    <section id="orderForm" className="mt-10 rounded-2xl bg-white shadow-xl p-5 sm:p-6 border-2 border-solid border-[#1E3A8A]">
      <div className="text-center mb-3">
          <h2 className="font-extrabold text-xl md:text-2xl text-[#1E3A8A]">
            {pack.formHeader}
          </h2>
      </div>

      <form id="order-form" onSubmit={handleOrderSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="nameInput" className="block mb-1.5 text-sm font-bold text-[#1E3A8A]">
            الاسم <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.name ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <input
              id="nameInput"
              name="name"
              type="text"
              autoComplete="name"
              required
              aria-invalid={!!errors.name}
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-4 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="الاسم"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          {errors.name && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.name}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone"             className="block mb-1.5 text-sm font-bold text-[#1E3A8A]">
            رقم الهاتف <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.phone ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-700" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              aria-invalid={!!errors.phone}
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-4 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="06XXXXXXXX"
              inputMode="tel"
              maxLength={10}
              disabled={isSubmitting}
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.phone}</p>}
        </div>

        {/* Address Field */}
        <div>
            <label htmlFor="address"             className="block mb-1.5 text-sm font-bold text-[#1E3A8A]">
            العنوان <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${errors.address ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-300 focus-within:border-[#1E3A8A] focus-within:ring-2 focus-within:ring-[#1E3A8A]/20"}`}>
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-700" />
            </div>
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="address-level2"
              list="moroccan-cities"
              required
              aria-invalid={!!errors.address}
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-4 text-lg font-bold text-[#1E3A8A] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="العنوان"
              disabled={isSubmitting}
            />
          </div>
          {errors.address && <p className="mt-1 text-sm font-bold text-red-600 text-right">{errors.address}</p>}
        </div>

        {/* Major Moroccan cities — lightweight autocomplete with free-text fallback */}
        <datalist id="moroccan-cities">
          <option value="الدار البيضاء" />
          <option value="الرباط" />
          <option value="فاس" />
          <option value="مراكش" />
          <option value="طنجة" />
          <option value="أكادير" />
          <option value="وجدة" />
          <option value="مكناس" />
          <option value="القنيطرة" />
          <option value="تطوان" />
          <option value="سلا" />
          <option value="تمارة" />
          <option value="بني ملال" />
          <option value="الجديدة" />
          <option value="خريبكة" />
          <option value="سطات" />
          <option value="العرائش" />
          <option value="الصويرة" />
          <option value="الناظور" />
          <option value="سيدي سليمان" />
          <option value="بركان" />
        </datalist>

        {/* Sleek CTA Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#22C55E] text-white font-extrabold text-lg md:text-xl py-4 rounded-xl shadow-lg shadow-[#22C55E]/30 w-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-soft-pulse"
        >
          <ShoppingCart className="w-5 h-5" />
             <span>{isSubmitting ? "جاري إرسال الطلب..." : pack.ctaText}</span>
        </button>

      </form>
    </section>
  );
}
