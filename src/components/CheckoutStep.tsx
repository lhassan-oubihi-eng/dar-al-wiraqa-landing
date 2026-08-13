"use client";

import { Lock, Send } from "lucide-react";

interface CheckoutStepProps {
  form: { name: string; phone: string; city: string };
  onSetForm: (f: { name: string; phone: string; city: string }) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onWhatsApp: () => void;
}

const INPUT_CLASSES =
  "w-full px-4 py-3 rounded-xl border border-[#D1D5DB] bg-white text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#15803D] focus:ring-1 focus:ring-[#15803D]";

/** The checkout step inside the drawer: lead capture form + WhatsApp confirm. */
export function CheckoutStep({
  form,
  onSetForm,
  submitting,
  error,
  onSubmit,
  onWhatsApp,
}: CheckoutStepProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3"
    >
      {error && (
        <p className="rounded border border-[#ef4444]/40 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      <div>
        <label
          className="block text-[11px] font-bold text-[#1F2937] mb-1"
          htmlFor="cart-name"
        >
          الاسم الكامل
        </label>
        <input
          id="cart-name"
          name="name"
          required
          value={form.name}
          onChange={(e) => onSetForm({ ...form, name: e.target.value })}
          className={INPUT_CLASSES}
          placeholder="محمد علي"
          autoComplete="name"
        />
      </div>
      <div>
        <label
          className="block text-[11px] font-bold text-[#1F2937] mb-1"
          htmlFor="cart-phone"
        >
          رقم الهاتف
        </label>
        <input
          id="cart-phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => onSetForm({ ...form, phone: e.target.value })}
          className={INPUT_CLASSES}
          placeholder="06XXXXXXXX"
          inputMode="numeric"
          autoComplete="tel"
        />
        <p className="text-[11px] text-[#6B7280] mt-1">سنتصل بك لتأكيد الطلب.</p>
      </div>
      <div>
        <label
          className="block text-[11px] font-bold text-[#1F2937] mb-1"
          htmlFor="cart-city"
        >
          المدينة والعنوان
        </label>
        <input
          id="cart-city"
          name="city"
          required
          value={form.city}
          onChange={(e) => onSetForm({ ...form, city: e.target.value })}
          className={INPUT_CLASSES}
          placeholder="مثال: الدار البيضاء، شارع الحسن الثاني 12"
          autoComplete="street-address"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-[#15803D] py-3.5 text-sm font-extrabold text-white transition hover:bg-[#16a34a] active:scale-[0.98] flex items-center justify-center gap-1.5"
      >
        {submitting ? (
          <span className="animate-pulse">جاري إرسال الطلب…</span>
        ) : (
          <>
            <Send size={16} />
            <span>تأكيد الطلب عبر الواتساب</span>
          </>
        )}
      </button>

      <div className="flex justify-center items-center gap-1 mt-1">
        <Lock size={12} className="text-[#9CA3AF]" />
        <span className="text-[10px] text-[#9CA3AF]">
          الدفع نقداً عند الاستلام — البيانات مشفرة 100%
        </span>
      </div>
      <button
        type="button"
        onClick={onWhatsApp}
        className="w-full rounded-xl border border-[#D1D5DB] py-2.5 text-xs font-bold text-[#6B7280] transition hover:text-[#15803D]"
      >
        أو أرسل الطلب مباشرة على الواتساب
      </button>
    </form>
  );
}
