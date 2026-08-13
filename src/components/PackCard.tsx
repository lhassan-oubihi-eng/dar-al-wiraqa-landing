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
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <div className="flex flex-col rounded-2xl p-3 bg-white border border-[#E5E5E5] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Mini cover grid (3-col) */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {pack.books.map((book, i) => {
          const isGift = i === pack.books.length - 1;
          return (
            <div key={book.id} className="flex flex-col">
              <div className="relative aspect-[5/7] w-full overflow-hidden rounded-md border border-[#D1D5DB]">
                <BookCover
                  title={book.title}
                  src={book.coverUrl}
                  className="h-full w-full object-cover transition-transform duration-300"
                />
                {isGift && (
                  <span
                    className="absolute inset-x-0 top-0 z-10 py-0.5 text-center text-[8px] font-extrabold text-white"
                    style={{
                      background: "linear-gradient(90deg,#15803D,#22c55e)",
                    }}
                  >
                    هدية
                  </span>
                )}
              </div>
              <span className="mt-1 line-clamp-2 text-center text-[8px] font-bold leading-tight text-[#4B5563]">
                {book.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Name */}
      <div className="text-center text-sm font-bold mb-1 text-[#1F2937]">
        {pack.emoji} {pack.packName}
      </div>

      {/* Description */}
      <div className="mb-2 text-center text-[11px] text-[#6B7280]">
        {pack.desc.replace(" + كتاب هدية 🎁", "")}
      </div>

      {/* Price */}
      <div className="mb-2 flex items-center justify-center">
        <span className="text-xl font-bold text-[#15803D]">
          {pack.price} درهم
        </span>
      </div>

      {/* Buy CTA */}
      <div className="mt-auto space-y-2 pt-1">
        <button
          type="button"
          onClick={handleAdd}
          className="relative inline-flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold text-white bg-[#15803D] hover:bg-[#16a34a] transition-all duration-200"
        >
          <span>أضف إلى السلة</span>
          <ShoppingCart size={16} />
          {justAdded && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[10px] font-extrabold text-[#1F2937] animate-bounce">
              +أُضيفت!
            </span>
          )}
        </button>
        <Link
          href={`/${pack.slug}`}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#D1D5DB] py-2 text-xs font-bold text-[#6B7280] hover:text-[#15803D] transition-colors"
        >
          <span>عرض التفاصيل</span>
        </Link>
      </div>
    </div>
  );
}
