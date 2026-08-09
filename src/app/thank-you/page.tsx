import Script from "next/script";
import { ThankYouClient } from "@/components/ThankYouClient";

export const metadata = {
  title: "تم استلام طلبك — دار الوِراقة",
  description: "شكراً لطلبك من دار الوراقة. سيتصل بك فريقنا لتأكيد الطلب.",
};

/**
 * Meta Pixel Purchase event — fired in the document <head> after the global
 * pixel base (root layout) has initialised `window.fbq` and fired PageView.
 * Because the checkout hard-redirects here, this is a fresh page load, so the
 * COD conversion is attributed to this page.
 */
const FB_PURCHASE = `fbq("track","Purchase",{currency:"MAD",value:199.00});`;

/**
 * Server Component shell for the post-checkout confirmation page.
 * `metadata` must live here (server-side) per Next.js rules; the Purchase
 * event + interactive UI live in the head Script and client child component.
 */
export default function ThankYouPage() {
  return (
    <>
      {/* Purchase event — injected into <head>; base + PageView come from the root layout */}
      <Script
        id="fb-pixel-purchase"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: FB_PURCHASE }}
      />
      <ThankYouClient />
    </>
  );
}
