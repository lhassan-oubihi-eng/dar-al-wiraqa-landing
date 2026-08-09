import React from "react";
import { Shield } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface GuaranteeSectionProps {
  guarantee: PackConfig["guarantee"];
}

export function GuaranteeSection({ guarantee }: GuaranteeSectionProps) {
  return (
    <section
      className="mx-4 my-10 rounded-2xl border-2 border-[#d4af37] text-center py-10 px-6"
      style={{ background: "#241D17" }}
    >
      <div className="flex justify-center mb-3 text-[#d4af37]">
        <Shield size={44} />
      </div>
      <h2 className="font-bold text-xl text-[#e8e0d4] mb-2">{guarantee.title}</h2>
      <p className="text-sm text-[#cdbba9]/85 leading-relaxed max-w-md mx-auto">
        {guarantee.copy}
      </p>
    </section>
  );
}
