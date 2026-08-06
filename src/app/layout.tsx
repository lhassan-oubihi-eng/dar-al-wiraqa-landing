import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "باك علم النفس — 5 كتب بـ 199 درهم | دار الوِراقة",
  description: "4 كتب نفسية أساسية + رائقة 'الليالي البيضاء' مجاناً + توصيل مجاني لباب دارك. الدفع عند الاستلام.",
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
        {children}
      </body>
    </html>
  );
}
