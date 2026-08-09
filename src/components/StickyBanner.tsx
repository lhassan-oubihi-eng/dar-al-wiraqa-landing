import React from "react";

interface StickyBannerProps {
  text: string;
}

export function StickyBanner({ text }: StickyBannerProps) {
  return (
    <div
      className="sticky top-0 z-20 text-center text-sm font-semibold py-2.5 px-4"
      style={{ background: "#3e2723", color: "#d4af37" }}
    >
      {text}
    </div>
  );
}
