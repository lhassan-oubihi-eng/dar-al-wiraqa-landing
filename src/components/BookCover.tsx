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
        background: "linear-gradient(135deg,#4a2920,#241D17)",
        border: "1px solid rgba(212,175,55,.45)",
      }}
    >
      <div className="text-center text-[11px] font-bold leading-relaxed text-[#e8e0d4]">
        {title}
      </div>
    </div>
  );
}
