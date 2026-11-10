import { QUOTATION_TERMS } from "@/lib/site";

type Detail = { title: string; body: string };

export type ServiceGuide = {
  specificationTitle: string;
  specificationIntro: string;
  specifications: Detail[];
  process: Detail[];
  quoteTitle: string;
  quoteInputs: Detail[];
  quoteNote: string;
  scope: Detail[];
};

// Specification choices are discussed against the brief, not advertised as
// universal inclusions or unverified hardware brands and material grades.
export const SERVICE_GUIDES: Partial<Record<string, ServiceGuide>> = {
  wardrobes: {
    specificationTitle: "Choose the inside as carefully as the doors.",
    specificationIntro: "A fitted wardrobe specification should describe the cabinet construction, finish and moving parts separately. These choices affect storage, maintenance and price.",
    specifications: [
      { title: "Carcass and shelving", body: "Agree the board type, thickness, shelf spans, back panels and edge treatment. Hanging space, drawer depths and access to sockets or AC equipment belong in the measured layout." },
      { title: "Doors and finishes", body: "Compare hinged, sliding and open storage around the available clearance. Review veneer, lacquer or laminate samples for colour, grain and sheen before approving the finish." },
      { title: "Hardware and lighting", body: "Identify hinges or sliding tracks, drawer runners, handles and accessories in the quotation. Confirm soft-close operation, lighting, drivers and the electrical connection separately." },
    ],
    process: [
      { title: "Measure the room", body: "A site survey checks wall levels, ceiling height, skirting, door clearance and existing services against your storage brief. Your approximate dimensions help start the discussion; final sizes need checking on site." },
      { title: "Resolve the drawings", body: "Set out hanging rails, shelves, drawers, door openings and fixing details in plans and elevations. Your designer's drawings can form the starting point; check the final layout against site measurements." },
      { title: "Approve the details", body: "Agree drawings, finish samples, fittings, quotation and programme before manufacture. Later changes need a revised cost and schedule." },
      { title: "Make and finish", body: "Panels, doors and interiors are made to the approved drawings and finish specification. Check dimensions, edges and fittings before delivery to the measured space." },
      { title: "Install and check", body: "Fit the units, align doors and drawers, and check the agreed accessories. Record adjustments and care requirements at handover." },
    ],
    scope: [
      { title: "Define the joinery package", body: "List the wardrobe runs, interiors, door finishes, specified fittings, delivery and installation in the written quotation. Check that each requested accessory is included." },
      { title: "Confirm related work", body: "Removal of existing wardrobes, wall repairs, painting, electrical connections and building access arrangements need an agreed owner and price. They are included only when listed." },
      { title: "Understand the price", body: "Height, width, internal layout, door system, finish and hardware change the cost. An initial estimate from photos and dimensions needs a site survey and agreed specification before manufacture." },
      { title: "Prepare for the survey and fitting", body: "Provide access and disclose concealed services or known wall issues. Confirm who empties and removes existing storage, arranges building permissions and lift bookings, protects the delivery route and prepares walls, floors and electrical points before fitting." },
    ],
    quoteTitle: "What to share for a wardrobe quote.",
    quoteInputs: [
      { title: "Room and location", body: "Dubai community, villa or apartment, room photos and any delivery or building access limits." },
      { title: "Approximate dimensions", body: "Wall width, ceiling height and depth available, or a plan with the wardrobe position marked." },
      { title: "Your storage brief", body: "Hanging lengths, drawers, shelves, shoes, accessories and preferred hinged, sliding or open doors." },
      { title: "Finish, budget and timing", body: "Reference images, existing finishes to match, designer drawings if available, an indicative budget and your preferred installation window." },
    ],
    quoteNote: `${QUOTATION_TERMS.consultation} ${QUOTATION_TERMS.pricing} Confirm the programme, payment terms and written warranty coverage before ordering.`,
  },
  kitchens: {
    specificationTitle: "Resolve the cabinet, the finish and the fitting.",
    specificationIntro: "Kitchen cabinets need to suit the room, the appliances and daily use. Agree the construction and interfaces in the specification before comparing quotations.",
    specifications: [
      { title: "Cabinet construction", body: "Identify the carcass and door materials, board thickness, shelf support and edge treatment. Specify the sink unit and areas exposed to moisture separately; a moisture-resistant board is not automatically waterproof." },
      { title: "Fronts and worktops", body: "Review finish samples for colour, grain, sheen and cleaning requirements. Confirm the worktop material, thickness, edge profile, joints and splashback with the responsible supplier." },
      { title: "Hardware and appliances", body: "List hinges, runners, handles, pantry fittings and waste storage. Appliance model numbers determine housings, ventilation, clearances and service access; agree lighting and electrical connections too." },
    ],
    process: [
      { title: "Survey and brief", body: "A site survey checks wall lengths, levels, windows, doors, water points, sockets and extraction against the appliance list. Approximate dimensions help with an estimate; final cabinet sizes need checking on site." },
      { title: "Coordinate the layout", body: "Show storage, preparation space, circulation and appliance housings in plans and elevations. Resolve fixing details, worktop supports, service access and interfaces with stone and other trades before approval." },
      { title: "Approve and schedule", body: "Agree cabinet drawings, finish samples, hardware, scope and programme. Confirm appliance sizes before releasing the cabinetry for manufacture." },
      { title: "Manufacture the cabinets", body: "Cabinetry is cut, assembled and finished to the approved specification. Check dimensions, edges and fittings, and coordinate delivery around the agreed readiness of the room." },
      { title: "Install and hand over", body: "Fit and align cabinets, doors and drawers. Coordinate worktop and appliance interfaces, then record final adjustments and care requirements." },
    ],
    scope: [
      { title: "Define the cabinetry package", body: "List cabinets, islands, pantry units, fronts, specified hardware, delivery and installation. Confirm drawings and sample approvals as part of the agreed scope." },
      { title: "Separate the other trades", body: "Stone, splashbacks, appliances, plumbing, electrical work, extraction, demolition, tiling and building approvals are included only when expressly listed. Name who supplies, connects and signs off each item." },
      { title: "Compare like for like", body: "Cabinet dimensions, finish, hardware, worktop scope, appliance integration and site access affect the price. A cabinetry quote does not by itself cover a complete kitchen renovation." },
      { title: "Prepare the room and appliance details", body: "Provide appliance model sheets and flag any services being moved. Confirm who clears cupboards, arranges permissions and lift bookings, protects access routes and completes walls, floors and service points. Agree a fitting sequence and plan for kitchen downtime with the project team." },
    ],
    quoteTitle: "What to share for a kitchen quote.",
    quoteInputs: [
      { title: "Plan and room photos", body: "Dubai location, approximate wall lengths, ceiling height and photos showing the existing layout and service points." },
      { title: "Appliances and storage", body: "Model numbers or dimensions, appliances being retained, pantry needs, drawer preferences and any island or seating requirement." },
      { title: "Materials and references", body: "Cabinet style, finish images, worktop preferences and your designer's drawings where available." },
      { title: "Scope, budget and access", body: "Cabinetry only or related work, items to remove, building restrictions, an indicative budget and your preferred installation window." },
    ],
    quoteNote: `${QUOTATION_TERMS.consultation} ${QUOTATION_TERMS.pricing} Confirm worktops, appliances and other trades separately, together with the programme, payment terms and written warranty coverage.`,
  },
};
