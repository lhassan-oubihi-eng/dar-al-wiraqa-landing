import React from "react";
import { Shield } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface GuaranteeSectionProps {
  guarantee: PackConfig["guarantee"];
}

export function GuaranteeSection({ guarantee }: GuaranteeSectionProps) {
  return (
    <section
      className="mx-4 my-10 rounded-2xl border border-[#E5E7EB] text-center py-10 px-6"
      style={{ background: "#fff" }}
    >
      <div className="flex justify-center mb-3 text-[#16a34a]">
        <Shield size={44} />
      </div>
      <h2 className="font-bold text-xl text-[#1F2937] mb-2">{guarantee.title}</h2>
      <p className="text-sm text-[#6B7280]/85 leading-relaxed max-w-md mx-auto">
        {guarantee.copy}
      </p>
    </section>
  );
}
