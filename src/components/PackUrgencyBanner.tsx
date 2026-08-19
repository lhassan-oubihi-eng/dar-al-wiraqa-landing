"use client";

import { PackConfig } from "@/data/offers";
import { DailyOfferCountdown } from "@/components/DailyOfferCountdown";

export function PackUrgencyBanner({ pack }: { pack: PackConfig }) {
  const original = pack.originalPrice;

  return (
    <div className="bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-800 text-white">
      <div className="mx-auto max-w-[420px] px-4 py-5">
        {/* Honest daily-offer countdown — ends at midnight Casablanca time */}
        <DailyOfferCountdown />

        {/* Main Headline — value, not fake urgency */}
        <h2 className="text-center font-black text-lg md:text-xl leading-snug mb-4">
          اطلب {pack.packName} الآن واحصل على التوصيل المجاني + هدية
        </h2>

        <p className="text-center text-xs text-white/80 font-medium">
          ثمن الباقة {original} درهم — تدفع فقط {pack.price} درهم (توصيل مجاني)
        </p>
      </div>
    </div>
  );
}
