import React from "react";
import { Shield } from "lucide-react";

interface BookMockupProps {
  books: { id: number; title: string }[];
  giftIndex: number;
}

export function BookMockup({ books, giftIndex }: BookMockupProps) {
  return (
    <div className="relative mx-auto my-6 w-48 h-64 flex items-end justify-center">
      <div className="relative w-full h-full">
        {books.map((book, index) => {
          const isGift = index === giftIndex;
          const offset = (books.length - 1 - index) * 6;
          const rotation = (index - 2) * 3;
          return (
            <div
              key={book.id}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-lg"
              style={{
                width: "64px",
                height: "96px",
                background: isGift
                  ? "linear-gradient(135deg, #d4af37, #f3e6b3)"
                  : "linear-gradient(135deg, #4a2920, #3e2723)",
                transform: `rotate(${rotation}deg) translateX(${offset}px)`,
                zIndex: books.length - index,
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                border: isGift ? "1px solid #b8860b" : "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-1">
                <Shield
                  size={16}
                  className={isGift ? "text-[#3e2723]" : "text-white/80"}
                />
              </div>
              {isGift && (
                <span
                  className="absolute -top-1 -right-1 text-[6px] font-bold uppercase"
                  style={{ color: "#d4af37" }}
                >
                  هدية
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
