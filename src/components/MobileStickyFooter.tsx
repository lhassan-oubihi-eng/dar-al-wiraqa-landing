import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

interface MobileStickyFooterProps {
  price: number;
  onCtaClick: () => void;
}

export function MobileStickyFooter({ price, onCtaClick }: MobileStickyFooterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 420) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      <div className="flex items-center justify-between gap-3 bg-[#3e2723] border-t border-[#d4af37] px-4 py-3 shadow-lg">
        <div className="flex items-center gap-1">
          <ShoppingCart size={18} className="text-[#d4af37]" />
          <span className="font-bold text-base text-[#d4af37]">
            {price} درهم
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-sm text-[#3e2723] bg-[#d4af37] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          type="button"
        >
          احصل على 6 كتب بـ {price} درهم
        </button>
      </div>
    </div>
  );
}
