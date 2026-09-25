import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MAINTENANCE_HREF } from "@/data/maintenance";
import { SITE, PRODUCTS, productHref } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="c-footer panel-dark relative overflow-hidden">
      <div className="container-wide py-[clamp(3.5rem,2.5rem+4vw,6rem)]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div>
            <Image
              src="/joinery-logo.webp"
              alt="Joinery.ae"
              width={170}
              height={68}
              className="h-16 w-auto brightness-0 invert lg:h-20"
            />
            <p className="section-lede mt-6 max-w-xs text-paper/65">
              {SITE.description}
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-accent-soft">
              {SITE.facility}
            </p>
          </div>

          {/* Products */}
          <div>
            <p className="eyebrow mb-5">What We Make</p>
            {/* All eleven, not a slice — truncating dropped furniture,
                reception desks and bar counters out of the sitewide
                internal-link graph entirely. */}
            <ul className="grid gap-2 text-sm text-paper/70">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link href={productHref(p.slug)} className="transition-colors hover:text-paper">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <p className="eyebrow mb-5">Explore</p>
            <ul className="grid gap-2 text-sm text-paper/70">
              <li><Link href="/" className="transition-colors hover:text-paper">Home</Link></li>
              <li><Link href="/portfolio" className="transition-colors hover:text-paper">Portfolio</Link></li>
              <li><Link href="/services" className="transition-colors hover:text-paper">Joinery services</Link></li>
              <li><Link href={MAINTENANCE_HREF} className="transition-colors hover:text-paper">Furniture repair &amp; maintenance</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-paper">About</Link></li>
              <li><Link href="/#process" className="transition-colors hover:text-paper">Process</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-paper">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="eyebrow mb-5">Get in Touch</p>
            <ul className="grid gap-3 text-sm text-paper/70">
              <li>
                <a href={`tel:${SITE.phoneE164}`} className="transition-colors hover:text-paper">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-paper">
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?q=Marabea+Street,+Al+Quoz+1,+Dubai,+United+Arab+Emirates&z=15"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Joinery.ae facility location in Google Maps"
                  className="text-paper/55 transition-colors hover:text-paper"
                >
                  {SITE.address.line1}
                  <br />
                  {SITE.address.city}, {SITE.address.country}
                </a>
              </li>
            </ul>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-b border-accent-soft pb-1 text-sm font-semibold uppercase tracking-wide text-accent-soft transition-colors hover:text-paper"
            >
              Start a project <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/12 pt-6 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Bespoke joinery, crafted in Dubai.
          </p>
          <p className="font-mono uppercase tracking-[0.2em]">Digital Experience by Designs Frontier</p>
        </div>
      </div>
    </footer>
  );
}
