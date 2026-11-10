import type { JoineryPage } from "@/data/joinery-pages";
import type { ServiceGuide } from "@/data/service-guides";

export type ProcessStep = {
  title: string;
  body: string;
  image: { folder: string; base: string; alt: string };
};

const WORKSHOP_IMAGES = [
  { folder: "portraits", base: "j5", alt: "Joiners measuring and marking a panel" },
  { folder: "portraits", base: "j10", alt: "Joiners reviewing technical drawings at a workbench" },
  { folder: "portraits", base: "j15", alt: "Joiners inspecting the grain and finish of a veneer panel" },
  { folder: "portraits", base: "j1", alt: "A joiner sanding a panel before finishing" },
] as const;

/** Existing catalogue images illustrate the stages without adding project claims. */
export function serviceProcess(page: JoineryPage, guide?: ServiceGuide): ProcessStep[] {
  const steps = guide?.process ?? [
    { title: "Measure and brief", body: "Review the room, dimensions, existing services and the way the joinery needs to work within the space." },
    { title: "Resolve the drawings", body: "Coordinate the layout, junctions and fittings in the technical drawings, using your designer's brief where available." },
    { title: "Agree the details", body: "Confirm the drawings, finish samples, quotation and programme before manufacture. Review the effect of any later changes." },
    { title: "Make and finish", body: "Fabricate and finish the agreed joinery in Al Quoz, with the details checked against the approved specification." },
    { title: "Fit and review", body: "Coordinate delivery and fitting around site readiness, then review the finished work, adjustments and care requirements." },
  ];

  return steps.map((step, index) => ({
    ...step,
    image: WORKSHOP_IMAGES[index] ?? page.image,
  }));
}
