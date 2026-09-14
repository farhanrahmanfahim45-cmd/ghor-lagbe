import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, SearchX, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterPanel, DEFAULT_FILTERS, countActiveFilters } from "@/components/property/FilterPanel";
import type { Filters } from "@/components/property/FilterPanel";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEMO_PROPERTIES } from "@/data/properties";
import { scoreAll } from "@/lib/matching";
import { isStale, taka } from "@/lib/format";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";
import { verificationLevel } from "@/components/ui/VerificationBadge";
import type { PropertyType } from "@/types/property";

type SortKey = "best-match" | "lowest-rent" | "lowest-total" | "recently-updated" | "most-space";

const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "best-match", label: "Best match" },
  { value: "lowest-rent", label: "Lowest rent" },
  { value: "lowest-total", label: "Lowest total cost" },
  { value: "recently-updated", label: "Recently updated" },
  { value: "most-space", label: "Most space" },
];

export default function Search() {
  const [params] = useSearchParams();
  const { requirements, setRequirements, hasStatedRequirements, isSaved, toggleSaved } = useAppState();
  const { notify } = useToast();

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("best-match");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The homepage discovery card hands requirements over through the URL.
  const areaParam = params.get("area");
  const typeParam = params.get("propertyType");
  const minParam = params.get("budgetMin");
  const maxParam = params.get("budgetMax");

  useEffect(() => {
    if (!areaParam && !minParam) return;
    setRequirements({
      ...requirements,
      area: areaParam ?? requirements.area,
      propertyType: (typeParam as PropertyType | "any") ?? requirements.propertyType,
      budgetMin: minParam ? Number(minParam) : requirements.budgetMin,
      budgetMax: maxParam ? Number(maxParam) : requirements.budgetMax,
    });
    // Intentionally keyed on the URL only — re-running on requirements would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaParam, typeParam, minParam, maxParam]);

  const matches = useMemo(() => scoreAll(DEMO_PROPERTIES, requirements), [requirements]);

  const results = useMemo(() => {
    const filtered = DEMO_PROPERTIES.filter((p) => {
      if (filters.area !== "all" && p.area !== filters.area) return false;
      if (filters.propertyType !== "all" && p.propertyType !== filters.propertyType) return false;
      if (p.cost.rent > filters.rentMax) return false;
      if (filters.bedroomsMin > 0 && p.bedrooms < filters.bedroomsMin) return false;
      if (filters.furnishedOnly && p.furnishing !== "furnished") return false;
      if (filters.verifiedOnly && verificationLevel(p.verification) !== "verified") return false;
      if (filters.availableOnly && p.availabilityStatus === "unavailable") return false;
      if (filters.freshOnly && isStale(p.lastUpdated)) return false;
      if (filters.completeCostOnly && p.cost.estimatedMonthlyCost === null) return false;
      if (filters.amenities.some((a) => !p.amenities.includes(a))) return false;
      return true;
    });

    const score = (id: string) => matches.get(id)?.score ?? 0;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "lowest-rent":
          return a.cost.rent - b.cost.rent;
        case "lowest-total":
          return (
            (a.cost.estimatedMonthlyCost ?? a.cost.rent) -
            (b.cost.estimatedMonthlyCost ?? b.cost.rent)
          );
        case "recently-updated":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case "most-space":
          return b.size - a.size;
        default:
          return score(b.id) - score(a.id);
      }
    });
  }, [filters, sort, matches]);

  const activeFilters = countActiveFilters(filters);

  const lead = hasStatedRequirements
    ? `Scored against your requirements: ${requirements.area}, ${taka(requirements.budgetMin)}–${taka(requirements.budgetMax)} a month.`
    : "Browse the demo dataset. Tell us what you need and every listing gets a score with its reasons.";

  return (
    <>
      <PageHeader
        title="Find a place"
        lead={lead}
        actions={
          <Link to="/intake">
            <Button variant={hasStatedRequirements ? "secondary" : "primary"}>
              <Sparkles size={16} aria-hidden />
              {hasStatedRequirements ? "Change requirements" : "Tell us what you need"}
            </Button>
          </Link>
        }
      />

      <div className="container-page py-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          {/* Desktop filter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-hairline bg-surface p-5">
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted tnum">
                {results.length} {results.length === 1 ? "place" : "places"}
              </p>

              <div className="ml-auto flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-muted">
                  <span className="hidden sm:inline">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="h-10 rounded-md border border-hairline-strong bg-surface px-2.5 text-sm text-ink"
                  >
                    {SORTS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>

                <Button variant="secondary" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                  <SlidersHorizontal size={16} aria-hidden />
                  Filters
                  {activeFilters > 0 && (
                    <span className="rounded-full bg-forest-600 px-1.5 text-[0.65rem] font-bold text-white tnum">
                      {activeFilters}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {results.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="We couldn't find an exact match."
                body="Try raising your maximum rent, opening the search to more property types, or including places outside this area."
                action={
                  <Button variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>
                    Clear all filters
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    matchScore={hasStatedRequirements ? matches.get(property.id)?.score : undefined}
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
        </div>
      </div>

      {/* Mobile filters as a bottom sheet */}
      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setFilters(DEFAULT_FILTERS)}>
              Reset
            </Button>
            <Button fullWidth onClick={() => setFiltersOpen(false)}>
              Show {results.length} places
            </Button>
          </div>
        }
      >
        <FilterPanel filters={filters} onChange={setFilters} />
      </Modal>
    </>
  );
}
