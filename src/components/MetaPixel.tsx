"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const FB_PIXEL_ID = "1566994631594360";

export function MetaPixel() {
  const pathname = usePathname();

  // Track PageView on EVERY route change
  useEffect(() => {
    const w = window as unknown as {
      fbq?: (type: string, eventName: string, params?: Record<string, unknown>) => void;
    };
    if (typeof w.fbq === "function") {
      w.fbq("track", "PageView");
      console.log(" Meta Pixel PageView tracked:", pathname);
    }
  }, [pathname]);

  return (
    <>
      {/* Base pixel — injected into <head> on EVERY page (beforeInteractive) */}
      <Script
        id="fb-pixel-base"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)
              };
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />

      {/* Noscript fallback — also in <head> for Pixel Helper detection */}
      <Script
        id="fb-pixel-noscript"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            <noscript>
              <img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1"
              />
            </noscript>
          `,
        }}
      />
    </>
  );
}