import Script from "next/script";
import { GOOGLE_ADS_ID, GTM_ID, analyticsEnabled } from "@/lib/analytics";
import { AnalyticsEvents } from "./analytics-events";

/**
 * Loads GTM and the Google Ads tag after hydration so neither blocks first
 * paint. Both share one `window.dataLayer`; the bootstrap runs first so events
 * pushed before the libraries arrive are queued, not lost.
 */
export function GoogleTags() {
  if (!analyticsEnabled) return null;

  const bootstrap = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    GTM_ID && "dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});",
    GOOGLE_ADS_ID && `gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`,
  ]
    .filter(Boolean)
    .join("");

  return (
    <>
      <Script id="google-tags-init" strategy="afterInteractive">
        {bootstrap}
      </Script>
      {GTM_ID && (
        <Script
          id="gtm"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        />
      )}
      {GOOGLE_ADS_ID && (
        <Script
          id="google-ads"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
      )}
      <AnalyticsEvents />
    </>
  );
}

/** GTM's no-JS fallback; must be the first thing inside <body>. */
export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
