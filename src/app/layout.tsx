import type { Metadata } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "دار الوِراقة — مكتبتك المغربية | الدفع عند الاستلام",
  description:
    "باقات 5 كتب مختارة بعناية بـ 199 درهم شامل التوصيل، الدفع نقداً عند الاستلام لجميع مدن المغرب.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="h-full scroll-smooth">
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ background: "var(--color-paper)" }}
      >
        {/* Meta Pixel base + PageView on route changes */}
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}