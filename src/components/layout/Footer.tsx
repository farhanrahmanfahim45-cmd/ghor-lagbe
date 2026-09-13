import { Link } from "react-router-dom";
import { Wordmark } from "./Header";

const COLUMNS = [
  {
    heading: "Find a place",
    links: [
      { to: "/search", label: "Search listings" },
      { to: "/saved", label: "Saved places" },
      { to: "/compare", label: "Compare" },
    ],
  },
  {
    heading: "For owners",
    links: [
      { to: "/list-property", label: "List your property" },
      { to: "/owner", label: "Owner dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-hairline bg-paper-deep">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Wordmark className="text-lg" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Ghor Lagbe connects people looking for a place with properties looking for the right
            occupant — across Dhaka.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="mb-3 text-sm font-bold text-ink">{col.heading}</h2>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted transition-colors hover:text-forest-600">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-hairline">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            Prototype built for the Innovation to Impact initiative, Independent University,
            Bangladesh.
          </p>
          <p>
            All listings, owners and images are synthetic demo data. No real verification is
            performed.
          </p>
        </div>
      </div>
    </footer>
  );
}
