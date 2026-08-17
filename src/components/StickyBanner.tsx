import React from "react";

interface StickyBannerProps {
  text: string;
}

export function StickyBanner({ text }: StickyBannerProps) {
  return (
    <div
      className="sticky top-0 z-20 text-center text-base font-extrabold py-3 px-4"
      style={{ background: "#16a34a", color: "#fff" }}
    >
      {text}
    </div>
  );
}
