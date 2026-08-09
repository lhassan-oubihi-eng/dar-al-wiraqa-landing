import Script from "next/script";
import { ThankYouClient } from "@/components/ThankYouClient";

export const metadata = {
  title: "تم استلام طلبك — دار الوِراقة",
  description: "شكراً لطلبك من دار الوراقة. سيتصل بك فريقنا لتأكيد الطلب.",
};

/** Your Meta Pixel ID (hardcoded per project). */
const FB_PIXEL_ID = "1566994631594360";

/**
 * Meta Pixel base code — loaded in the document <head> via next/script.
 * It bootstraps `window.fbq`, inits the pixel, fires a PageView, and then
 * fires the Purchase event for the completed COD order (fixed 199 MAD).
 */
const FB_PIXEL_BASE =
  `!function(f,b,e,v,n,t,s){if(f.pixel&&f.pixel._loaded){return;n=f.pixel.n;};n=f.pixel;if(!n){n=f.pixel=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.queue=n.queue||[];};n._loaded=!0;n.version="2.0";n.getAndCreateEvent=function(id){return!1};var t=b.createElement(e);t.async=!0;t.src=v;t.referrerPolicy="no-referrer-when-downgrade";var s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${FB_PIXEL_ID}");fbq("track","PageView");fbq("track","Purchase",{currency:"MAD",value:199.00});`;

/**
 * Server Component shell for the post-checkout confirmation page.
 * `metadata` must live here (server-side) per Next.js rules; the Purchase
 * event firing + interactive UI live in the client child component.
 */
export default function ThankYouPage() {
  return (
    <>
      {/* Meta Pixel base — injected into <head>; establishes window.fbq */}
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: FB_PIXEL_BASE }}
      />
      <ThankYouClient />
    </>
  );
}
