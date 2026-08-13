import { PackConfig } from "@/data/offers";
import { PackCard } from "@/components/PackCard";

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  packs: PackConfig[];
  featured?: boolean;
}

/**
 * Renders a labeled group of pack cards in a responsive grid.
 * 2-col on mobile, 3-col on tablet, 4-col on desktop.
 * Pass `featured` to give the first card a "best seller" badge.
 */
export function CategorySection({
  title,
  subtitle,
  packs,
  featured = false,
}: CategorySectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 text-center">
        <h2 className="text-xl font-extrabold text-[#1F2937] md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {packs.map((pack, i) => (
          <div key={pack.slug} className="relative">
            {featured && i === 0 && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[9px] font-extrabold text-[#1F2937] z-10">
                #1 الأكثر مبيعاً
              </span>
            )}
            <PackCard pack={pack} />
          </div>
        ))}
      </div>
    </section>
  );
}
