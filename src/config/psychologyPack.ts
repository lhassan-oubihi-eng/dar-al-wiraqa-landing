/**
 * Central configuration for book-packs landing page.
 * Duplicate this file (e.g. psychologyPack.json) to create a new page instantly.
 * All copy, book titles, and prices are fed from here.
 */
export interface Book {
  id: number;
  title: string;
  author: string;
  coverHint?: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: "brain" | "lock" | "shield" | "heart" | "sparkles" | "book-open";
}

export interface PackConfig {
  slug: string;
  packName: string;
  headline: string;
  subheadline: string;
  books: Book[];
  giftBookIndex: number;
  originalPrice: number;
  price: number;
  tagline: string;
  urgency: string;
  valuePropTitle: string;
  benefits: Benefit[];
  guarantee: {
    title: string;
    copy: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    submitText: string;
  };
  footer: {
    packName: string;
    copyright: string;
  };
  otherPacks: { label: string; href: string }[];
}

export const psychologyPack: PackConfig = {
  slug: "psychology",
  packName: "باك علم النفس",
  headline: "تحرر من الضغوطات وابدأ رحلة الوعي مع باقة علم النفس المتكاملة",
  subheadline: "4 كتب أساسية + رائعة 'الليالي البيضاء' مجاناً + توصيل مجاني لباب دارك.",
  books: [
    { id: 7, title: "فهم الأمراض النفسية", author: "ديان برانيت" },
    { id: 34, title: "عقدك النفسية سجنك الأبدي", author: "د. يوسف الحسني" },
    { id: 35, title: "جلسات نفسية", author: "د. محمد إبراهيم" },
    { id: 5, title: "اغتصاب العقل", author: "د. جوست مرلو" },
    { id: 103, title: "الليالي البيضاء", author: "دوستويفسكي", coverHint: "gift" },
  ],
  giftBookIndex: 4,
  originalPrice: 350,
  price: 199,
  tagline: "مرحباً بك! 🚚 التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام.",
  urgency: "🔥 عرض محدود: كتاب 'الليالي البيضاء' مجاني مع أول 50 طلبية هذا الأسبوع فقط.",
  valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
  benefits: [
    {
      title: "تخفيف التوتر اليومي",
      description: "أدوات عملية تهدئ الذهن وتقلل القلق في دقائق، تُطبق على طول اليوم.",
      icon: "brain",
    },
    {
      title: "تحرير العقل من القيود",
      description: "اكتشف الأنماط الخفية التي تكررها وادعِ التغيير بوعي كامل.",
      icon: "lock",
    },
    {
      title: "بناء مرونة عاطفية",
      description: "قواعدٌ بسيطة تُعيد برمجة ردود فعلك على الضغوط وتحفظ استقرارك.",
      icon: "shield",
    },
    {
      title: "تعميق التركيز",
      description: "تقنيات تدعم تركيزك وتزيد إنتاجيتك بلا تعب ذهني إضافي.",
      icon: "sparkles",
    },
  ],
  guarantee: {
    title: "ضمان ذهبي 100%",
    copy: "افتح الكولي، تأكد من الكتوب ديالك، عاد خلص! تسوق بأمان تام ولا تدفع شيئاً حتى تستلم طلبك.",
  },
  checkout: {
    title: "أدخل معلوماتك لتأكيد الطلب",
    subtitle: "أنت تحصل على 5 كتب بـ 199 درهم. الدفع يتم عند الاستلام.",
    submitText: "تأكيد الطلب والدفع عند الاستلام 🚀",
  },
  footer: {
    packName: "باك علم النفس",
    copyright: "دار الوِراقة © 2026 — كتب مختارة بعناية، توصيل لباب دارك",
  },
  otherPacks: [
    { label: "باك التطوير الذاتي", href: "/packs/self-development" },
    { label: "باك المال والاستثمار", href: "/packs/finance" },
    { label: "باك الديني المميز", href: "/packs/religion" },
    { label: "باك الروايات العالمية", href: "/packs/world-novels" },
    { label: "باك الأنوثة", href: "/packs/femininity" },
    { label: "باك القادة", href: "/packs/leaders" },
  ],
};
