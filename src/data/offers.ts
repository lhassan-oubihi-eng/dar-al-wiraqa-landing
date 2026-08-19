/**
 * Central store data for Dar Al Wiraqa.
 * The 6 pack offers are defined in ./data.json (single source of truth) and
 * mapped here into typed PackConfig objects consumed by the store homepage (/)
 * and the dynamic per-pack landing pages (/[slug]).
 */

import packs from "./data.json";

export interface Book {
  id: number;
  title: string;
  desc?: string;
  coverUrl: string | null;
  gift?: boolean;
}

export interface Benefit {
  title: string;
  coverUrl: string | null;
  gift?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface PackConfig {
  slug: string;
  packName: string;
  feminine: boolean;
  namePlaceholder: string;
  desc: string;
  headline: string;
  subheadline: string;
  books: Book[];
  giftBookIndex: number;
  originalPrice: number;
  price: number;
  tagline: string;
  urgency: string;
  trustLine: string;
  announcement: string;
  urgencyText: string;
  heroHeadline: string;
  socialProof: string;
  formHeader: string;
  ctaText: string;
  category: string;
  outcomes: string[];
  forYouIf: string[];
  notForYouIf: string[];
  faqs: Faq[];
  previewNote?: string;
  crossSell: string[];
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
}

export const STORE = {
  name: "دار الوِراقة",
  tagline: "مكتبتك المغربية — كتب مختارة بعناية، توصل لباب دارك",
  copyright: "دار الوِراقة © 2026",
  price: 199,
};

/**
 * Store-wide FAQs answered ONLY from real, supportable policies.
 * These are appended to every bundle's product-specific FAQs so the
 * objection-handling system is consistent and never invents a policy.
 */
export const STORE_FAQS: Faq[] = [
  {
    q: "كيف يتم الدفع؟",
    a: "الدفع نقداً عند الاستلام — لا تدفع أي مبلغ قبل استلام باقتك.",
  },
  {
    q: "ما طريقة التوصيل ومتى أستلم طلبي؟",
    a: "التوصيل مجاني لجميع مدن المغرب، ويتم عادة خلال 24 إلى 48 ساعة.",
  },
  {
    q: "هل الكتب أصلية وورقية؟",
    a: "نعم، كتب مطبوعة باللغة العربية تُسلّم إلى باب منزلك.",
  },
  {
    q: "ماذا لو أردت الإلغاء أو كان هناك مشكل في الطلب؟",
    a: "بما أن الدفع عند الاستلام، يمكنك فحص الطلب عند التسليم؛ ولأي استفسار تواصل مع خدمة العملاء.",
  },
];

export const OFFER_BOOKS = 4;
export const OFFER_GIFT = 1;

export function coverUrlFor(id: number): string {
  return `/covers/${String(id).padStart(3, "0")}.jpg`;
}

const tagline = "مرحباً بك! التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام.";
const taglineFeminine = "مرحباً بكِ! التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام.";

const guarantees = {
  title: "ضمان 100%",
  copy: "افتح الكولي، تأكد من الكتوب ديالك، عاد خلص! تسوق بأمان تام ولا تدفع شيئاً حتى تستلم طلبك.",
};

const guaranteesFeminine = {
  title: "ضمان 100%",
  copy: "افتحي الكولي، تأكدي من كتبكِ، عاد خلصي! تسوقي بأمان تام ولا تدفعي شيئاً حتى تستلمي طلبكِ.",
};

const checkout = {
  title: "أدخل معلوماتك لتأكيد الطلب",
    subtitle: "🎁 أنت تحصل على 6 كتب (5 أساسية + هدية مجانية) بـ 199 درهم. الدفع يتم عند الاستلام.",
  submitText: "تأكيد الطلب والدفع عند الاستلام",
};

const checkoutFeminine = {
  title: "أدخلي معلوماتك لتأكيد الطلب",
    subtitle: "🎁 أنتِ تحصلين على 6 كتب (5 أساسية + هدية مجانية) بـ 199 درهم. الدفع يتم عند الاستلام.",
  submitText: "تأكيد الطلب والدفع عند الاستلام",
};

const footerCopyright = "دار الوِراقة © 2026";
const valuePropTitle = "الكتب المشمولة في الباقة";

interface RawBook {
  title: string;
  desc: string;
  coverId?: number;
}

interface RawPack {
  slug: string;
  packName: string;
  trustLine?: string;
  announcement?: string;
  urgencyText?: string;
  heroHeadline?: string;
  socialProof?: string;
  formHeader?: string;
  ctaText?: string;
  category?: string;
  outcomes?: string[];
  forYouIf?: string[];
  notForYouIf?: string[];
  faqs?: Faq[];
  previewNote?: string;
  crossSell?: string[];
  feminine?: boolean;
  namePlaceholder?: string;
  desc: string;
  price: number | string;
  oldPrice: number | string;
  heroH1: string;
  heroH2: string;
  urgency: string;
  books: RawBook[];
  gift: RawBook;
}

function toBook(book: RawBook, fallbackId: number, gift = false): Book {
  return {
    id: book.coverId ?? fallbackId,
    title: book.title,
    desc: book.desc,
    coverUrl: book.coverId ? coverUrlFor(book.coverId) : null,
    gift,
  };
}

export const offers: PackConfig[] = (packs as RawPack[]).map((pack) => {
  const books = pack.books.map((b, i) => toBook(b, -(i + 1)));
  const gift = toBook(pack.gift, -100, true);
  const allBooks = [...books, gift];
  const feminine = pack.feminine === true;

  return {
    slug: pack.slug,
    packName: pack.packName,
    feminine,
    namePlaceholder: pack.namePlaceholder ?? "محمد علي",
    desc: pack.desc,
    headline: pack.heroH1,
    subheadline: pack.heroH2,
    books: allBooks,
    giftBookIndex: allBooks.length - 1,
    originalPrice: Number(pack.oldPrice),
    price: Number(pack.price),
    tagline: feminine ? taglineFeminine : tagline,
    urgency: pack.urgency,
    trustLine: pack.trustLine ?? "باقة مختارة بعناية من دار الوِراقة",
    announcement: pack.announcement ?? "توصيل مجاني · الدفع عند الاستلام",
    urgencyText: pack.urgencyText ?? `${pack.packName} كاملة بـ ${pack.price} درهم — توصيل مجاني والدفع عند الاستلام`,
    heroHeadline: pack.heroHeadline ?? pack.heroH1,
    socialProof: pack.socialProof ?? `⭐⭐⭐⭐⭐ (${pack.trustLine})`,
    formHeader: pack.formHeader ?? "لإتمام الطلب، يرجى تعبئة النموذج",
    ctaText: pack.ctaText ?? "تأكيد الطلب — الدفع عند الاستلام",
    category: pack.category ?? pack.packName,
    outcomes: pack.outcomes ?? [],
    forYouIf: pack.forYouIf ?? [],
    notForYouIf: pack.notForYouIf ?? [],
    faqs: [...(pack.faqs ?? []), ...STORE_FAQS],
    previewNote: pack.previewNote,
    crossSell: pack.crossSell ?? [],
    valuePropTitle,
    benefits: allBooks.map((b) => ({
      title: b.title,
      coverUrl: b.coverUrl,
      gift: b.gift,
    })),
    guarantee: feminine ? guaranteesFeminine : guarantees,
    checkout: feminine ? checkoutFeminine : checkout,
    footer: { packName: pack.packName, copyright: footerCopyright },
  };
});

export function getOfferBySlug(slug: string): PackConfig | undefined {
  return offers.find((o) => o.slug === slug);
}
