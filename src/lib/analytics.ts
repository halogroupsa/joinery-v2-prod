import { CANONICAL_URL, SITE } from "@/lib/site";

/**
 * Google Tag Manager + Google Ads (gtag.js) configuration.
 *
 * IDs come from the build environment (they are public, not secrets) and are
 * validated so a typo can't inject markup into every page. Tags only load when
 * the build targets the production origin: staging, preview and local builds
 * would otherwise pollute conversion data and remarketing audiences.
 */
const readId = (value: string | undefined, pattern: RegExp) => {
  const id = value?.trim();
  return id && pattern.test(id) ? id : undefined;
};

const isProductionBuild =
  (process.env.NEXT_PUBLIC_SITE_URL ?? CANONICAL_URL) === CANONICAL_URL;

export const GTM_ID = isProductionBuild
  ? readId(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]+$/)
  : undefined;

export const GOOGLE_ADS_ID = isProductionBuild
  ? readId(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d+$/)
  : undefined;

/** Optional: the conversion label of the Ads "lead" conversion action. */
const GOOGLE_ADS_LEAD_LABEL = readId(
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  /^[A-Za-z0-9_-]+$/,
);

export const analyticsEnabled = Boolean(GTM_ID || GOOGLE_ADS_ID);

type DataLayerEvent = { event: string } & Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Push a custom event for GTM triggers. No-op on the server and when disabled. */
export function pushDataLayer(payload: DataLayerEvent) {
  if (!analyticsEnabled || typeof window === "undefined") return;
  (window.dataLayer ??= []).push(payload);
}

function gtag(...args: unknown[]) {
  if (!GOOGLE_ADS_ID || typeof window === "undefined") return;
  window.gtag?.(...args);
}

/** SPA navigations don't reload the page, so report them explicitly. */
export function trackPageView(path: string) {
  const page = {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  };
  pushDataLayer({ event: "virtual_page_view", ...page });
  gtag("event", "page_view", { send_to: GOOGLE_ADS_ID, ...page });
}

export type LeadMethod = "whatsapp" | "phone" | "email" | "whatsapp_form";

/**
 * A visitor reached out. Always pushed to the dataLayer as `generate_lead` for
 * GTM; also reported straight to Google Ads when a conversion label is set.
 * Configure the Ads conversion in one place only, or leads count twice.
 */
export function trackLead(method: LeadMethod, detail: Record<string, unknown> = {}) {
  pushDataLayer({ event: "generate_lead", lead_method: method, ...detail });
  if (GOOGLE_ADS_LEAD_LABEL) {
    gtag("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
      lead_method: method,
    });
  }
}

/** Classify a contact link, or return null if it isn't one. */
export function leadMethodForHref(href: string): LeadMethod | null {
  if (href.startsWith("tel:")) return "phone";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith(SITE.whatsappUrl)) return "whatsapp";
  return null;
}
