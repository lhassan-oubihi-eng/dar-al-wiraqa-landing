import React from "react";

interface UrgencyBannerProps {
  text: string;
}

export function UrgencyBanner({ text }: UrgencyBannerProps) {
  return (
    <div
      className="my-6 text-center text-xs font-medium py-2 px-4 mx-4 rounded-lg"
      style={{
        background: "var(--color-urgent)",
        color: "var(--color-urgent-text)",
      }}
    >
      {text}
    </div>
  );
}
