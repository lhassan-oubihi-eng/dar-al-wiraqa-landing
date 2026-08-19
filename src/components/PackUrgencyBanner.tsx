"use client";

import { PackConfig } from "@/data/offers";
import { DailyOfferCountdown } from "@/components/DailyOfferCountdown";

export function PackUrgencyBanner({ pack }: { pack: PackConfig }) {
  return (
    <div className="bg-[#111827] text-white border-b border-white/15">
      <div className="mx-auto max-w-[420px] px-4 py-3">
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
