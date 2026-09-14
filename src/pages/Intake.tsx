import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Input, Select, SegmentedControl } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { AREAS } from "@/data/areas";
import { AMENITIES, AMENITY_KEYS } from "@/data/amenities";
import { useAppState } from "@/hooks/useAppState";
import type {
  AccommodationType,
  AmenityKey,
  PropertyType,
  RenterRequirements,
} from "@/types/property";
import { cn } from "@/lib/cn";

const TYPE_OPTIONS: Array<{ value: PropertyType | "any"; label: string }> = [
  { value: "any", label: "Any property type" },
  { value: "room", label: "Single room" },
  { value: "shared-room", label: "Shared room" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "sublet", label: "Sublet" },
];

const ACCOM_OPTIONS: Array<{ value: AccommodationType | "any"; label: string }> = [
  { value: "any", label: "No preference" },
  { value: "single", label: "Just for me" },
  { value: "shared", label: "Happy to share" },
  { value: "entire", label: "The whole place" },
];

const PRIORITY_OPTIONS: Array<{ value: RenterRequirements["priority"]; label: string }> = [
  { value: "lowest-cost", label: "Keeping the cost down" },
  { value: "best-location", label: "Being in the right area" },
  { value: "more-space", label: "Having more space" },
  { value: "better-amenities", label: "Better amenities" },
];

export default function Intake() {
  const navigate = useNavigate();
  const { requirements, setRequirements } = useAppState();
  const [draft, setDraft] = useState<RenterRequirements>(requirements);

  const update = <K extends keyof RenterRequirements>(key: K, value: RenterRequirements[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleAmenity = (key: AmenityKey) =>
    setDraft((d) => ({
      ...d,
      preferredAmenities: d.preferredAmenities.includes(key)
        ? d.preferredAmenities.filter((a) => a !== key)
        : [...d.preferredAmenities, key],
    }));

  const submit = () => {
    setRequirements(draft);
    navigate("/search");
  };

  const budgetInvalid = draft.budgetMax < draft.budgetMin;

  return (
    <div className="container-page max-w-3xl py-10 md:py-14">
      <header>
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Tell us what you need</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Six answers. Every place we show you afterwards comes with a score and the reasons
          behind it.
        </p>
      </header>

      <div className="mt-9 space-y-8">
        <Section title="Where do you want to live?">
          <Select
            label="Area"
            value={draft.area}
            onChange={(e) => update("area", e.target.value)}
            hint="We'll also show nearby areas, ranked by how far they are."
            options={AREAS.map((a) => ({ value: a.name, label: `${a.name}, ${a.district}` }))}
          />
        </Section>

        <Section title="What can you spend each month?">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Minimum"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              prefix={"\u09F3"}
              className="tnum"
              value={draft.budgetMin}
              onChange={(e) => update("budgetMin", Number(e.target.value))}
            />
            <Input
              label="Maximum"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              prefix={"\u09F3"}
              className="tnum"
              value={draft.budgetMax}
              onChange={(e) => update("budgetMax", Number(e.target.value))}
            />
          </div>
          {budgetInvalid && (
            <p className="mt-2 text-sm font-medium text-danger-600">
              Your maximum is below your minimum.
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Where an owner has listed every cost, we score against the full monthly figure — rent
            plus service charge and gas — not rent alone.
          </p>
        </Section>

        <Section title="What kind of place?">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Property type"
              value={draft.propertyType}
              onChange={(e) => update("propertyType", e.target.value as PropertyType | "any")}
              options={TYPE_OPTIONS}
            />
            <Select
              label="Living arrangement"
              value={draft.accommodationType}
              onChange={(e) =>
                update("accommodationType", e.target.value as AccommodationType | "any")
              }
              options={ACCOM_OPTIONS}
            />
          </div>
        </Section>

        <Section title="When do you need to move?">
          <Input
            label="Move-in date"
            type="date"
            value={draft.moveInDate}
            onChange={(e) => update("moveInDate", e.target.value)}
          />
        </Section>

        <Section title="What matters most?">
          <SegmentedControl<RenterRequirements["priority"]>
            label="Priority"
            value={draft.priority}
            onChange={(v) => update("priority", v)}
            options={PRIORITY_OPTIONS}
          />
          <p className="mt-2 text-xs text-muted">
            This sets how results are ordered when scores are close.
          </p>
        </Section>

        <Section title="Anything you'd rather not do without?">
          <ul className="flex flex-wrap gap-2">
            {AMENITY_KEYS.map((key) => {
              const { label, icon: Icon } = AMENITIES[key];
              const on = draft.preferredAmenities.includes(key);
              return (
                <li key={key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleAmenity(key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                      on
                        ? "border-forest-500 bg-forest-50 text-forest-700"
                        : "border-hairline-strong bg-surface text-ink-soft hover:border-forest-200",
                    )}
                  >
                    <Icon size={14} aria-hidden />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-2 text-xs text-muted">Optional. Leave it blank if nothing is essential.</p>
        </Section>
      </div>

      <div className="sticky bottom-16 mt-10 rounded-xl border border-hairline bg-surface p-4 md:bottom-4">
        <Button size="lg" fullWidth onClick={submit} disabled={budgetInvalid}>
          Show my matches
          <ArrowRight size={17} aria-hidden />
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface p-5">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      {children}
    </section>
  );
}
