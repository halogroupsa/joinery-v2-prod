export const CANONICAL_URL = "https://joinery.ae";

export const productHref = (slug: string) => `/services/${slug}`;

export const SITE = {
  name: "Joinery.ae",
  legalName: "Halo Joinery",
  tagline: "Bespoke In-House Joinery, Dubai",
  description:
    "Bespoke joinery in Dubai, designed, manufactured and installed in-house from our Al Quoz facility. Custom wardrobes, kitchens, doors, wall panels and architectural furniture for homes and commercial interiors.",
  // Keep crawl URLs on the public domain, regardless of local build settings.
  url: CANONICAL_URL,
  phone: "+971 55 969 3009",
  phoneE164: "+971559693009",
  whatsapp: "971559693009",
  whatsappUrl: "https://wa.me/971559693009",
  email: "hello@joinery.ae",
  address: {
    line1: "Marabea Street, Al Quoz 1",
    line2: "P.O. Box 26800",
    city: "Dubai",
    country: "United Arab Emirates",
  },
  facility: "15,000 sq.ft. joinery facility in Al Quoz, Dubai",
  social: {
    instagram: "https://instagram.com/joinery.ae",
    linkedin: "https://linkedin.com/company/joinery-ae",
  },
  stats: {
    years: 25,
    projects: 1000,
    team: 200,
  },
} as const;

export const NAV_MAIN = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
] as const;

/** The product taxonomy — each maps to an optimized image folder under /img. */
export type ProductCategory = {
  slug: string;
  title: string;
  short: string;
  description: string;
  /** folder under public/img/ holding the optimized webp variants */
  folder: string;
};

export const PRODUCTS: ProductCategory[] = [
  {
    slug: "wardrobes",
    title: "Wardrobes",
    short: "Walk-in, hinged & sliding",
    description:
      "Walk-in, hinged and sliding wardrobes with bespoke internal fittings and premium finishes, engineered to the millimetre.",
    folder: "wardrobes",
  },
  {
    slug: "kitchens",
    title: "Kitchens",
    short: "Modular & handcrafted",
    description:
      "Luxury modular and handcrafted kitchens manufactured in-house with precision engineering and premium European hardware.",
    folder: "kitchens",
  },
  {
    slug: "doors",
    title: "Custom Doors",
    short: "Pivot, flush & sliding",
    description:
      "Bespoke pivot, sliding, flush and entrance doors crafted for presence — balanced, silent and built to last.",
    folder: "doors",
  },
  {
    slug: "wall-panels",
    title: "Wall Panels",
    short: "Fluted, veneer & geometric",
    description:
      "Fluted wood, veneer and custom geometric wall paneling that turns flat walls into architectural surfaces.",
    folder: "wall_panels",
  },
  {
    slug: "wood-ceilings",
    title: "Wood Ceilings",
    short: "Slatted, coffered & curved",
    description:
      "Slatted, grooved, coffered and curved wood ceilings — acoustic and decorative, finished to luxury standard.",
    folder: "wood_ceilings",
  },
  {
    slug: "tv-units",
    title: "TV Units",
    short: "Integrated media joinery",
    description:
      "Floating and built-in media units with concealed wiring, integrated shelving and ambient lighting.",
    folder: "tv_units",
  },
  {
    slug: "feature-walls",
    title: "Feature Walls",
    short: "Backlit & sculpted",
    description:
      "Statement feature walls with backlighting, fluted timber and sculpted geometry as the focal point of a room.",
    folder: "feature_walls",
  },
  {
    slug: "reception-desks",
    title: "Reception Desks",
    short: "First-impression joinery",
    description:
      "Curved, backlit and stone-topped reception desks designed to make a lasting first impression in commercial spaces.",
    folder: "reception_desks",
  },
  {
    slug: "bar-counters-vanities",
    title: "Bar Counters & Vanities",
    short: "Counters & powder rooms",
    description:
      "Luxury bar counters and bathroom vanities with premium tops, integrated lighting and seamless detailing.",
    folder: "bar_counters_vanities",
  },
  {
    slug: "office-furniture",
    title: "Office Furniture",
    short: "Desks & conference",
    description:
      "Executive desks, conference tables and built-in storage that bring residential-grade craft to the workplace.",
    folder: "office_furniture",
  },
  {
    slug: "residential-furniture",
    title: "Residential Furniture",
    short: "Tables, beds & consoles",
    description:
      "Bespoke dining tables, bed headboards, consoles and coffee tables — one-off pieces made to your space.",
    folder: "residential_furniture",
  },
];

