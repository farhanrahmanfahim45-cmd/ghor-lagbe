import { ShieldCheck, ReceiptText, CalendarCheck, MapPinned } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Owner and property states",
    body: "Listings carry separate states for the person and the property, because a real person can still list a place they do not control.",
  },
  {
    icon: ReceiptText,
    title: "The full monthly cost",
    body: "Rent, service charge, gas and advance shown together — and flagged clearly when an owner has not disclosed them.",
  },
  {
    icon: CalendarCheck,
    title: "Availability that stays current",
    body: "Every listing shows when it was last updated, and owners are asked to confirm a place is still free.",
  },
  {
    icon: MapPinned,
    title: "Context for newcomers",
    body: "Distance to transport, campus, grocery and hospital, for people who do not yet know the neighbourhood.",
  },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-heading" className="container-page py-14 md:py-20">
      <div className="max-w-2xl">
        <h2 id="trust-heading" className="text-2xl font-extrabold text-ink sm:text-3xl">
          Built around the parts people get burned by
        </h2>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Scattered posts, missing costs and listings that were taken weeks ago. Ghor Lagbe
          structures the things a renter actually has to check.
        </p>
      </div>

      <ul className="mt-9 grid gap-5 sm:grid-cols-2">
        {PILLARS.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex gap-4 rounded-lg border border-hairline bg-surface p-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-600">
              <Icon size={18} aria-hidden />
            </span>
            <div>
              <h3 className="font-bold text-ink">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-lg border border-dashed border-hairline-strong bg-surface/60 p-4 text-sm leading-relaxed text-ink-soft">
        <strong className="font-semibold text-ink">About verification in this prototype.</strong>{" "}
        Ghor Lagbe does not yet perform real identity or ownership checks. Badges in this build
        demonstrate the intended workflow using synthetic data, and are labelled as demo states
        throughout.
      </p>
    </section>
  );
}
