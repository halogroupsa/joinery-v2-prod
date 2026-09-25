/**
 * Copy for /services/maintenance-repair.
 *
 * Deliberately NOT a JOINERY_PAGES entry. Those all answer "what we make" and
 * render through /services/[slug], whose headings ("What we can make", "Before
 * the drawings begin"), portfolio gallery and related-products rail are all
 * built around that intent. Repair intent needs the intake flow instead, and
 * adding it to PRODUCTS would inject an imageless category into the portfolio
 * filter, the home work-showcase panels and the About capabilities grid.
 *
 * SEO note: the "furniture repair Dubai" SERP is owned by handyman and AMC
 * aggregators who subcontract the actual woodwork. Our wedge is the workshop —
 * we can remake a matching part rather than patch it — so the copy leans on
 * that everywhere, and the same-finish/other-company angles are the long-tail
 * nobody else on that SERP can honestly write.
 */

export const MAINTENANCE_HREF = "/services/maintenance-repair";

/** Repair categories. Each heading carries a head term people actually type. */
export const REPAIR_SCOPE = [
  {
    n: "01",
    title: "Wardrobe repairs",
    body: "Sliding doors that jump the track, hinged doors that catch, sagging shelves, worn runners and soft-close mechanisms that no longer close soft. We realign, re-hinge and replace the hardware rather than working around it.",
  },
  {
    n: "02",
    title: "Kitchen cabinet repairs",
    body: "Misaligned cabinet doors and drawers, failed hinges and runners, lifting edge-banding, damaged carcasses and worktop junctions that have opened up. Handles and mechanisms can be replaced or upgraded at the same visit.",
  },
  {
    n: "03",
    title: "Door repairs & realignment",
    body: "Doors that bind, drop or refuse to latch, dropped pivots, worn floor springs, damaged frames and architraves. Heavy pivot and flush doors are re-hung and rebalanced so they swing and stop where they should.",
  },
  {
    n: "04",
    title: "Water & moisture damage",
    body: "Swollen bases under sinks, blown panels behind leaking plumbing, delaminated vanity units and warped bathroom joinery. Where the substrate has gone, we replace it in a waterproof board so the same failure does not repeat.",
  },
  {
    n: "05",
    title: "Furniture restoration & polishing",
    body: "Scratches, dents, heat marks, sun-faded lacquer and tired veneer. We colour-match, fill, re-spray and polish — on site where the damage is local, back at the workshop where a full refinish or wood restoration gives the better result.",
  },
  {
    n: "06",
    title: "Office & commercial joinery",
    body: "Reception desks, meeting tables, storage walls and panelling that take daily wear. We work around occupied floors and can schedule out of hours so a repair does not shut down a working office.",
  },
];

/** The intake flow, mirrored into HowTo schema on the page. */
export const REPAIR_STEPS = [
  {
    n: "01",
    title: "Tell us what happened",
    body: "Call or WhatsApp us with a short description, and send photos of the damage if you can. Pictures of the piece, the broken detail and the surrounding finish usually tell us most of what we need.",
  },
  {
    n: "02",
    title: "We inspect it",
    body: "For anything beyond the obvious, we arrange a site visit. Our joiner measures, checks the substrate and hardware, and works out whether the piece is repaired in place or brought back to Al Quoz.",
  },
  {
    n: "03",
    title: "You get a written quotation",
    body: "An itemised quote covering parts, labour and finish, with the expected duration. If a piece is beyond economic repair we say so, and price the replacement instead.",
  },
  {
    n: "04",
    title: "We schedule and repair",
    body: "Once you approve, we book a date that suits the property or the office. Our own team carries out the work, protects the surrounding area and clears up before leaving.",
  },
];

