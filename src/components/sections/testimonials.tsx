const TESTIMONIALS = [
  {
    quote:
      "The craftsmanship exceeded all expectations. Every detail of our fitted wardrobes is absolutely perfect.",
    name: "Sarah Mitchell",
    detail: "Fitted Wardrobes — Villa, Dubai",
  },
  {
    quote:
      "From design to installation, the team was professional and meticulous. Our kitchen is now the heart of our home.",
    name: "James Al-Rashid",
    detail: "Kitchen Cabinetry — Penthouse, Abu Dhabi",
  },
  {
    quote:
      "Incredible attention to detail. The wall paneling transformed our office into something truly remarkable.",
    name: "Elena Vasquez",
    detail: "Wall Paneling — Commercial Office",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="c-testimonials section bg-paper">
      <div className="container-wide">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow reveal">Testimonials</p>
          <h2 className="reveal mt-5 text-fluid-3xl text-balance" data-delay="1">
            Client Stories
          </h2>
        </div>

        {/* Cards */}
        <ul className="mt-14 grid gap-6 md:grid-cols-3 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.name} className="reveal" data-delay={String(i + 1)}>
              <figure className="flex h-full flex-col border border-rule bg-paper p-8 transition-colors duration-base hover:bg-paper-warm lg:p-10">
                <blockquote className="section-lede flex-1 italic text-ink-soft">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8">
                  <div className="font-semibold text-ink">{t.name}</div>
                  <div className="mt-1.5 text-sm text-ink-mute">{t.detail}</div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
