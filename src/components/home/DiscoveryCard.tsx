import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input, Select, SegmentedControl } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { AREAS } from "@/data/areas";
import type { Purpose } from "@/types/property";

const TYPE_OPTIONS = [
  { value: "any", label: "Any property type" },
  { value: "room", label: "Single room" },
  { value: "shared-room", label: "Shared room" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "sublet", label: "Sublet" },
];

/**
 * Phase 1: collects requirements and hands them to /search as query params.
 * The matching engine that consumes them arrives in a later phase.
 */
export function DiscoveryCard() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<Purpose>("rent");
  const [area, setArea] = useState("Mirpur");
  const [propertyType, setPropertyType] = useState("any");
  const [budgetMin, setBudgetMin] = useState("6000");
  const [budgetMax, setBudgetMax] = useState("15000");

  const submit = () => {
    const params = new URLSearchParams({ purpose, area, propertyType, budgetMin, budgetMax });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section
      aria-labelledby="discovery-heading"
      className="rounded-xl border border-hairline bg-surface p-5 sm:p-6"
    >
      <h2 id="discovery-heading" className="text-lg font-bold text-ink">
        What are you looking for?
      </h2>
      <p className="mt-1 text-sm text-muted">
        Tell us the basics and we'll show places that fit, with the reasons why.
      </p>

      <div className="mt-5 space-y-4">
        <SegmentedControl<Purpose>
          label="Looking to"
          value={purpose}
          onChange={setPurpose}
          options={[
            { value: "rent", label: "Rent" },
            { value: "buy", label: "Buy", disabled: true, note: "Sales listings come later" },
          ]}
        />

        <Select
          label="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          options={AREAS.map((a) => ({ value: a.name, label: `${a.name}, ${a.district}` }))}
        />

        <Select
          label="Property type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          options={TYPE_OPTIONS}
        />

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink-soft">Monthly budget</legend>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Minimum"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              prefix={"\u09F3"}
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="tnum"
            />
            <Input
              label="Maximum"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              prefix={"\u09F3"}
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="tnum"
            />
          </div>
        </fieldset>

        <Button size="lg" fullWidth onClick={submit}>
          <Search size={17} aria-hidden />
          Find my matches
        </Button>
      </div>
    </section>
  );
}
