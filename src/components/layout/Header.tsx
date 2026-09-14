import { NavLink, Link } from "react-router-dom";
import { Heart, Scale, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppState } from "@/hooks/useAppState";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn("inline-flex items-baseline gap-[3px] font-extrabold tracking-tight", className)}
      aria-label="Ghor Lagbe — home"
    >
      <span className="text-ink">Ghor</span>
      <span className="text-forest-600">Lagbe</span>
      <span aria-hidden className="ml-0.5 size-1.5 translate-y-[-2px] rounded-full bg-ochre-500" />
    </Link>
  );
}

const NAV = [
  { to: "/search", label: "Find a place" },
  { to: "/list-property", label: "List property" },
];

function RoleSwitch() {
  const { role, setRole } = useAppState();
  return (
    <div
      role="group"
      aria-label="Demo mode: view the prototype as a renter or an owner"
      className="flex items-center gap-1 rounded-md border border-hairline-strong bg-paper-deep p-0.5"
    >
      <span className="px-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-muted">
        Demo
      </span>
      {(["renter", "owner"] as const).map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={role === r}
          onClick={() => setRole(r)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
            role === r ? "bg-surface text-forest-600 shadow-sm" : "text-muted hover:text-ink",
          )}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const { savedIds, compareIds, role } = useAppState();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative py-1 text-sm font-semibold transition-colors",
      isActive ? "text-forest-600" : "text-ink-soft hover:text-ink",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/92 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-6">
        <Wordmark className="text-xl" />

        <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {role === "owner" && (
            <NavLink to="/owner" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <IconLink to="/saved" label="Saved" count={savedIds.length} icon={Heart} />
            <IconLink to="/compare" label="Compare" count={compareIds.length} icon={Scale} />
            <IconLink to="/profile" label="Profile" icon={UserRound} />
          </div>
          <RoleSwitch />
        </div>
      </div>
    </header>
  );
}

function IconLink({
  to,
  label,
  count,
  icon: Icon,
}: {
  to: string;
  label: string;
  count?: number;
  icon: typeof Heart;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-forest-50 text-forest-600" : "text-ink-soft hover:bg-paper-deep",
        )
      }
    >
      <Icon size={16} aria-hidden />
      <span className="sr-only md:not-sr-only">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="rounded-full bg-forest-600 px-1.5 text-[0.65rem] font-bold text-white tnum">
          {count}
        </span>
      )}
    </NavLink>
  );
}
