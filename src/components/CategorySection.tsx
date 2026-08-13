import { PackConfig } from "@/data/offers";
import { BundleCard } from "@/components/BundleCard";

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  packs: PackConfig[];
  onAdd?: (pack: PackConfig) => void;
}

/**
 * Renders a labeled group of pack cards in a responsive grid.
 * 2-col on mobile, 3-col on tablet, 4-col on desktop.
 */
export function CategorySection({
  title,
  subtitle,
  packs,
  onAdd,
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
        {packs.map((pack) => (
          <div key={pack.slug}>
            <BundleCard pack={pack} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}