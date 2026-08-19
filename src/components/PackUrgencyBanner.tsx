"use client";

import { PackConfig } from "@/data/offers";
import { DailyOfferCountdown } from "@/components/DailyOfferCountdown";

export function PackUrgencyBanner({ pack }: { pack: PackConfig }) {
  return (
    <div className="bg-gradient-to-b from-emerald-600 via-emerald-700 to-teal-800 text-white">
      <div className="mx-auto max-w-[420px] px-4 py-5">
        {/* Honest daily-offer countdown — ends at midnight Casablanca time */}
        <DailyOfferCountdown />

        {/* Urgency / countdown text */}
        <h2 className="text-center font-black text-lg md:text-xl leading-snug mb-4">
          {pack.urgencyText}
        </h2>
      </div>
    </div>
  );
}
