import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";

interface MobileStickyFooterProps {
  price: number;
  feminine?: boolean;
  onCtaClick: () => void;
  formRef?: React.RefObject<HTMLDivElement>;
}

export function MobileStickyFooter({
  price,
  feminine = false,
  onCtaClick,
  formRef,
}: MobileStickyFooterProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!formRef?.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(formRef.current);

    return () => observer.unobserve(formRef.current);
  }, [formRef]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      <div className="flex items-center justify-between gap-3 bg-white border-t border-[#E5E5E5] px-4 py-3 shadow-lg">
        <div className="flex items-center gap-1">
          <ShoppingCart size={20} className="text-[#059669]" />
          <span className="font-black text-xl text-gray-900">
            {price} درهم
          </span>
        </div>
        <button
          onClick={onCtaClick}
          className="flex-1 py-3 px-4 rounded-full font-extrabold text-base text-white bg-[#059669] hover:bg-[#047857] active:scale-[0.98] transition-all duration-200"
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
