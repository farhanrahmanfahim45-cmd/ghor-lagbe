import { RotateCcw } from "lucide-react";
import { AREAS } from "@/data/areas";
import { AMENITIES, AMENITY_KEYS } from "@/data/amenities";
import type { AmenityKey, PropertyType } from "@/types/property";
import { taka } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface Filters {
  area: string | "all";
  propertyType: PropertyType | "all";
  rentMax: number;
  bedroomsMin: number;
  furnishedOnly: boolean;
  verifiedOnly: boolean;
  availableOnly: boolean;
  freshOnly: boolean;
  completeCostOnly: boolean;
  amenities: AmenityKey[];
}

export const DEFAULT_FILTERS: Filters = {
  area: "all",
  propertyType: "all",
  rentMax: 60000,
  bedroomsMin: 0,
  furnishedOnly: false,
  verifiedOnly: false,
  availableOnly: true,
  freshOnly: false,
  completeCostOnly: false,
  amenities: [],
};

const TYPES: Array<{ value: PropertyType | "all"; label: string }> = [
  { value: "all", label: "Any type" },
  { value: "room", label: "Single room" },
  { value: "shared-room", label: "Shared room" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "sublet", label: "Sublet" },
  { value: "commercial", label: "Commercial" },
];

export function countActiveFilters(f: Filters): number {
  let n = 0;
  if (f.area !== "all") n++;
  if (f.propertyType !== "all") n++;
  if (f.rentMax !== DEFAULT_FILTERS.rentMax) n++;
  if (f.bedroomsMin > 0) n++;
  if (f.furnishedOnly) n++;
  if (f.verifiedOnly) n++;
  if (!f.availableOnly) n++;
  if (f.freshOnly) n++;
  if (f.completeCostOnly) n++;
  n += f.amenities.length;
  return n;
}

export function FilterPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const toggleAmenity = (key: AmenityKey) =>
    set(
      "amenities",
      filters.amenities.includes(key)
        ? filters.amenities.filter((a) => a !== key)
        : [...filters.amenities, key],
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-ink">Filters</h2>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-forest-600"
        >
          <RotateCcw size={13} aria-hidden />
          Reset
        </button>
      </div>

      <Group label="Area">
        <select
          aria-label="Area"
          value={filters.area}
          onChange={(e) => set("area", e.target.value)}
          className="h-10 w-full rounded-md border border-hairline-strong bg-surface px-3 text-sm"
        >
          <option value="all">Everywhere</option>
          {AREAS.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </Group>

      <Group label="Property type">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((t) => (
            <Chip
              key={t.value}
              active={filters.propertyType === t.value}
              onClick={() => set("propertyType", t.value)}
            >
              {t.label}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label={`Rent up to ${taka(filters.rentMax)}`}>
        <input
          type="range"
          aria-label="Maximum rent"
          min={3000}
          max={60000}
          step={500}
          value={filters.rentMax}
          onChange={(e) => set("rentMax", Number(e.target.value))}
          className="w-full accent-forest-600"
        />
        <div className="mt-1 flex justify-between text-xs text-muted tnum">
          <span>{taka(3000)}</span>
          <span>{taka(60000)}+</span>
        </div>
      </Group>

      <Group label="Bedrooms">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((n) => (
            <Chip key={n} active={filters.bedroomsMin === n} onClick={() => set("bedroomsMin", n)}>
              {n === 0 ? "Any" : `${n}+`}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label="Show only">
        <div className="space-y-2">
          <Check label="Available places" checked={filters.availableOnly} onChange={(v) => set("availableOnly", v)} />
          <Check label="Updated in the last 3 weeks" checked={filters.freshOnly} onChange={(v) => set("freshOnly", v)} />
          <Check label="Full cost disclosed" checked={filters.completeCostOnly} onChange={(v) => set("completeCostOnly", v)} />
          <Check label="Verified listings (demo)" checked={filters.verifiedOnly} onChange={(v) => set("verifiedOnly", v)} />
          <Check label="Furnished" checked={filters.furnishedOnly} onChange={(v) => set("furnishedOnly", v)} />
        </div>
      </Group>

      <Group label="Amenities">
        <div className="flex flex-wrap gap-1.5">
          {AMENITY_KEYS.map((key) => (
            <Chip key={key} active={filters.amenities.includes(key)} onClick={() => toggleAmenity(key)}>
              {AMENITIES[key].label}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink-soft">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded border px-2.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-forest-500 bg-forest-50 text-forest-700"
          : "border-hairline-strong bg-surface text-ink-soft hover:border-forest-200",
      )}
    >
      {children}
    </button>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-forest-600"
      />
      {label}
    </label>
  );
}
