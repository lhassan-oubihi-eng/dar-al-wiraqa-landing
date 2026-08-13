"use client";

import React, { useEffect, useState } from "react";

interface UrgencyBannerProps {
  text: string;
}

/** Seed for the "remaining gift slots" — a marketing lever you can adjust. */
const SLOTS_TOTAL = 50;
const SLOTS_LEFT = 17;

/** Evergreen countdown: 24h since first visit (per-browser), auto-resets. */
function useCountdown() {
  const [display, setDisplay] = useState("--:--:--");

  useEffect(() => {
    const KEY = "daw_urgency_end";
    let end = Number(window.localStorage.getItem(KEY) || 0);
    const now = Date.now();
    if (!end || end < now) {
      end = now + 24 * 60 * 60 * 1000;
      try {
        window.localStorage.setItem(KEY, String(end));
      } catch {
        /* non-blocking */
      }
    }

    const tick = () => {
      let diff = end - Date.now();
      if (diff <= 0) {
        end = Date.now() + 24 * 60 * 60 * 1000;
        try {
          window.localStorage.setItem(KEY, String(end));
        } catch {
          /* non-blocking */
        }
        diff = end - Date.now();
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const p = (n: number) => String(n).padStart(2, "0");
      setDisplay(`${p(h)}:${p(m)}:${p(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return display;
}

export function UrgencyBanner({ text }: UrgencyBannerProps) {
  const countdown = useCountdown();
  const pct = Math.round((SLOTS_LEFT / SLOTS_TOTAL) * 100);

  return (
    <div className="my-4 mx-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-xs font-semibold text-[#DC2626]">
      <p role="status">{text}</p>

      {/* Live leftover-slot progress bar */}
      <div className="mx-auto mt-2.5 max-w-xs">
        <div className="mb-1 flex items-center justify-between text-[10px] text-[#DC2626]">
          <span>
            باقي <strong>{SLOTS_LEFT}</strong> من {SLOTS_TOTAL} طلبية
          </span>
          <span>لتشمل الهدية</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-red-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,#16a34a,#22c55e)",
            }}
          />
        </div>
      </div>

      {/* Evergreen countdown timer */}
      <p className="mt-2 text-[11px] font-bold text-[#DC2626]">
        ⏳ ينتهي عرض الهدية خلال <span dir="ltr">{countdown}</span>
      </p>
    </div>
  );
}
