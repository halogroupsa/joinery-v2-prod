import type { Metadata } from "next";
import Link from "next/link";

// A 404 must not inherit the root layout's canonical — that would point every
// missing URL at the homepage. It is explicitly noindex instead.
export const metadata: Metadata = {
  title: "Page not found",
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center bg-paper px-6 pt-[var(--header-h)]">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-5 text-fluid-3xl">This page took a different cut.</h1>
        <p className="section-lede mx-auto mt-4 max-w-md text-ink-soft">
          The page you&apos;re looking for isn&apos;t here. Let&apos;s get you back to the
          workshop.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back home
          </Link>
          <Link href="/portfolio" className="btn-ghost">
            View portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
