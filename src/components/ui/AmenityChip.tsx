import { AMENITIES } from "@/data/amenities";
import type { AmenityKey } from "@/types/property";

export function AmenityChip({ amenity }: { amenity: AmenityKey }) {
  const { label, icon: Icon } = AMENITIES[amenity];
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-hairline bg-surface px-2 py-1 text-xs text-ink-soft">
      <Icon size={13} className="text-muted" aria-hidden />
      {label}
    </span>
  );
}
