import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AREAS, FEATURED_AREA_IDS } from "@/data/areas";
import { taka } from "@/lib/format";

export function PopularAreas() {
  const featured = AREAS.filter((a) => FEATURED_AREA_IDS.includes(a.id));

  return (
    <section aria-labelledby="areas-heading" className="container-page py-14 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="areas-heading" className="text-2xl font-extrabold text-ink sm:text-3xl">
            Where people are looking
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            Indicative starting rents from the demo dataset. Real figures come from the pilot.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-700"
        >
          See all areas
          <ArrowRight size={15} aria-hidden />
        </Link>
      </div>

      <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {featured.map((area) => (
          <li key={area.id}>
            <Link
              to={`/search?area=${encodeURIComponent(area.name)}`}
              className="flex h-full flex-col gap-1 rounded-lg border border-hairline bg-surface p-4 transition-colors hover:border-forest-500"
            >
              <span className="font-bold text-ink">{area.name}</span>
              <span className="text-xs leading-snug text-muted">{area.note}</span>
              <span className="mt-auto pt-2 text-sm font-semibold text-forest-600 tnum">
                from {taka(area.typicalFrom)}
                <span className="font-medium text-muted">/mo</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
