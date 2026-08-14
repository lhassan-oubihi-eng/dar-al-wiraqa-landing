"use client";

import { useEffect } from "react";
import Script from "next/script";

const FB_PIXEL_ID = "1566994631594360";

/** Official Meta Pixel base code — defines window.fbq and fires initial PageView */
const FB_PIXEL_BASE = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
`;

export function MetaPixel() {
  /** Track PageView on client-side route changes (App Router) */
  useEffect(() => {
    const w = window as unknown as {
      fbq?: (type: string, eventName: string, params?: Record<string, unknown>) => void;
    };
    if (typeof w.fbq === "function") {
      w.fbq("track", "PageView");
      console.log("���� Meta Pixel PageView tracked (route change)");
    }
  }, []);

  return (
    <>
      {/* Base pixel — injected into <head> before hydration (beforeInteractive) */}
      <Script
        id="fb-pixel-base"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: FB_PIXEL_BASE }}
      />
      {/* Noscript fallback for no-JS visitors */}
      <noscript>
        <img
          height="1"
          width="1"
          src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
          style={{ display: "none" }}
        />
      </noscript>
    </>
  );
}