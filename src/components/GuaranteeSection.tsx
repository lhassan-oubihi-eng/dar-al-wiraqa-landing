import React from "react";
import { ShieldCheck } from "lucide-react";
import { PackConfig } from "@/config/psychologyPack";

interface GuaranteeSectionProps {
  guarantee: PackConfig["guarantee"];
}

export function GuaranteeSection({ guarantee }: GuaranteeSectionProps) {
  return (
    <section
      className="mx-4 my-8 rounded-2xl border-2 border-dashed border-[#d4af37] text-center py-8 px-6"
      style={{ background: "var(--color-gold-soft)" }}
    >
      <div className="flex justify-center mb-3 text-[#d4af37]">
        <ShieldCheck size={42} />
      </div>
      <h2 className="font-bold text-xl text-[#3e2723] mb-2">{guarantee.title}</h2>
      <p className="text-sm text-[#5d4538]/85 leading-relaxed max-w-md mx-auto">
        {guarantee.copy}
      </p>
    </section>
  );
}
