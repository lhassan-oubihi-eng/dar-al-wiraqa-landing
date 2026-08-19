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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <section id="orderForm" className="mt-3 rounded-2xl bg-white shadow-xl p-3 sm:p-4 border-2 border-dashed border-gray-300">
      <div className="text-center mb-2">
          <h2 className="font-extrabold text-xl md:text-2xl text-[#111827]">
            {pack.formHeader}
          </h2>
      </div>

      <form id="order-form" onSubmit={handleOrderSubmit} className="space-y-3" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="nameInput"             className="block mb-1.5 text-sm font-bold text-[#111827]">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 transition-all bg-white focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-[#111827]/20">
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-700" />
            </div>
            <input
              id="nameInput"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="الاسم الكامل"
              disabled={isSubmitting}
              autoFocus
            />
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone"             className="block mb-1.5 text-sm font-bold text-[#111827]">
            رقم الهاتف (الواتساب) <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 transition-all bg-white focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-[#111827]/20">
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-700" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="رقم الهاتف (الواتساب)"
              inputMode="tel"
              maxLength={10}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Address Field */}
        <div>
            <label htmlFor="address"             className="block mb-1.5 text-sm font-bold text-[#111827]">
            المدينة والحَيّ (أو العنوان بالتفصيل) <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 transition-all bg-white focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-[#111827]/20">
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
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#111827] placeholder:text-xs placeholder:font-normal placeholder:text-gray-400 focus:outline-none"
                placeholder="المدينة والحَيّ (أو العنوان بالتفصيل)"
              disabled={isSubmitting}
            />
          </div>
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
        <p className="text-center text-xs font-bold text-[#111827] mb-3 flex items-center justify-center gap-1">
          <span aria-hidden>⭐⭐⭐⭐⭐</span>
          <span>{pack.trustLine}</span>
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#111827] text-white font-extrabold text-lg md:text-xl py-4 rounded-xl shadow-lg shadow-[#111827]/30 w-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
             <span>{isSubmitting ? "جاري تأكيد الطلب..." : pack.ctaText}</span>
        </button>

        <p className="text-center text-xs text-[#6B7280] mt-2 flex items-center justify-center gap-1">
          🔒 الدفع آمن - لن تدفع شيئاً حتى يأتيك الموزع إلى باب منزلك
        </p>

      </form>
    </section>
  );
}
