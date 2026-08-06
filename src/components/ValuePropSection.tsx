import React from "react";
import { Brain, Lock, Shield, Heart, Sparkles, BookOpen } from "lucide-react";
import { Benefit } from "@/config/psychologyPack";

const ICON_MAP: Record<Benefit["icon"], React.ReactNode> = {
  brain: <Brain size={20} />,
  lock: <Lock size={20} />,
  shield: <Shield size={20} />,
  heart: <Heart size={20} />,
  sparkles: <Sparkles size={20} />,
  "book-open": <BookOpen size={20} />,
};

interface ValuePropSectionProps {
  title: string;
  benefits: Benefit[];
}

export function ValuePropSection({ title, benefits }: ValuePropSectionProps) {
  return (
    <section className="px-4 py-8 bg-white rounded-2xl shadow-md mx-4 mb-8" dir="rtl">
      <h2 className="text-center font-bold text-lg text-[#3e2723] mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="border border-[#eaeaea] rounded-xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex justify-center mb-2 text-[#d4af37]">
              {ICON_MAP[benefit.icon] || <Brain size={20} />}
            </div>
            <h3 className="font-bold text-sm text-[#3e2723] mb-1">{benefit.title}</h3>
            <p className="text-xs text-[#5d4538]/80 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
