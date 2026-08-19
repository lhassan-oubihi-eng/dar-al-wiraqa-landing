"use client";

import React, { useEffect, useState } from "react";
import { getEndOfDayCasablancaUTC, formatRemaining } from "@/lib/countdown";

export function DailyOfferCountdown() {
  const [now, setNow] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render a neutral placeholder on the server / before mount to avoid any
  // hydration mismatch (the countdown is time-dependent and client-only).
  if (!mounted || now === null) {
    return (
      <div className="flex justify-center mb-3" aria-hidden>
        <span className="bg-white/15 border border-white/25 text-white/80 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold">
          عرض اليوم فقط
        </span>
      </div>
    );
  }

  const remaining = getEndOfDayCasablancaUTC(now) - now;

  if (remaining <= 0) {
    return (
      <div className="flex justify-center mb-3" role="status">
        <span className="bg-white/15 border border-white/25 text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-bold">
          انتهى العرض — عدنا بالسعر العادي قريباً
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-3" role="timer" aria-live="polite">
      <span className="bg-white text-[#111827] px-3 py-1.5 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 shadow">
        عرض اليوم فقط — ينتهي الساعة 00:00
        <span className="bg-[#111827] text-white font-mono tabular-nums px-2 py-0.5 rounded-md text-sm">
          {formatRemaining(remaining)}
        </span>
      </span>
    </div>
  );
}
