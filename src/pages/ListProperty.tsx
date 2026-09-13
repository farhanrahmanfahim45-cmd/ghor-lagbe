import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const STEPS = [
  { title: "Property type", body: "Room, shared room, apartment, house or sublet." },
  { title: "Location", body: "Area, neighbourhood and the address renters will see." },
  { title: "Pricing", body: "Rent plus service charge, utilities, deposit and advance." },
  { title: "Property details", body: "Bedrooms, bathrooms, size, floor and furnishing." },
  { title: "Amenities", body: "Lift, gas, generator, parking, Wi-Fi and the rest." },
  { title: "Rules", body: "Who the place suits — family, bachelor, student." },
  { title: "Photos", body: "Exterior, living space, bedroom, kitchen, bathroom." },
  { title: "Availability", body: "Available now, or the date it frees up." },
  { title: "Preview", body: "See exactly what a renter sees before publishing." },
];

/** Phase 1: the structure of the flow, so owners can see what will be asked. */
export default function ListProperty() {
  return (
    <>
      <PageHeader
        title="List your property"
        lead="Nine short steps. The more you fill in, the more relevant the renters who reach you."
        actions={<Button disabled title="The listing form arrives in the next build">Start listing</Button>}
      />

      <div className="container-page py-8 md:py-10">
        <ol className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className={cn("flex gap-3 bg-surface p-5")}>
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-forest-50 text-xs font-extrabold text-forest-600 tnum">
                {i + 1}
              </span>
              <div>
                <h2 className="font-bold text-ink">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-lg border border-dashed border-hairline-strong bg-surface/60 p-4 text-sm leading-relaxed text-ink-soft">
          <strong className="font-semibold text-ink">What happens to a listing.</strong> Published
          listings show the full monthly cost, an availability date and a last-updated stamp.
          Owners are asked to confirm a place is still free so stale listings drop out of results.
        </p>
      </div>
    </>
  );
}
