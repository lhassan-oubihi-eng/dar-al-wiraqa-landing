import React from "react";
import { Shield } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface GuaranteeSectionProps {
  guarantee: PackConfig["guarantee"];
}

export function GuaranteeSection({ guarantee }: GuaranteeSectionProps) {
  return (
    <section
      className="mx-4 my-10 rounded-2xl border border-[#E5E5E5] text-center py-10 px-6 bg-white"
    >
      <div className="flex justify-center mb-3 text-[#111827]">
        <Shield size={44} />
      </div>
      <h2 className="font-black text-2xl md:text-3xl text-gray-900 mb-2">{guarantee.title}</h2>
      <p className="text-base text-[#4B5563] leading-relaxed max-w-md mx-auto">
        {guarantee.copy}
      </p>
    </section>
  );
}
