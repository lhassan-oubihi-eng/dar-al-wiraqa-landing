import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";

interface MobileStickyFooterProps {
  price: number;
  feminine?: boolean;
  onCtaClick: () => void;
}

export function MobileStickyFooter({
  price,
  feminine = false,
  onCtaClick,
}: MobileStickyFooterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
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
      <div className="flex items-center justify-between gap-3 bg-white border-t border-[#E5E5E5] px-4 py-3 shadow-lg">
        <div className="flex items-center gap-1">
          <ShoppingCart size={20} className="text-[#15803D]" />
          <span className="font-black text-xl text-gray-900">
            {price} درهم
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="flex-1 py-3 px-4 rounded-full font-extrabold text-base text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all duration-200"
          type="button"
        >
          {feminine
            ? `احصلي على 6 كتب بـ ${price} درهم`
            : `احصل على 6 كتب بـ ${price} درهم`}
        </button>
      </div>
    </div>
  );
}
