import type { Metadata } from "next";
import Script from "next/script";
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

/** Your Meta Pixel ID (DarAlWaraqa-Pixel). */
const FB_PIXEL_ID = "1566994631594360";

/**
 * Meta Pixel base code — loaded in the document <head> via next/script on
 * every page. It bootstraps `window.fbq`, inits the pixel, and fires a
 * PageView so each route (homepage, pack pages, thank-you) is tracked.
 */
const FB_PIXEL_BASE =
  `!function(f,b,e,v,n,t,s){if(f.pixel&&f.pixel._loaded){return;n=f.pixel.n;};n=f.pixel;if(!n){n=f.pixel=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.queue=n.queue||[];};n._loaded=!0;n.version="2.0";n.getAndCreateEvent=function(id){return!1};var t=b.createElement(e);t.async=!0;t.src=v;t.referrerPolicy="no-referrer-when-downgrade";var s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${FB_PIXEL_ID}");fbq("track","PageView");`;

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
        {/* Meta Pixel base — injected into <head>; establishes window.fbq + PageView */}
        <Script
          id="fb-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: FB_PIXEL_BASE }}
        />
        {children}
      </body>
    </html>
  );
}
