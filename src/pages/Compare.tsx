import { Link } from "react-router-dom";
import { Scale } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DEMO_PROPERTIES } from "@/data/properties";
import { useAppState, MAX_COMPARE } from "@/hooks/useAppState";

/**
 * Phase 1: selection state and the empty state only.
 * The side-by-side attribute table is built in a later phase.
 */
export default function Compare() {
  const { compareIds, clearCompare, toggleCompare } = useAppState();
  const selected = DEMO_PROPERTIES.filter((p) => compareIds.includes(p.id));

  return (
    <>
      <PageHeader
        title="Compare"
        lead={`Put up to ${MAX_COMPARE} places side by side on rent, total cost, size and trust.`}
        actions={
          selected.length > 0 ? (
            <Button variant="secondary" onClick={clearCompare}>
              Clear selection
            </Button>
          ) : undefined
        }
      />

      <div className="container-page py-8 md:py-10">
        {selected.length === 0 ? (
          <EmptyState
            icon={Scale}
            title="Choose 2–3 properties to compare."
            body="Open a listing and add it to compare, and the differences will line up here."
            action={
              <Link to="/search">
                <Button>Browse listings</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {selected.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  compact
                  onToggleSave={() => toggleCompare(property.id)}
                />
              ))}
            </div>
            <p className="mt-6 rounded-lg border border-dashed border-hairline-strong bg-surface/60 p-4 text-sm text-ink-soft">
              The side-by-side comparison table is the next piece of this build. Selection and the
              three-place limit already work.
            </p>
          </>
        )}
      </div>
    </>
  );
}
