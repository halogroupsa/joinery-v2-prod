"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { MAINTENANCE_HREF } from "@/data/maintenance";
import { SITE, PRODUCTS, productHref } from "@/lib/site";

const NAV = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Craft", href: "/#craft" },
  { label: "Process", href: "/#process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Nav entries that point at an on-page section rather than a route ("/#craft"
// -> "craft"). These need a scroll-spy to stay lit, since the pathname alone
// can't tell us where on the home page we are.
const SECTION_IDS = NAV.filter((item) => item.href.startsWith("/#")).map((item) =>
  item.href.slice(2),
);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const sectionIds = pathname === "/" ? SECTION_IDS : [];

    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      if (!sectionIds.length) {
        setActiveSection(null);
        return;
      }
      // A section counts as "current" while it straddles the line just below
      // the fixed header — the same line the anchor jump parks it at.
      const probeY = (headerRef.current?.offsetHeight ?? 72) + 1;
      let current: string | null = null;
      // Resolved every pass rather than cached: the sections sit after pinned
      // scroll scenes whose height settles after mount.
      for (const id of sectionIds) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= probeY && rect.bottom > probeY) {
          current = id;
          break;
        }
      }
      setActiveSection(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Every primary page opens with a dark hero, so use light chrome (transparent
  // bar + inverted logo) at the top of those routes; solid paper once scrolled.
  const DARK_HERO_ROUTES = ["/", "/about", "/contact", "/portfolio", "/services"];
  const darkChrome = (DARK_HERO_ROUTES.includes(pathname) || pathname.startsWith("/services/")) && !scrolled && !mobileOpen;

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/" && activeSection === href.slice(2);
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "c-header fixed inset-x-0 top-0 z-40 transition-colors duration-base ease-out-soft",
          scrolled
            ? "border-b border-rule bg-paper text-ink"
            : darkChrome
              ? "border-b border-transparent bg-transparent text-paper"
              : "border-b border-rule bg-paper text-ink",
        )}
      >
        {darkChrome && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(var(--header-h)+2.5rem)] bg-gradient-to-b from-carbon/70 to-transparent"
          />
        )}
        <div className="container-wide relative flex h-[var(--header-h)] items-center justify-between gap-6">
          {/* Mobile menu button — left */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded border-2 lg:hidden",
              darkChrome ? "border-paper/70 text-paper" : "border-ink/25 text-ink",
            )}
          >
            <Menu size={20} aria-hidden />
          </button>

          <Link
            href="/"
            className="inline-flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0"
            aria-label="Joinery.ae — home"
          >
            <Image
              src="/joinery-logo.webp"
              alt="Joinery.ae"
              width={200}
              height={80}
              priority
              className={cn(
                "h-20 w-auto transition-[filter] duration-base lg:h-[4.5rem]",
                darkChrome && "brightness-0 invert",
              )}
            />
          </Link>

          {/* Matches halo-ae-next's `.main-menu ul li a`: the display face at
              --text-small, weight 400, uppercase, no extra tracking. */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap font-display text-sm font-normal uppercase tracking-normal transition-colors hover:text-accent",
                  isActive(item.href) && "text-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneE164}`}
              className={cn(
                "hidden items-center gap-2 font-display text-sm font-normal uppercase tracking-normal transition-colors hover:text-accent md:inline-flex",
              )}
            >
              <Phone size={15} aria-hidden />
              <span className="hidden xl:inline">{SITE.phone}</span>
            </a>
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden rounded-xs px-5 py-2.5 font-display text-sm font-normal uppercase tracking-normal transition-colors md:inline-flex",
                darkChrome
                  ? "bg-paper text-ink hover:bg-accent hover:text-paper"
                  : "bg-accent text-paper hover:bg-accent-deep",
              )}
            >
              Start a Project
            </a>
            {/* Mobile call icon — right */}
            <a
              href={`tel:${SITE.phoneE164}`}
              aria-label={`Call ${SITE.phone}`}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded border-2 md:hidden",
                darkChrome ? "border-paper/70 text-paper" : "border-ink/25 text-ink",
              )}
            >
              <Phone size={20} aria-hidden />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "visible" : "invisible")}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={cn(
            "absolute inset-0 bg-carbon/50 transition-opacity duration-base",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(420px,92vw)] flex-col overflow-y-auto bg-paper px-6 py-5 shadow-xl transition-transform duration-base ease-out-soft",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Image src="/joinery-logo.webp" alt="Joinery.ae" width={200} height={80} className="h-20 w-auto" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded border-2 border-ink/25"
            >
              <X size={20} aria-hidden />
            </button>
          </div>

          {/* Link sizing matches halo-ae-next's .mobile-sidebar-menu, which
              runs both link levels at --text-small (14 -> 15px). */}
          <nav className="mt-10 grid gap-1" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "border-b border-rule/60 py-3 font-display text-sm font-normal uppercase transition-colors hover:text-accent",
                  isActive(item.href) && "text-accent",
                )}
              >
                {item.label}
              </Link>
            ))}
            {/* Not in NAV: the desktop bar is already at its width budget at lg,
                so this one lives in the drawer, the footer and /services. */}
            <Link
              href={MAINTENANCE_HREF}
              onClick={() => setMobileOpen(false)}
              aria-current={isActive(MAINTENANCE_HREF) ? "page" : undefined}
              className={cn(
                "border-b border-rule/60 py-3 font-display text-sm font-normal uppercase transition-colors hover:text-accent",
                isActive(MAINTENANCE_HREF) && "text-accent",
              )}
            >
              Repair &amp; maintenance
            </Link>
          </nav>

          <div className="mt-8">
            <p className="eyebrow mb-3">What we make</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-ink-soft">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={productHref(p.slug)}
                    onClick={() => setMobileOpen(false)}
                    className="transition-colors hover:text-accent"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto grid gap-2 pt-8">
            <a
              href={SITE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center"
            >
              Start a Project
            </a>
            <a href={`tel:${SITE.phoneE164}`} className="mt-2 text-center text-sm text-ink-mute">
              Or call {SITE.phone}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
