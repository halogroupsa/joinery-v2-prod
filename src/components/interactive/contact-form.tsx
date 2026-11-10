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
  const [location, setLocation] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [budget, setBudget] = useState("");
  const [timing, setTiming] = useState("");
  const [message, setMessage] = useState("");
  const [openedChannel, setOpenedChannel] = useState<"whatsapp" | "email" | null>(null);

  const composed = useMemo(() => {
    const lines = [
      "New project enquiry — Joinery.ae",
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      category && `Interested in: ${category}`,
      location && `Project location: ${location}`,
      dimensions && `Approximate dimensions: ${dimensions}`,
      budget && `Indicative budget: ${budget}`,
      timing && `Preferred timing: ${timing}`,
      message && `Details: ${message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }, [name, phone, category, location, dimensions, budget, timing, message]);

  const waHref = `${SITE.whatsappUrl}?text=${encodeURIComponent(composed)}`;
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
    "Project enquiry — Joinery.ae",
  )}&body=${encodeURIComponent(composed)}`;

  return (
    <form
      className="c-contact-form grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.value === "email") {
          trackLead("email", { enquiry_category: category || undefined });
          setOpenedChannel("email");
          window.location.href = mailHref;
        } else {
          trackLead("whatsapp_form", { enquiry_category: category || undefined });
          setOpenedChannel("whatsapp");
          window.open(waHref, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <p className="text-sm text-ink-soft">Fields marked * are required. You can add drawings and photos in WhatsApp or your email app after opening your message.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={LABEL}>
            Your name *
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Appleseed"
            className={FIELD}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={LABEL}>
            Phone / WhatsApp (optional)
          </label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 …"
            className={FIELD}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-cat" className={LABEL}>
          What can we make for you? *
        </label>
        <select
          id="cf-cat"
          required
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
          <option value="Multiple joinery items">Multiple joinery items</option>
          <option value="Full renovation enquiry">Full renovation enquiry — discuss Halo&apos;s wider scope</option>
        </select>
      </div>

      <div>
        <label htmlFor="cf-location" className={LABEL}>Project location *</label>
        <input id="cf-location" type="text" required maxLength={200} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Community or building, villa or apartment" className={FIELD} />
      </div>

      <div>
        <label htmlFor="cf-dimensions" className={LABEL}>Approximate dimensions (optional)</label>
        <input id="cf-dimensions" type="text" maxLength={200} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Width × height × depth, with units, or a room plan" className={FIELD} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-budget" className={LABEL}>Budget (optional)</label>
          <input id="cf-budget" type="text" maxLength={100} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Indicative range in AED" className={FIELD} />
        </div>
        <div>
          <label htmlFor="cf-timing" className={LABEL}>Preferred timing (optional)</label>
          <input id="cf-timing" type="text" maxLength={100} value={timing} onChange={(e) => setTiming(e.target.value)} placeholder="Target installation month" className={FIELD} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-msg" className={LABEL}>
          Project details *
        </label>
        <textarea
          id="cf-msg"
          rows={5}
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Storage needs, finishes, appliances, items to remove, access restrictions and any drawings you have…"
          className={`${FIELD} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button type="submit" name="channel" value="whatsapp" className="btn-primary">
          Continue on WhatsApp <ArrowUpRight size={16} />
        </button>
        <button type="submit" name="channel" value="email" className="btn-link text-ink">
          <Mail size={15} /> Email instead
        </button>
      </div>
      <p className="text-xs text-ink-mute">
        This form prepares a message in WhatsApp or your email app. Review it, add any attachments and press Send there. Opening an app does not confirm an enquiry has been sent or received.
      </p>
      {openedChannel && (
        <p role="status" className="text-sm text-ink-soft">
          {openedChannel === "whatsapp" ? "Review and send your message in WhatsApp." : "Review and send your message in your email app."}{" "}
          If it did not open, <a href={openedChannel === "whatsapp" ? waHref : mailHref} {...(openedChannel === "whatsapp" ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="underline underline-offset-4">open your prepared message here</a>, or call <a href={`tel:${SITE.phoneE164}`} className="underline underline-offset-4">{SITE.phone}</a>.
        </p>
      )}
    </form>
  );
}
