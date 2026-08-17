import { Metadata } from "next";
import { offers, getOfferBySlug } from "@/data/offers";
import { CheckoutPageClient } from "./CheckoutPageClient";

interface CheckoutPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return offers.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pack = getOfferBySlug(slug);
  if (!pack) return {};

  return {
    title: `${pack.packName} — 5 كتب بـ ${pack.price} درهم | دار الوِراقة`,
    description: pack.subheadline,
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const pack = getOfferBySlug(slug);
  if (!pack) {
    return <div>باقة غير موجودة</div>;
  }

  return <CheckoutPageClient pack={pack} />;
}