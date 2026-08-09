import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { offers, getOfferBySlug } from "@/data/offers";
import { PackLanding } from "@/components/PackLanding";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return offers.map((pack) => ({ slug: pack.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pack = getOfferBySlug(slug);
  if (!pack) return {};
  return {
    title: `${pack.packName} — 5 كتب بـ ${pack.price} درهم | دار الوِراقة`,
    description: pack.subheadline,
  };
}

export default async function PackPage({ params }: PageProps) {
  const { slug } = await params;
  const pack = getOfferBySlug(slug);
  if (!pack) notFound();

  return <PackLanding pack={pack} />;
}
