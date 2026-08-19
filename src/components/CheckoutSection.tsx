"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, MapPin, ShoppingCart, CheckCircle2 } from "lucide-react";
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const trimmedName = form.name.trim();
  const phoneValid = PHONE_RE.test(form.phone);
  const nameValid = trimmedName.length >= 5 || trimmedName.includes(" ");
  const addressValid = form.address.trim().length >= 3;
  const allValid = nameValid && phoneValid && addressValid;

  const handleOrderSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    setTouched({ name: true, phone: true, address: true });
    setIsSubmitted(true);

    if (!allValid) {
      window.scrollTo({ top: 0, behavior: "smooth" });
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
    <section id="orderForm" className="mt-3 rounded-2xl bg-white shadow-xl p-4 sm:p-5 border-2 border-dashed border-gray-300">
      
      <div className="text-center mb-3">
        <h2 className="font-extrabold text-xl md:text-2xl text-gray-900">
          ادخل معلوماتك للطلب
        </h2>
      </div>

      {error && (
        <div className="mb-3 text-center text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl py-2" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleOrderSubmit} className="space-y-4" noValidate>
        {/* Name Field */}
        <div>
          <label htmlFor="nameInput" className="block mb-1.5 text-sm font-bold text-gray-700">
            الاسم الكامل / Nom Complet <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${(isSubmitted || touched.name) && !nameValid ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20"}`}>
              <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
                {touched.name && nameValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <User className="w-5 h-5 text-gray-700" />}
              </div>
              <input
                id="nameInput"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                onBlur={() => handleBlur("name")}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
                placeholder="الاسم الكامل / Nom Complet"
                disabled={isSubmitting}
                autoFocus
              />
          </div>
          {(isSubmitted || touched.name) && !nameValid && (
            <p className="text-xs text-red-500 font-medium mt-1">المرجو إدخال الاسم الكامل بشكل صحيح (الاسم والنسب)</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block mb-1.5 text-sm font-bold text-gray-700">
            رقم الهاتف / Numéro <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${(isSubmitted || touched.phone) && !phoneValid ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20"}`}>
              <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
                {touched.phone && phoneValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Phone className="w-5 h-5 text-gray-700" />}
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("phone")}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
                placeholder="رقم الهاتف / Numéro"
                inputMode="tel"
                maxLength={10}
                disabled={isSubmitting}
              />
          </div>
          {(isSubmitted || touched.phone) && !phoneValid && (
            <p className="text-xs text-red-500 font-medium mt-1">المرجو إدخال رقم هاتف مغربي صحيح (06XX / 07XX)</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label htmlFor="address" className="block mb-1.5 text-sm font-bold text-gray-700">
            العنوان / Adresse <span className="text-red-500">*</span>
          </label>
          <div className={`flex rounded-xl overflow-hidden border transition-all bg-white ${(isSubmitted || touched.address) && !addressValid ? "border-red-400 ring-2 ring-red-100" : "border-gray-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20"}`}>
              <div className="bg-gray-100 border-l border-gray-300 px-3 flex items-center justify-center">
                {touched.address && addressValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <MapPin className="w-5 h-5 text-gray-700" />}
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
                onBlur={() => handleBlur("address")}
                className="w-full px-4 py-3.5 text-lg font-bold text-[#1F2937] placeholder-gray-400 focus:outline-none"
                placeholder="العنوان / Adresse"
                disabled={isSubmitting}
              />
          </div>
          {(isSubmitted || touched.address) && !addressValid && (
            <p className="text-xs text-red-500 font-medium mt-1">المرجو كتابة المدينة وعنوان التوصيل بوضوح</p>
          )}
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
          disabled={isSubmitting || !allValid}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg md:text-xl py-4 rounded-xl shadow-lg shadow-emerald-600/30 w-full flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{isSubmitting ? "جاري تأكيد الطلب..." : "اضغط هنا للطلب"}</span>
        </button>

      </form>
    </section>
  );
}
