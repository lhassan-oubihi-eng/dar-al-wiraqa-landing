import React from "react";
import { Shield } from "lucide-react";
import { PackConfig } from "@/data/offers";

interface GuaranteeSectionProps {
  guarantee: PackConfig["guarantee"];
}

export function GuaranteeSection({ guarantee }: GuaranteeSectionProps) {
  return (
    <section
      className="mx-4 my-10 rounded-2xl border border-[#3A2E22] text-center py-10 px-6"
      style={{ background: "#fff" }}
    >
      <div className="flex justify-center mb-3 text-[#16a34a]">
        <Shield size={44} />
      </div>
      <h2 className="font-bold text-xl text-[#F3E6C4] mb-2">{guarantee.title}</h2>
      <p className="text-sm text-[#CDBB9C]/85 leading-relaxed max-w-md mx-auto">
        {guarantee.copy}
      </p>
    </section>
  );
}