export const FAQ_HOME = [
  {
    q: "What is the difference between joinery and carpentry?",
    a: "Carpentry covers structural, site-based woodwork such as framing and fixing. Joinery refers to precision-crafted, factory-made wooden elements — furniture, cabinets, doors, staircases and decorative millwork. We provide both: our in-house joiners craft the elements and our site team installs them.",
  },
  {
    q: "Is all your joinery manufactured in Dubai?",
    a: "Yes. Every piece is produced entirely in our own 15,000 sq.ft. facility in Al Quoz Industrial Area, Dubai. That means full quality control, faster production and no third-party outsourcing costs passed on to you.",
  },
  {
    q: "Can you work from an interior designer's drawings?",
    a: "Absolutely. We regularly work alongside designers, architects and developers. Share your shop drawings, mood boards or concept designs and our team will produce accurate technical drawings and a detailed quote — or design-and-build from scratch.",
  },
  {
    q: "How long does a joinery project typically take?",
    a: "A bespoke wardrobe or kitchen unit typically takes 3–4 weeks from approval to installation. A full villa or office joinery package can take 6–10 weeks. We provide a production schedule with every quote.",
  },
  {
    q: "What sectors do you serve?",
    a: "Residential (villas, apartments), commercial (offices, corporate fit-outs), hospitality (hotels, restaurants, bars) and retail (shops, showrooms, boutiques) across Dubai and the wider UAE.",
  },
  {
    q: "Do you provide a warranty on joinery work?",
    a: "Yes. All joinery produced and installed by us carries a workmanship warranty. Specific terms are included in your project contract and vary by material and project scale.",
  },
  {
    q: "Do you repair and maintain existing joinery?",
    a: "Yes. Our carpentry and repair team works on wardrobes, kitchen cabinets, doors, panelling and bespoke furniture across Dubai — including joinery originally installed by another company. Send photos of the damage, we inspect and issue a written quotation, then carry out the repair on a scheduled date. Where a part is beyond repair we remake it in our Al Quoz workshop and colour-match the finish.",
  },
];

export const MATERIAL_PROMISES = [
  "100% Waterproof",
  "100% Fire Resistant",
  "100% Mold Proof",
  "100% Bacteria Resistant",
  "100% Termite Proof",
  "No Swelling or Shrinking",
  "No Decay or Warping",
  "Recyclable & Eco-friendly",
  "Lifetime Guarantee",
];

export const DEVELOPER_LOGOS = [
  { name: "Emaar", src: "/logos/partners/emaar.webp", width: 963, height: 193, heightClass: "h-8" },
  { name: "Meraas", src: "/logos/partners/meraas.webp", width: 1733, height: 439, heightClass: "h-12" },
  { name: "Damac", src: "/logos/partners/damac.webp", width: 588, height: 144, heightClass: "h-12" },
  { name: "Aldar", src: "/logos/partners/aldar.webp", width: 70, height: 64, heightClass: "h-12" },
  { name: "Nakheel", src: "/logos/partners/nakheel.webp", width: 62, height: 64, heightClass: "h-12" },
  { name: "Sobha", src: "/logos/partners/sobha.webp", width: 132, height: 64, heightClass: "h-12" },
  { name: "Omniyat", src: "/logos/partners/omniyat.webp", width: 104, height: 64, heightClass: "h-12" },
  { name: "Meydan", src: "/logos/partners/meydan.webp", width: 179, height: 171, heightClass: "h-12" },
  { name: "Ellington", src: "/logos/partners/ellington.webp", width: 456, height: 176, heightClass: "h-12" },
  { name: "Dubai Properties", src: "/logos/partners/dubai-properties.webp", width: 216, height: 144, heightClass: "h-12" },
];

export type Faq = (typeof FAQ_HOME)[number];
