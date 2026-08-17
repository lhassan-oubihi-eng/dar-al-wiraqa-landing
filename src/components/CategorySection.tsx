"use client";

import { PackConfig } from "@/data/offers";
import { PackSlider } from "@/components/PackSlider";

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  packs: PackConfig[];
  marketingHook?: string;
  hookIcon?: React.ReactNode;
}

const DEFAULT_HOOKS: Record<string, { hook: string; icon: React.ReactNode }> = {
  psychology: {
    hook: "افهم عقلك، غيّر حياتك — باقات علم النفس الأكثر مبيعاً في المغرب",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.54-.94 1.08-.94h2.438c.538 0 .988.398 1.078.94l.213 1.281c.063.374.313.686.645.87.086.045.17.094.25.146.588.367 1.392.59 2.28.59s1.692-.223 2.28-.59c.08-.052.164-.101.25-.146.331-.184.581-.496.645-.87l.213-1.281c.09-.542.54-.94 1.08-.94h2.438c.538 0 .988.398 1.078.94l2.346 14.076c.087.524-.33 1.026-.86 1.114-.254.043-.51.063-.766.063H3.53c-.256 0-.512-.02-.766-.063-.53-.088-.947-.59-.86-1.114l2.346-14.076z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25a3.75 3.75 0 110-7.5 3.75 3.75 0 010 7.5z" />
      </svg>
    ),
  },
  religious: {
    hook: "تقرب إلى الله بقراءات تُنير القلب وتثبت الإيمان — باقات مختارة بعناية",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  "self-development": {
    hook: "اكتسب مهارات العصر، وطور ذاتك بباقة واحدة متكاملة — استثمارك الحقيقي",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  finance: {
    hook: "ادعِ الثروة بعقلية صحيحة وعادات ذكية — كتب المال والاستثمار الأكثر طلباً",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  "horror-thriller": {
    hook: "لوحة متكاملة من أفضل روايات الرعب والإثارة العربية — لقراء يبحثون عن التشويق",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.88 9.88a3 3 0 104.24 4.24M9.88 9.88a3 3 0 11-4.24-4.24m4.24 4.24l-1.657 1.657a3 3 0 104.24 4.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  empowerment: {
    hook: "اكتشري قوتك وحافظي على تقديرك الذاتي — باقات التمكين والأنوثة المميزة",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A10 10 0 0010 9v.75a8.967 8.967 0 01-2.343 6.022 23.847 23.847 0 005.454 1.31M9.88 9.88a3 3 0 104.24 4.24M9.88 9.88a3 3 0 11-4.24-4.24m4.24 4.24l-1.657 1.657a3 3 0 104.24 4.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

/**
 * Renders a category section with marketing hook + interactive pack sliders.
 * Each pack gets its own swipeable carousel showing all books.
 */
export function CategorySection({
  title,
  subtitle,
  packs,
  marketingHook,
  hookIcon,
}: CategorySectionProps) {
  const categorySlug = packs[0]?.slug;
  const defaultHook = categorySlug ? DEFAULT_HOOKS[categorySlug] : null;
  const hook = marketingHook || defaultHook?.hook;
  const icon = hookIcon || defaultHook?.icon;

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* Section Header with Marketing Hook */}
      <div className="mb-8 text-center">
        {hook && (
          <div className="mb-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#F0FDF4] to-[#D1FAE5] border border-[#BBF7D0]">
            {icon && <span className="text-[#15803D]">{icon}</span>}
            <span className="text-base font-bold text-[#15803D]">{hook}</span>
          </div>
        )}
        <h2 className="text-2xl font-black text-gray-900 md:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-base text-[#6B7280]">{subtitle}</p>
        )}
      </div>

      {/* Pack Sliders Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {packs.map((pack) => (
          <div key={pack.slug}>
            <PackSlider pack={pack} />
          </div>
        ))}
      </div>
    </section>
  );
}