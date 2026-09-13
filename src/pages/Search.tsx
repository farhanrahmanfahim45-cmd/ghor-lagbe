import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Map, SearchX } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_PROPERTIES } from "@/data/properties";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";
import { taka } from "@/lib/format";

/**
 * Phase 1: browsable results only. Filtering, sorting, the map panel and
 * match scoring are implemented in later phases against this same layout.
 */
export default function Search() {
  const [params] = useSearchParams();
  const { isSaved, toggleSaved } = useAppState();
  const { notify } = useToast();

  const area = params.get("area");
  const budgetMin = params.get("budgetMin");
  const budgetMax = params.get("budgetMax");

  const results = area ? DEMO_PROPERTIES.filter((p) => p.area === area) : DEMO_PROPERTIES;

  const lead = area
    ? `Showing demo listings in ${area}${
        budgetMin && budgetMax ? ` · ${taka(Number(budgetMin))}–${taka(Number(budgetMax))} a month` : ""
      }`
    : "Browse the full demo dataset. Tell us what you need and each listing gets a match score.";

  return (
    <>
      <PageHeader
        title="Find a place"
        lead={lead}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" disabled title="Filters arrive in the next build">
              <SlidersHorizontal size={16} aria-hidden />
              Filters
            </Button>
            <Button variant="secondary" disabled title="Map view arrives in the next build">
              <Map size={16} aria-hidden />
              Map
            </Button>
          </div>
        }
      />

      <div className="container-page py-8 md:py-10">
        <p className="mb-5 text-sm text-muted tnum">
          {results.length} {results.length === 1 ? "place" : "places"}
        </p>

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="We couldn't find an exact match."
            body="Try widening your budget, choosing a nearby area, or opening the search to more property types."
            action={
              <Button onClick={() => window.history.back()} variant="secondary">
                Change your requirements
              </Button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={isSaved(property.id)}
                onToggleSave={(id) => {
                  const added = toggleSaved(id);
                  notify(added ? "Saved to your shortlist" : "Removed from your shortlist");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
