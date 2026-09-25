import { Hero } from "@/components/sections/hero";
import { PromisesMarquee } from "@/components/sections/promises-marquee";
import { Manifesto } from "@/components/sections/manifesto";
import { WorkShowcase } from "@/components/sections/work-showcase";
import {
  DoorsDoorReveal,
  WardrobeDoorReveal,
} from "@/components/sections/category-door-reveal";
import { KitchenMaterialAtlas } from "@/components/sections/kitchen-material-atlas";
import { Craft } from "@/components/sections/craft";
import { JoineryPortraits } from "@/components/sections/joinery-portraits";
import { DeveloperLogos } from "@/components/sections/developer-logos";
import { Process } from "@/components/sections/process";
import { Aftercare } from "@/components/sections/aftercare";
import { Materials } from "@/components/sections/materials";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { SITE, FAQ_HOME } from "@/lib/site";
import { BUSINESS_ID, BUSINESS_SCHEMA } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    BUSINESS_SCHEMA,
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      alternateName: SITE.legalName,
      url: SITE.url,
      publisher: { "@id": BUSINESS_ID },
      inLanguage: "en-AE",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_HOME.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <PromisesMarquee />
      <Manifesto />
      <WorkShowcase />
      <DoorsDoorReveal />
      <KitchenMaterialAtlas />
      <WardrobeDoorReveal />
      <Craft />
      <JoineryPortraits />
      <DeveloperLogos />
      <Process />
      <Aftercare />
      <Materials />
      <Testimonials />
      <FAQ />
      <CtaBand />
    </>
  );
}
