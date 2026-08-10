import React from "react";

interface UrgencyBannerProps {
  text: string;
}

export function UrgencyBanner({ text }: UrgencyBannerProps) {
  return (
    <div
      className="my-4 mx-4 rounded-md border border-red-300 bg-red-50 p-3 text-center text-xs font-semibold text-[#DC2626]"
      role="status"
    >
      {text}
    </div>
  );
}