export const MAINTENANCE_FAQ = [
  {
    question: "Are you a carpentry company or a joinery manufacturer?",
    answer:
      "Both, and for a repair that matters. Our carpenters carry out the on-site work — realignment, re-hinging, refitting and finishing — and behind them is a 15,000 sq.ft. manufacturing workshop in Al Quoz. Most carpentry services in Dubai have to source a replacement part when something is beyond repair. We can make it.",
  },
  {
    question: "Where are you based, and which areas do you cover?",
    answer:
      "Our carpentry workshop is on Marabea Street in Al Quoz 1, which is where site teams and materials go out from. We attend repairs across Dubai — villas, apartments, offices, hotels and retail — and travel to the wider UAE for larger maintenance packages.",
  },
  {
    question: "Do you repair sofas and upholstery?",
    answer:
      "No. We are joiners and carpenters, so we work in wood, board, veneer and laminate — wardrobes, cabinets, doors, panelling, tables and fitted furniture. Upholstery, fabric and foam are a different trade, and we would rather tell you that than take the job and subcontract it. Timber sofa and bed frames we can repair.",
  },
  {
    question: "Do you repair joinery that another company installed?",
    answer:
      "Yes. Most of the repair work we take on was originally built by someone else — a developer's contractor, an imported flat-pack system or a previous fit-out. We inspect what is there, work out why it failed and repair or remake the affected part. You do not need to know who built it.",
  },
  {
    question: "Can you match the finish on existing furniture?",
    answer:
      "Usually, yes. Because we run our own spray and finishing line in Al Quoz, we can colour-match lacquers and source veneers to blend a repair into the surrounding piece. Where an exact match is not achievable — a discontinued laminate, or a finish that has aged in sunlight — we tell you before quoting and suggest the closest practical option.",
  },
  {
    question: "What if a part is too damaged to repair?",
    answer:
      "We remake it. That is the advantage of having a 15,000 sq.ft. workshop behind the service: a shattered wardrobe door, a blown vanity carcass or a cracked panel can be manufactured again to the original dimensions and finish, rather than patched or replaced with the nearest stock item.",
  },
  {
    question: "How much does furniture repair cost in Dubai?",
    answer:
      "It depends entirely on the damage. A hinge realignment or a soft-close replacement is a short visit; a re-sprayed kitchen or a remade door is a workshop job. We do not quote a figure until someone has seen the piece, either in photographs or on site, so the number you receive is the number you pay.",
  },
  {
    question: "Do you charge for the inspection visit?",
    answer:
      "Send photographs first — a great many jobs can be assessed and quoted from images alone at no cost. Where a site visit is needed, we confirm any inspection charge with you in advance, and it is credited against the works if you proceed.",
  },
  {
    question: "Do you offer annual maintenance contracts for joinery?",
    answer:
      "Yes. For villas, offices, hotels and retail spaces with a lot of joinery, an annual maintenance contract covers scheduled inspections and adjustments — hinges, runners, alignment and finish touch-ups — before small faults turn into replacements. Contracts are priced on the volume of joinery and the number of visits.",
  },
  {
    question: "Can you attend snagging and defect rectification on a handover?",
    answer:
      "Yes. We work with developers, fit-out contractors and facilities teams on snagging lists and defect liability periods, rectifying joinery items across a unit or a whole floor and reporting back on what was done.",
  },
  {
    question: "How quickly can you attend?",
    answer:
      "Send the details and we will come back the same working day with next steps. Inspection visits are typically arranged within a few working days, and straightforward repairs are often completed on the visit itself. Genuinely urgent situations — a door that will not secure, a unit blocking a kitchen — are prioritised.",
  },
];

/** Trust strip under the hero. */
export const MAINTENANCE_PROOF = [
  { k: "Any joinery", v: "Ours or another company's" },
  { k: "Photo or site", v: "Assessed before quoting" },
  { k: "Written quote", v: "Itemised, before work starts" },
  { k: "Own workshop", v: "Parts remade, not patched" },
];

export const MAINTENANCE_AREAS = [
  "Villas & apartments",
  "Offices & workplaces",
  "Hotels & hospitality",
  "Retail & showrooms",
  "Developer handovers",
  "Facilities management",
];
