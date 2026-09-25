"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { SITE, PRODUCTS } from "@/lib/site";
import { trackLead } from "@/lib/analytics";

const FIELD =
  "w-full rounded-xs border border-rule-strong bg-paper px-4 py-3 text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";
const LABEL = "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft";

/** Static-site friendly: composes a WhatsApp (or email) message from the form. */
export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const composed = useMemo(() => {
    const lines = [
      "New project enquiry — Joinery.ae",
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      category && `Interested in: ${category}`,
      message && `Details: ${message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [name, phone, category, message]);

  const waHref = `${SITE.whatsappUrl}?text=${encodeURIComponent(composed)}`;
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    "Project enquiry — Joinery.ae",
  )}&body=${encodeURIComponent(composed)}`;

  return (
    <form
      className="c-contact-form grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        trackLead("whatsapp_form", { enquiry_category: category || undefined });
        window.open(waHref, "_blank", "noopener,noreferrer");
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={LABEL}>
            Your name
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Appleseed"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={LABEL}>
            Phone / WhatsApp
          </label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 …"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-cat" className={LABEL}>
          What can we make for you?
        </label>
        <select
          id="cf-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={FIELD}
        >
          <option value="">Select a discipline…</option>
          {PRODUCTS.map((p) => (
            <option key={p.slug} value={p.title}>
              {p.title}
            </option>
          ))}
          <option value="Full fit-out / multiple">Full fit-out / multiple</option>
        </select>
      </div>

      <div>
        <label htmlFor="cf-msg" className={LABEL}>
          Project details
        </label>
        <textarea
          id="cf-msg"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the space, timeline and any drawings you have…"
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button type="submit" className="btn-primary">
          Send via WhatsApp <ArrowUpRight size={16} />
        </button>
        <a href={mailHref} className="btn-link text-ink">
          <Mail size={15} /> Email instead
        </a>
      </div>
      <p className="text-xs text-ink-mute">
        Submitting opens WhatsApp with your details pre-filled — no data is stored on this
        site.
      </p>
    </form>
  );
}
