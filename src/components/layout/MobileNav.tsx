import { NavLink } from "react-router-dom";
import { Home, Search, Heart, Scale, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAppState } from "@/hooks/useAppState";

const ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/search", label: "Search", icon: Search, end: false },
  { to: "/saved", label: "Saved", icon: Heart, end: false },
  { to: "/compare", label: "Compare", icon: Scale, end: false },
  { to: "/profile", label: "Profile", icon: UserRound, end: false },
];

/** Bottom navigation — thumb-reachable, 56px+ touch targets. */
export function MobileNav() {
  const { savedIds, compareIds } = useAppState();
  const counts: Record<string, number> = {
    "/saved": savedIds.length,
    "/compare": compareIds.length,
  };

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="flex">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium transition-colors",
                  isActive ? "text-forest-600" : "text-muted",
                )
              }
            >
              <span className="relative">
                <Icon size={19} aria-hidden />
                {counts[to] > 0 && (
                  <span className="absolute -right-2 -top-1 min-w-4 rounded-full bg-forest-600 px-1 text-[0.55rem] font-bold leading-4 text-white tnum">
                    {counts[to]}
                  </span>
                )}
              </span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
