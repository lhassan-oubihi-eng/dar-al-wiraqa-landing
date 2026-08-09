/**
 * Central store data for Dar Al Wiraqa.
 * All 6 fixed-price pack offers are defined here and consumed by both the
 * store homepage (/) and the dynamic per-pack landing pages (/[slug]).
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
  bookId?: number;
  gift?: boolean;
}

export interface PackConfig {
  slug: string;
  packName: string;
  emoji: string;
  desc: string;
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
}

export const STORE = {
  name: "دار الوِراقة",
  tagline: "مكتبتك المغربية — كتب مختارة بعناية، توصل لباب دارك",
  copyright: "دار الوِراقة © 2026 — كتب مختارة بعناية، توصيل لباب دارك",
  price: 199,
};

export const OFFER_BOOKS = 4;
export const OFFER_GIFT = 1;

export function coverUrlFor(id: number): string {
  return `/covers/${String(id).padStart(3, "0")}.jpg`;
}

const guarantees = {
  title: "ضمان ذهبي 100%",
  copy: "افتح الكولي، تأكد من الكتوب ديالك، عاد خلص! تسوق بأمان تام ولا تدفع شيئاً حتى تستلم طلبك.",
};

const checkout = {
  title: "أدخل معلوماتك لتأكيد الطلب",
  subtitle: "أنت تحصل على 5 كتب بـ 199 درهم. الدفع يتم عند الاستلام.",
  submitText: "تأكيد الطلب والدفع عند الاستلام 🚀",
};

const footerCopyright = "دار الوِراقة © 2026 — كتب مختارة بعناية، توصيل لباب دارك";

const tagline = "مرحباً بك! 🚚 التوصيل مجاني لجميع مدن المغرب والدفع عند الاستلام.";

export const offers: PackConfig[] = [
  {
    slug: "psychology",
    packName: "باك علم النفس",
    emoji: "🧠",
    desc: "4 كتب نفسية + كتاب هدية 🎁",
    headline: "تحرر من الضغوطات وابدأ رحلة الوعي مع باقة علم النفس المتكاملة",
    subheadline:
      "4 كتب نفسية أساسية تعيد تشكيل طريقة تفكيرك + كتاب 'الليالي البيضاء' مجاناً + توصيل مجاني لباب دارك.",
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
    tagline,
    urgency:
      "🔥 عرض محدود: كتاب 'الليالي البيضاء' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "فهم الأمراض النفسية",
        description:
          "يدعمك على التفريق بين أعراضٍ صحية وتوترٍ يومي، ما يُهدئ قراراتك للطلب الاحترافي.",
        icon: "brain",
        bookId: 7,
      },
      {
        title: "عقدك النفسية سجنك الأبدي",
        description: "يكشف عن الأنماط الخفية التي تكررها ويدعم تحرّكك بثقة خارجها.",
        icon: "lock",
        bookId: 34,
      },
      {
        title: "اغتصاب العقل",
        description:
          "استراتيجياتٌ سريعة تُعيد برمجة افتراضاتك السلبية وتُعيد بناء تفكيرك الإيجابي.",
        icon: "sparkles",
        bookId: 5,
      },
      {
        title: "جلسات نفسية",
        description:
          "جلسات داخلية ترافقك نحو فهم أعمق لنفسك وأدوات فعّالة لمواجهة اليوم.",
        icon: "heart",
        bookId: 35,
      },
      {
        title: "الليالي البيضاء (هدية)",
        description: "رحلة أدبية تعيد لك الاتصال بعاطفتك وتدعم رؤيتك.",
        icon: "book-open",
        bookId: 103,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك علم النفس", copyright: footerCopyright },
  },
  {
    slug: "religious",
    packName: "باك ديني مميز",
    emoji: "🕋",
    desc: "4 كتب دينية + كتاب هدية 🎁",
    headline: "أعد بناء إيمانك وتقويم روحك مع الباقة الدينية المميزة",
    subheadline:
      "4 كتب دينية أساسية تُعيد خطّك إلى الصراط المستقيم + كتاب هدية + توصيل مجاني لباب دارك.",
    books: [
      { id: 246, title: "رسائل من القرآن", author: "أدهم شرقاوي" },
      { id: 243, title: "فاتتني صلاة !!", author: "إسلام جمال" },
      { id: 249, title: "إنك الله", author: "علي بن جابر الفيفي" },
      { id: 244, title: "إن الله معنا", author: "فهد البشارة" },
      { id: 259, title: "رسائل من النبي", author: "أدهم شرقاوي", coverHint: "gift" },
    ],
    giftBookIndex: 4,
    originalPrice: 350,
    price: 199,
    tagline,
    urgency: "🔥 عرض محدود: كتاب 'رسائل من النبي' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "رسائل من القرآن",
        description: "يدعم قراءتك اليومية بتفاسير تعيد لك الاتصال بروح الكتاب.",
        icon: "book-open",
        bookId: 246,
      },
      {
        title: "فاتتني صلاة !!",
        description: "أدعية وتأملات تقرّبك من ربك وتسترجع هدوئك الروحي.",
        icon: "heart",
        bookId: 243,
      },
      {
        title: "إنك الله",
        description: "لحظات تأمل تعيد توازنك الروحي وتعيد لك الصلاة.",
        icon: "sparkles",
        bookId: 249,
      },
      {
        title: "إن الله معنا",
        description: "يقوّي يقينك ويرافقك بالسكينة في أحلك اللحظات.",
        icon: "shield",
        bookId: 244,
      },
      {
        title: "رسائل من النبي (هدية)",
        description: "أمثال نبوية تعيد براءتك وتعيد لك الإيمان.",
        icon: "book-open",
        bookId: 259,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك ديني مميز", copyright: footerCopyright },
  },
  {
    slug: "self-development",
    packName: "باك التطوير الذاتي",
    emoji: "🌱",
    desc: "4 كتب تطوير ذاتي + كتاب هدية 🎁",
    headline: "انطلق نحو أفضل نسخة من نفسك مع باقة التطوير الذاتي المتكاملة",
    subheadline:
      "4 كتب تطوير ذاتي أساسية تعيد برمجة عاداتك + كتاب هدية + توصيل مجاني لباب دارك.",
    books: [
      { id: 40, title: "العادات الذرية", author: "جيمس كليير" },
      { id: 39, title: "فن اللامبالاة", author: "مارك مانسون" },
      { id: 38, title: "نظرية الفستق", author: "فهد عامر الأحمدي" },
      { id: 2, title: "معجزة الصباح", author: "هال إلبرود" },
      { id: 19, title: "قوة العادات", author: "تشارلز دويغ", coverHint: "gift" },
    ],
    giftBookIndex: 4,
    originalPrice: 350,
    price: 199,
    tagline,
    urgency: "🔥 عرض محدود: كتاب 'قوة العادات' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "العادات الذرية",
        description: "يدعمك على بناء روتينٍ يومي مستدام بخطوات بسيطة.",
        icon: "sparkles",
        bookId: 40,
      },
      {
        title: "معجزة الصباح",
        description: "خطوات فعلية تشعل طاقتك من الصباح الباكر.",
        icon: "book-open",
        bookId: 2,
      },
      {
        title: "نظرية الفستق",
        description: "تقنية بسيطة تعيد برمجة استجابتك للعوائق.",
        icon: "brain",
        bookId: 38,
      },
      {
        title: "فن اللامبالاة",
        description: "يحررك من رأي الآخرين ويركز طاقتك على ما يهم فعلاً.",
        icon: "lock",
        bookId: 39,
      },
      {
        title: "قوة العادات (هدية)",
        description: "يدعم تحولك من إرادة عابرة إلى عادة مستدامة.",
        icon: "shield",
        bookId: 19,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك التطوير الذاتي", copyright: footerCopyright },
  },
  {
    slug: "finance",
    packName: "باك المال والاستثمار",
    emoji: "💰",
    desc: "4 كتب استثمار + كتاب هدية 🎁",
    headline: "أدرِ مالك بذكاء مع باقة المال والاستثمار المتكاملة",
    subheadline:
      "4 كتب أساسية في الإدارة المالية وبناء الثروة + كتاب هدية + توصيل مجاني لباب دارك.",
    books: [
      { id: 30, title: "سيكولوجية المال", author: "مورجان هاوسل" },
      { id: 9, title: "الأب الغني والأب الفقير", author: "روبرت كيوساكي" },
      { id: 26, title: "أغنى رجل في بابليون", author: "جورج كلاسون" },
      { id: 47, title: "المستثمر الذكي", author: "بنيامين جراهام" },
      { id: 60, title: "من صفر إلى واحد", author: "بيتر ثييل", coverHint: "gift" },
    ],
    giftBookIndex: 4,
    originalPrice: 350,
    price: 199,
    tagline,
    urgency: "🔥 عرض محدود: كتاب 'من صفر إلى واحد' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "سيكولوجية المال",
        description: "يكشف عن العقلية التي تحرك قراراتك المالية.",
        icon: "brain",
        bookId: 30,
      },
      {
        title: "الأب الغني والأب الفقير",
        description: "مفاهيم استثمارية مبسطة تعيد فكرتك عن الأصول.",
        icon: "book-open",
        bookId: 9,
      },
      {
        title: "أغنى رجل في بابليون",
        description: "قصة تعلمك كيف تبني ثروة مستدامة.",
        icon: "shield",
        bookId: 26,
      },
      {
        title: "المستثمر الذكي",
        description: "المرجع الأساسي لقرارات استثمارية حكيمة وطويلة الأمد.",
        icon: "lock",
        bookId: 47,
      },
      {
        title: "من صفر إلى واحد (هدية)",
        description: "يدعم فكرتك على بناء أعمال من الصفر.",
        icon: "sparkles",
        bookId: 60,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك المال والاستثمار", copyright: footerCopyright },
  },
  {
    slug: "novels",
    packName: "باك الروايات العالمية",
    emoji: "🌍",
    desc: "4 روايات عالمية + كتاب هدية 🎁",
    headline: "سافر إلى عوالم أخرى مع باقة الروايات العالمية المختارة",
    subheadline: "4 روائع أدبية عالمية + كتاب هدية + توصيل مجاني لباب دارك.",
    books: [
      { id: 230, title: "الجريمة والعقاب", author: "دوستويفسكي" },
      { id: 114, title: "مزرعة الحيوان", author: "جورج أورويل" },
      { id: 115, title: "1984", author: "جورج أورويل" },
      { id: 111, title: "ألف شمس ساطعة", author: "خالد حسيني" },
      { id: 149, title: "الأبله", author: "دوستويفسكي", coverHint: "gift" },
    ],
    giftBookIndex: 4,
    originalPrice: 350,
    price: 199,
    tagline,
    urgency: "🔥 عرض محدود: كتاب 'الأبله' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "الجريمة والعقاب",
        description: "رحلة درامية تعيد قراءة إنسانك وتعيد لك الشعور.",
        icon: "book-open",
        bookId: 230,
      },
      {
        title: "مزرعة الحيوان",
        description: "تجربة سياسية تعيد تشكيل نظرتك للقوة.",
        icon: "shield",
        bookId: 114,
      },
      {
        title: "1984",
        description: "تحذير أدبي يعيد لك الوعي بخطر التلاعب.",
        icon: "brain",
        bookId: 115,
      },
      {
        title: "ألف شمس ساطعة",
        description: "سردية مؤثرة عن الصمود والحب وسط رمال الحرب.",
        icon: "heart",
        bookId: 111,
      },
      {
        title: "الأبله (هدية)",
        description: "نقد ذكي يعيد لك مزاج القراءة ويوسّع رؤيتك.",
        icon: "sparkles",
        bookId: 149,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك الروايات العالمية", copyright: footerCopyright },
  },
  {
    slug: "leaders",
    packName: "باك القادة",
    emoji: "⚔️",
    desc: "4 كتب قيادة وقوة + كتاب هدية 🎁",
    headline: "اصنع طريقك نحو القيادة والنجاح مع باقة القادة",
    subheadline:
      "4 كتب عن القيادة والاستراتيجية وبناء الشخصية + كتاب هدية + توصيل مجاني لباب دارك.",
    books: [
      { id: 62, title: "الأمير", author: "نيكولو مكيافيلي" },
      { id: 20, title: "فن الحرب", author: "سون تزو" },
      { id: 55, title: "هكذا تكلم زردشت", author: "فريدريك نيتشه" },
      { id: 69, title: "الإنسان ذلك المجهول", author: "ألكسيس كاريل" },
      { id: 41, title: "عالم صوفي", author: "جوستاين غاردر", coverHint: "gift" },
    ],
    giftBookIndex: 4,
    originalPrice: 350,
    price: 199,
    tagline,
    urgency: "🔥 عرض محدود: كتاب 'عالم صوفي' مجاناً مع أول 50 طلبية هذا الأسبوع فقط.",
    valuePropTitle: "لماذا هذه الكتب تغيّر حياتك؟",
    benefits: [
      {
        title: "الأمير",
        description: "يدعم رؤيتك للسلطة بين الحكمة والمكر.",
        icon: "book-open",
        bookId: 62,
      },
      {
        title: "فن الحرب",
        description: "مبادئ تعيد برمجة تخطيطك للأزمات والاستراتيجيات.",
        icon: "shield",
        bookId: 20,
      },
      {
        title: "هكذا تكلم زردشت",
        description: "أسس تأصيل تعيد موقعك من المعنى والمسؤولية.",
        icon: "brain",
        bookId: 55,
      },
      {
        title: "الإنسان ذلك المجهول",
        description: "رحلة علمية تكشف أسرار الطبيعة الإنسانية وقيادة الذات.",
        icon: "lock",
        bookId: 69,
      },
      {
        title: "عالم صوفي (هدية)",
        description: "بحث في القوة الروحية يعيد لك الوعي بقدراتك الخفية.",
        icon: "sparkles",
        bookId: 41,
        gift: true,
      },
    ],
    guarantee: guarantees,
    checkout,
    footer: { packName: "باك القادة", copyright: footerCopyright },
  },
];

export function getOfferBySlug(slug: string): PackConfig | undefined {
  return offers.find((o) => o.slug === slug);
}
