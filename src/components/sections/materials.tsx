import {
  Droplets,
  Flame,
  ShieldCheck,
  Bug,
  Leaf,
  Shield,
  ArrowUpDown,
  RotateCcw,
  Recycle,
  BadgeCheck,
} from "lucide-react";

const MATERIALS = [
  { icon: Droplets, label: "100% Waterproof" },
  { icon: Flame, label: "100% Fire Resistant" },
  { icon: ShieldCheck, label: "100% Mold Proof" },
  { icon: Bug, label: "100% Bacteria Resistant" },
  { icon: Leaf, label: "100% Fungus Resistant" },
  { icon: Shield, label: "100% Termite Proof" },
  { icon: ArrowUpDown, label: "No Swelling or Shrinking" },
  { icon: RotateCcw, label: "No Decay or Warping" },
  { icon: Recycle, label: "Recyclable & Eco-Friendly" },
  { icon: BadgeCheck, label: "Lifetime Guarantee" },
];

export function Materials() {
  return (
    <section id="materials" className="c-materials section bg-paper-warm">
      <div className="container-wide">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow reveal">Material Performance</p>
          <h2 className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
            Built with High-Performance Materials
          </h2>
        </div>

        {/* Hairline grid */}
        <ul className="mt-14 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-5">
          {MATERIALS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="reveal flex flex-col items-center gap-4 bg-paper px-5 py-10 text-center transition-colors duration-base hover:bg-paper-warm"
            >
              <Icon size={26} strokeWidth={1.5} className="text-ink" aria-hidden />
              <span className="text-sm font-medium text-ink-soft">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
