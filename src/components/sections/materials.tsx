import { Layers, Droplets, Flame, Wrench, BadgeCheck } from "lucide-react";

const MATERIALS = [
  { icon: Layers, label: "Substrate and finish", body: "Agree the board, veneer, laminate or lacquer, including edging and sample approval." },
  { icon: Droplets, label: "Moisture exposure", body: "Specify sink units and wet-area details separately. Moisture resistance is not the same as waterproofing." },
  { icon: Flame, label: "Fire performance", body: "Where required, confirm the tested product or assembly and its documentation for that use." },
  { icon: Wrench, label: "Hardware and care", body: "Record the fittings, adjustment needs, cleaning advice and access for maintenance." },
  { icon: BadgeCheck, label: "Written warranty terms", body: "Confirm the coverage, duration and exclusions for the workmanship and selected components." },
];

export function Materials() {
  return (
    <section id="materials" className="c-materials section bg-paper-warm">
      <div className="container-wide">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow reveal">Material Performance</p>
          <h2 className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
            The right specification for the room.
          </h2>
          <p className="section-lede mt-6 text-ink-soft">Performance depends on the material, finish and installation. Agree these details against your project rather than applying one guarantee to every piece of joinery.</p>
        </div>

        {/* Hairline grid */}
        <ul className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
          {MATERIALS.map(({ icon: Icon, label, body }) => (
            <li
              key={label}
              className="reveal flex flex-col bg-paper px-6 py-8"
            >
              <Icon size={26} strokeWidth={1.5} className="text-ink" aria-hidden />
              <h3 className="mt-5 font-display text-xl">{label}</h3>
              <p className="section-lede mt-3 text-ink-soft">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
