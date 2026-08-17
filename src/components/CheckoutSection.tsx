"use client";

import React, { useState } from "react";
import { User, Phone, MapPin, ShoppingBag } from "lucide-react";
import { PackConfig } from "@/data/offers";

const PHONE_RE = /^(06|07)\d{8}$/;

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
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.phone || !form.address) {
      setError("رجاءً املأ جميع الحقول المطلوبة.");
      return;
    }

    if (!PHONE_RE.test(form.phone)) {
      setError("أدخل رقم هاتف صحيح يبدأ بـ 06 أو 07 (10 أرقام).");
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
      address: form.address,
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
    <section id="orderForm" className="mt-3 rounded-2xl bg-white shadow-xl p-4 sm:p-5 border border-gray-200">
      
      {/* Sleek React Live Pulse Scarcity Badge */}
      <div className="flex justify-center mb-3">
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <span>عرض مباشر: باقي 4 باقات فقط بهذا السعر</span>
        </div>
      </div>

      <div className="text-center mb-3">
        <h2 className="font-extrabold text-xl md:text-2xl text-gray-900">
          ادخل معلوماتك للطلب
        </h2>
      </div>

      {/* In-Form Order Summary Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 text-base font-medium text-gray-700 space-y-2.5">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">ثمن المنتج</span>
          <span className="font-bold text-gray-900">{pack.price}.00 درهم</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <span className="text-gray-500">التوصيل</span>
          <span className="font-bold text-emerald-600">مجاني</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 pt-2 text-xl font-black">
          <span className="text-gray-800">المجموع</span>
          <span className="text-[#15803D]">{pack.price}.00 درهم</span>
        </div>
      </div>

      {error && (
        <div className="mb-3 text-center text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl py-2" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all bg-white">
            <input
              id="nameInput"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
              placeholder="الاسم"
              disabled={isSubmitting}
            />
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all bg-white">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
              placeholder="الهاتف (06/07)"
              inputMode="numeric"
              maxLength={10}
              disabled={isSubmitting}
            />
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div>
          <div className="flex rounded-xl overflow-hidden border border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all bg-white">
            <input
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
              required
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
              placeholder="العنوان أو المدينة"
              disabled={isSubmitting}
            />
            <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </div>

        {/* Sleek CTA Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg md:text-xl py-4 rounded-xl shadow-lg shadow-emerald-600/20 w-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          <span>{isSubmitting ? "جاري تأكيد الطلب..." : "اشتري الآن"}</span>
        </button>

        {/* Zero-Friction Trust Note */}
        <div className="text-center text-sm font-bold text-gray-500 mt-2">
          <span className="text-rose-600 underline underline-offset-4">
            اشتري الآن الكمية جد محدودة : الجودة مع الضمان.
          </span>
        </div>
      </form>
    </section>
  );
}
