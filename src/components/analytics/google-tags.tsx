import Script from "next/script";
import { GOOGLE_ADS_ID, GTM_HOSTNAMES, GTM_ID, isProductionBuild } from "@/lib/analytics";
import { AnalyticsEvents } from "./analytics-events";

/**
 * Loads GTM and the Google Ads tag after hydration so neither blocks first
 * paint. Both share one `window.dataLayer`; the bootstrap runs first so events
 * pushed before the libraries arrive are queued, not lost. GTM is injected by
 * the bootstrap itself, and only when the page is served from joinery.ae.
 */
export function GoogleTags() {
  const loadGtm =
    `if(${JSON.stringify(GTM_HOSTNAMES)}.indexOf(location.hostname)>-1){` +
    "dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});" +
    "var s=document.createElement('script');s.async=true;" +
    `s.src='https://www.googletagmanager.com/gtm.js?id=${GTM_ID}';` +
    "document.head.appendChild(s);}";

  const bootstrap = [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=gtag;",
    loadGtm,
    GOOGLE_ADS_ID && `gtag('js',new Date());gtag('config','${GOOGLE_ADS_ID}');`,
  ]
    .filter(Boolean)
    .join("");

  return (
    <>
      <Script id="google-tags-init" strategy="afterInteractive">
        {bootstrap}
      </Script>
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

/**
 * GTM's no-JS fallback; must be the first thing inside <body>. Without JS the
 * hostname can't be checked, so this is limited to production-origin builds.
 */
export function GoogleTagManagerNoScript() {
  if (!isProductionBuild) return null;
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
