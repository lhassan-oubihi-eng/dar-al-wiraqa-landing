import React from "react";
import { Benefit } from "@/data/offers";
import { BookCover } from "@/components/BookCover";

interface ValuePropSectionProps {
  title: string;
  benefits: Benefit[];
}

export function ValuePropSection({ title, benefits }: ValuePropSectionProps) {
  return (
    <section className="px-4 py-10 bg-[#241D17] rounded-2xl shadow-md mx-4 mb-10" dir="rtl">
      <h2 className="text-center font-bold text-lg text-[#e8e0d4] mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            dir="rtl"
            className="border border-[#3A2E22] rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="mb-3 flex justify-center">
              <div className="h-40 w-28 overflow-hidden rounded-lg shadow-md">
                <BookCover
                  title={benefit.title}
                  src={benefit.coverUrl}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-center font-bold text-sm text-[#e8e0d4] mb-1">
              {benefit.title}
              {benefit.gift && (
                <span
                  className="mr-2 rounded px-1.5 py-0.5 text-[10px] font-black"
                  style={{ background: "#d4af37", color: "#3e2723" }}
                >
                  هدية
                </span>
              )}
            </h3>
            <p
              className="text-xs text-[#cdbba9]/80 leading-relaxed text-right"
              style={{ textAlign: "right" }}
            >
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
