import { ThankYouClient } from "@/components/ThankYouClient";

export const metadata = {
  title: "تم استلام طلبك — دار الوِراقة",
  description: "شكراً لطلبك من دار الوراقة. سيتصل بك فريقنا لتأكيد الطلب.",
};

/**
 * Meta Pixel noscript fallback for Purchase event on the thank-you page.
 * The actual Purchase event with dynamic value (including upsells) is fired
 * client-side in ThankYouClient.tsx after the order data is read from localStorage.
 */
const FB_PIXEL_ID = "1566994631594360";

export default function ThankYouPage() {
  return (
    <>
      {/* Meta Pixel noscript fallback for Purchase (no-JS visitors) */}
      <noscript>
        <img
          height="1"
          width="1"
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=Purchase&cd[value]=199.00&cd[currency]=MAD&noscript=1`}
          alt=""
        />
      </noscript>
      <ThankYouClient />
    </>
  );
}
