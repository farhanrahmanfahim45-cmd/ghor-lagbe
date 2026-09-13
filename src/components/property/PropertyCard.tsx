import { Link } from "react-router-dom";
import { Heart, BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/types/property";
import { taka, lastUpdatedLabel, isStale } from "@/lib/format";
import { cn } from "@/lib/cn";
import { MatchScore } from "@/components/ui/MatchScore";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";

const TYPE_LABEL: Record<Property["propertyType"], string> = {
  room: "Single room",
  "shared-room": "Shared room",
  apartment: "Apartment",
  house: "House",
  sublet: "Sublet",
  commercial: "Commercial space",
};

/** Short answer to: what is it, where, how much, how suitable, can I trust it. */
export function PropertyCard({
  property,
  matchScore,
  saved = false,
  onToggleSave,
  compact = false,
}: {
  property: Property;
  matchScore?: number;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
  compact?: boolean;
}) {
  const rentedOut = property.availabilityStatus === "unavailable";
  const stale = isStale(property.lastUpdated);
  const cover = property.images[0];
  const isRoom = property.propertyType === "shared-room" || property.propertyType === "room";
  const bedroomLabel = isRoom
    ? property.accommodationType === "shared"
      ? "Shared"
      : "Private"
    : `${property.bedrooms} bed`;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface",
        "transition-colors duration-150 focus-within:border-forest-500 hover:border-hairline-strong",
        rentedOut && "opacity-70",
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-paper-deep">
        <img
          src={cover.url}
          alt={cover.alt}
          loading="lazy"
          className="size-full object-cover"
        />

        {matchScore !== undefined && (
          <MatchScore score={matchScore} size="sm" className="absolute left-2.5 top-2.5" />
        )}

        {onToggleSave && (
          <button
            type="button"
            aria-label={saved ? `Remove ${property.title} from shortlist` : `Save ${property.title} to shortlist`}
            aria-pressed={saved}
            onClick={() => onToggleSave(property.id)}
            className="absolute right-2.5 top-2.5 rounded-full bg-surface/92 p-2 text-ink-soft transition-colors hover:bg-surface hover:text-danger-600"
          >
            <Heart size={16} className={saved ? "fill-danger-600 text-danger-600" : ""} aria-hidden />
          </button>
        )}

        <span className="pointer-events-none absolute bottom-2.5 left-2.5 rounded bg-ink/72 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-paper">
          Demo listing
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg font-extrabold text-ink tnum">
            {taka(property.cost.rent)}
            <span className="text-sm font-medium text-muted">/month</span>
          </p>
          <AvailabilityBadge status={property.availabilityStatus} />
        </div>

        <div>
          <h3 className="text-[0.9375rem] font-semibold leading-snug text-ink">
            <Link
              to={`/property/${property.id}`}
              className="after:absolute after:inset-0 focus:outline-none"
            >
              {TYPE_LABEL[property.propertyType]} in {property.neighborhood}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-muted">{property.area}, Dhaka</p>
        </div>

        {property.cost.estimatedMonthlyCost ? (
          <p className="text-[0.8125rem] text-ink-soft tnum">
            About {taka(property.cost.estimatedMonthlyCost)} a month all in
          </p>
        ) : (
          <p className="text-[0.8125rem] font-medium text-warn-700">
            Full cost not listed by owner
          </p>
        )}

        {!compact && (
          <div className="flex flex-wrap items-center gap-1.5">
            <VerificationBadge verification={property.verification} />
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-hairline pt-2.5 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1 tnum">
            <BedDouble size={13} className="text-muted" aria-hidden />
            {bedroomLabel}
          </span>
          <span className="inline-flex items-center gap-1 tnum">
            <Bath size={13} className="text-muted" aria-hidden />
            {property.bathrooms}
          </span>
          <span className="inline-flex items-center gap-1 tnum">
            <Maximize size={13} className="text-muted" aria-hidden />
            {property.size} sqft
          </span>
          <span className={cn("ml-auto shrink-0", stale ? "font-medium text-warn-700" : "text-muted")}>
            {lastUpdatedLabel(property.lastUpdated)}
          </span>
        </div>
      </div>
    </article>
  );
}
