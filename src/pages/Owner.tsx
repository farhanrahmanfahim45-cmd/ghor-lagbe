import { Link } from "react-router-dom";
import { Eye, MessageSquare, Building2, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { DEMO_PROPERTIES } from "@/data/properties";
import { taka, lastUpdatedLabel, isStale } from "@/lib/format";
import { useAppState } from "@/hooks/useAppState";

/** Phase 1: dashboard shape with real demo figures. Actions land in a later phase. */
export default function Owner() {
  const { role, setRole } = useAppState();
  const listings = DEMO_PROPERTIES.slice(0, 3);

  const totals = listings.reduce(
    (acc, p) => ({
      views: acc.views + p.views,
      inquiries: acc.inquiries + p.inquiries,
      stale: acc.stale + (isStale(p.lastUpdated) ? 1 : 0),
    }),
    { views: 0, inquiries: 0, stale: 0 },
  );

  return (
    <>
      <PageHeader
        title="Owner dashboard"
        lead="How your places are performing, and what needs your attention."
        actions={
          <Link to="/list-property">
            <Button>Add a listing</Button>
          </Link>
        }
      />

      <div className="container-page py-8 md:py-10">
        {role !== "owner" && (
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-forest-200 bg-forest-50 p-4 text-sm text-forest-700">
            <span>You're viewing the prototype as a renter. Switch to owner mode to follow the supply-side journey.</span>
            <Button size="sm" onClick={() => setRole("owner")}>Switch to owner</Button>
          </div>
        )}

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Building2} label="Active listings" value={listings.length} />
          <Stat icon={Eye} label="Total views" value={totals.views} />
          <Stat icon={MessageSquare} label="Inquiries" value={totals.inquiries} />
          <Stat icon={AlertTriangle} label="Need confirmation" value={totals.stale} tone="warn" />
        </dl>

        <h2 className="mt-10 text-lg font-bold text-ink">Your listings</h2>

        <div className="mt-3 overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-hairline text-left text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3 font-semibold">Property</th>
                <th scope="col" className="px-4 py-3 font-semibold">Rent</th>
                <th scope="col" className="px-4 py-3 font-semibold">Views</th>
                <th scope="col" className="px-4 py-3 font-semibold">Inquiries</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((p) => (
                <tr key={p.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/property/${p.id}`} className="font-semibold text-ink hover:text-forest-600">
                      {p.title}
                    </Link>
                    <p className="text-xs text-muted">{p.neighborhood}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink tnum">{taka(p.cost.rent)}</td>
                  <td className="px-4 py-3 text-ink-soft tnum">{p.views}</td>
                  <td className="px-4 py-3 text-ink-soft tnum">{p.inquiries}</td>
                  <td className="px-4 py-3"><AvailabilityBadge status={p.availabilityStatus} /></td>
                  <td className="px-4 py-3">
                    {isStale(p.lastUpdated) ? (
                      <Badge tone="warn">{lastUpdatedLabel(p.lastUpdated)}</Badge>
                    ) : (
                      <span className="text-muted">{lastUpdatedLabel(p.lastUpdated)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 rounded-lg border border-dashed border-hairline-strong bg-surface/60 p-4 text-sm leading-relaxed text-ink-soft">
          Inquiry inbox, editing and the availability-confirmation action are built on top of this
          layout in a later phase.
        </p>
      </div>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone = "forest",
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  tone?: "forest" | "warn";
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface p-5">
      <dt className="flex items-center gap-2 text-sm text-muted">
        <Icon size={15} className={tone === "warn" ? "text-warn-700" : "text-forest-600"} aria-hidden />
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-extrabold text-ink tnum">{value}</dd>
    </div>
  );
}
