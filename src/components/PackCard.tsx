"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { PackConfig } from "@/data/offers";
import { BookCover } from "@/components/BookCover";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

interface PackCardProps {
  pack: PackConfig;
}

export function PackCard({ pack }: PackCardProps) {
  const { addPack } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addPack(pack);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className="flex flex-col rounded-2xl p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#16a34a]"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      {/* Mini cover grid (3-col, matching dar-al-wiraqa.html) */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {pack.books.map((book, i) => {
          const isGift = i === pack.books.length - 1;
          return (
            <div key={book.id} className="flex flex-col">
              <div className="relative aspect-[5/7] overflow-hidden rounded-md border border-[#3A2E22]">
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {isGift && (
                  <span
                    className="absolute inset-x-0 top-0 z-10 py-0.5 text-center text-[8px] font-extrabold text-white"
                    style={{
                      background:
                        "linear-gradient(90deg,#16a34a,#22c55e)",
                    }}
                  >
                    كتاب هدية
                  </span>
                )}
              </div>
              <span className="mt-1 line-clamp-2 text-center text-[8px] font-bold leading-tight text-[#F3E6C4]/90">
                {book.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Name */}
      <div className="text-center text-sm font-bold mb-1" style={{ color: "var(--color-ink)" }}>
        {pack.emoji} {pack.packName}
      </div>

      {/* Description */}
      <div
        className="mb-2 text-center text-[11px] opacity-80"
        style={{ color: "var(--color-ink-light)" }}
      >
        {pack.desc.replace(" + كتاب هدية 🎁", "")}
      </div>

      {/* Price */}
      <div className="mb-2 flex items-center justify-center">
        <span className="text-xl font-bold" style={{ color: "#16a34a" }}>
          {pack.price} درهم
        </span>
      </div>

      {/* Buy CTA */}
            <div className="mt-auto space-y-2 pt-1">
        <button
          type="button"
          onClick={handleAdd}
          className="relative inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#16a34a] py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]"
        >
          <span>أضف إلى السلة</span>
          <ShoppingCart size={16} />
          {justAdded && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[10px] font-extrabold text-[#131010] animate-bounce">
              +أُضيفت!
            </span>
          )}
        </button>
        <Link
          href={`/${pack.slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#3A2E22] py-2 text-xs font-bold text-[#F3E6C4] transition-colors hover:text-[#F3E6C4]"
        >
          <span>عرض التفاصيل</span>
        </Link>
      </div>
    </div>
  );
}
