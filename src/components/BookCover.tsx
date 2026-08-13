import React from "react";

interface BookCoverProps {
  title: string;
  src: string | null;
  className?: string;
}

/**
 * Renders a real cover photo when available, otherwise an elegant branded
 * placeholder so no card ever shows a broken image.
 */
export function BookCover({ title, src, className = "" }: BookCoverProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={title}
        loading="lazy"
        decoding="async"
        className={className}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className={`flex items-center justify-center p-2 ${className}`}
      style={{
        background: "linear-gradient(135deg,#F3F4F6,#3A2E22)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="text-center text-[11px] font-bold leading-relaxed text-[#CDBB9C]">
        {title}
      </div>
    </div>
  );
}
