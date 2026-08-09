import React from "react";

interface UrgencyBannerProps {
  text: string;
}

export function UrgencyBanner({ text }: UrgencyBannerProps) {
  return (
    <div
      className="my-4 mx-4 rounded-md border border-yellow-700/40 bg-yellow-900/20 p-3 text-center text-xs font-semibold text-[#e8e0d4]"
      role="status"
    >
      {text}
    </div>
  );
}
