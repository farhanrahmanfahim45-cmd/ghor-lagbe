import { Link } from "react-router-dom";
import { Scale, Check, X, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { MatchScore } from "@/components/ui/MatchScore";
import { DEMO_PROPERTIES } from "@/data/properties";
import { AMENITIES } from "@/data/amenities";
import { useAppState } from "@/hooks/useAppState";
import { scoreProperty, distanceFromArea } from "@/lib/matching";
import { taka, longDate, lastUpdatedLabel } from "@/lib/format";
import { verificationLevel } from "@/components/ui/VerificationBadge";
import { cn } from "@/lib/cn";
import type { AmenityKey, Property } from "@/types/property";

const COMPARED_AMENITIES: AmenityKey[] = ["parking", "lift", "wifi", "gas", "generator", "furnished"];

export default function Compare() {
  const { compareIds, clearCompare, toggleCompare, requirements, hasStatedRequirements } = useAppState();
  const selected = DEMO_PROPERTIES.filter((p) => compareIds.includes(p.id));

  if (selected.length === 0) {
    return (
      <>
        <PageHeader title="Compare" lead="Put up to three places side by side and let the differences show themselves." />
        <div className="container-page py-8 md:py-10">
          <EmptyState
            icon={Scale}
            title="Choose 2–3 properties to compare."
            body="Open a listing and add it to compare. Rent, total cost, size, distance and trust will line up here."
            action={
              <Link to="/search">
                <Button>Browse listings</Button>
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const scores = new Map(selected.map((p) => [p.id, scoreProperty(p, requirements).score]));
  // Only compare disclosed totals against each other — a listing that hides its
  // service charge shouldn't win the "cheapest overall" row by omission.
  const disclosedTotals = selected
    .map((p) => p.cost.estimatedMonthlyCost)
    .filter((t): t is number => t !== null);
  const bestTotal = disclosedTotals.length ? Math.min(...disclosedTotals) : null;
  const bestSize = Math.max(...selected.map((p) => p.size));
  const bestScore = Math.max(...selected.map((p) => scores.get(p.id) ?? 0));

  const distance = (p: Property) => distanceFromArea(p, requirements.area);
  const distances = selected.map((p) => distance(p) ?? Infinity);
  const bestDistance = Math.min(...distances);

  return (
    <>
      <PageHeader
        title="Compare"
        lead={`${selected.length} place${selected.length > 1 ? "s" : ""} side by side. The strongest figure in each row is highlighted.`}
        actions={
          <Button variant="secondary" onClick={clearCompare}>
            <Trash2 size={16} aria-hidden />
            Clear all
          </Button>
        }
      />

      <div className="container-page py-8 md:py-10">
        <div className="overflow-x-auto rounded-xl border border-hairline bg-surface">
          <table className="w-full min-w-160 text-sm">
            <caption className="sr-only">Comparison of the properties you selected</caption>
            <thead>
              <tr className="border-b border-hairline">
                <th scope="col" className="w-36 px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  Feature
                </th>
                {selected.map((p) => (
                  <th key={p.id} scope="col" className="min-w-52 px-4 py-4 text-left align-top">
                    <img
                      src={p.images[0].url}
                      alt={p.images[0].alt}
                      className="mb-2 h-24 w-full rounded object-cover"
                    />
                    <Link to={`/property/${p.id}`} className="font-bold text-ink hover:text-forest-600">
                      {p.title}
                    </Link>
                    <p className="mt-0.5 text-xs font-normal text-muted">{p.area}</p>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.id)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-danger-600"
                    >
                      <X size={12} aria-hidden />
                      Remove
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasStatedRequirements && (
                <Row label="Match">
                  {selected.map((p) => (
                    <Cell key={p.id} best={scores.get(p.id) === bestScore}>
                      <MatchScore score={scores.get(p.id) ?? 0} size="sm" />
                    </Cell>
                  ))}
                </Row>
              )}

              <Row label="Monthly rent">
                {selected.map((p) => (
                  <Cell key={p.id}>{taka(p.cost.rent)}</Cell>
                ))}
              </Row>

              <Row label="Estimated total">
                {selected.map((p) => (
                  <Cell
                    key={p.id}
                    best={bestTotal !== null && p.cost.estimatedMonthlyCost === bestTotal}
                  >
                    {p.cost.estimatedMonthlyCost ? (
                      taka(p.cost.estimatedMonthlyCost)
                    ) : (
                      <span className="font-medium text-warn-700">Not disclosed</span>
                    )}
                  </Cell>
                ))}
              </Row>

              <Row label="Advance">
                {selected.map((p) => (
                  <Cell key={p.id}>{p.cost.advanceMonths} month{p.cost.advanceMonths > 1 ? "s" : ""}</Cell>
                ))}
              </Row>

              <Row label="Bedrooms">
                {selected.map((p) => (
                  <Cell key={p.id}>{p.bedrooms || "—"}</Cell>
                ))}
              </Row>

              <Row label="Bathrooms">
                {selected.map((p) => (
                  <Cell key={p.id}>{p.bathrooms}</Cell>
                ))}
              </Row>

              <Row label="Size">
                {selected.map((p) => (
                  <Cell key={p.id} best={p.size === bestSize}>{p.size} sqft</Cell>
                ))}
              </Row>

              <Row label={`Distance from ${requirements.area}`}>
                {selected.map((p) => {
                  const km = distance(p);
                  return (
                    <Cell key={p.id} best={km !== null && km === bestDistance}>
                      {km === null ? "—" : `${km.toFixed(1)} km`}
                    </Cell>
                  );
                })}
              </Row>

              <Row label="Furnishing">
                {selected.map((p) => (
                  <Cell key={p.id}>{p.furnishing.replace("-", " ")}</Cell>
                ))}
              </Row>

              {COMPARED_AMENITIES.map((key) => (
                <Row key={key} label={AMENITIES[key].label}>
                  {selected.map((p) => (
                    <Cell key={p.id}>
                      {p.amenities.includes(key) ? (
                        <>
                          <Check size={16} className="text-ok-600" aria-hidden />
                          <span className="sr-only">Yes</span>
                        </>
                      ) : (
                        <>
                          <X size={16} className="text-hairline-strong" aria-hidden />
                          <span className="sr-only">No</span>
                        </>
                      )}
                    </Cell>
                  ))}
                </Row>
              ))}

              <Row label="Verification">
                {selected.map((p) => {
                  const level = verificationLevel(p.verification);
                  return (
                    <Cell key={p.id}>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          level === "verified" ? "text-ok-600" : level === "partial" ? "text-warn-700" : "text-muted",
                        )}
                      >
                        {level === "verified" ? "Verified (demo)" : level === "partial" ? "Partly (demo)" : "Not verified"}
                      </span>
                    </Cell>
                  );
                })}
              </Row>

              <Row label="Available from">
                {selected.map((p) => (
                  <Cell key={p.id}>
                    <span className="text-xs">{longDate(p.availableFrom)}</span>
                  </Cell>
                ))}
              </Row>

              <Row label="Last updated">
                {selected.map((p) => (
                  <Cell key={p.id}>
                    <span className="text-xs text-muted">{lastUpdatedLabel(p.lastUpdated)}</span>
                  </Cell>
                ))}
              </Row>

              <Row label="">
                {selected.map((p) => (
                  <Cell key={p.id}>
                    <Link to={`/property/${p.id}`}>
                      <Button size="sm" variant="secondary">View listing</Button>
                    </Link>
                  </Cell>
                ))}
              </Row>
            </tbody>
          </table>
        </div>

        {selected.length === 1 && (
          <p className="mt-5 rounded-lg border border-dashed border-hairline-strong bg-surface/60 p-4 text-sm text-ink-soft">
            Add one or two more places and the differences become much easier to read.
          </p>
        )}
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-hairline last:border-0">
      <th scope="row" className="px-4 py-3 text-left align-middle text-xs font-semibold text-muted">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children, best }: { children: React.ReactNode; best?: boolean }) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle font-semibold tnum",
        best ? "bg-forest-50 text-forest-700" : "text-ink",
      )}
    >
      <span className="inline-flex items-center gap-1.5">{children}</span>
    </td>
  );
}
