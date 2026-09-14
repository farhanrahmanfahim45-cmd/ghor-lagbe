import { Check, Minus, X } from "lucide-react";
import type { MatchResult } from "@/types/property";
import { cn } from "@/lib/cn";

/** Never round a partial score up to full marks — the icon would contradict it. */
function formatPoints(points: number): string {
  const rounded = Math.round(points);
  if (Math.abs(points - rounded) < 0.05) return String(rounded);
  return points.toFixed(1);
}

const VERDICT = {
  met: { Icon: Check, className: "text-ok-600", srLabel: "Met" },
  partial: { Icon: Minus, className: "text-warn-700", srLabel: "Partly met" },
  missed: { Icon: X, className: "text-danger-600", srLabel: "Not met" },
} as const;

/**
 * The moment the product earns its keep: a score, and the reasons behind it.
 * Never render the number without this.
 */
export function MatchBreakdown({
  match,
  variant = "panel",
}: {
  match: MatchResult;
  variant?: "panel" | "inline";
}) {
  return (
    <div
      className={cn(
        variant === "panel" && "rounded-xl border border-forest-200 bg-forest-50 p-5",
      )}
    >
      {variant === "panel" && (
        <div className="mb-4 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-forest-600 tnum">{match.score}%</span>
          <div>
            <p className="font-bold text-ink">Ghor Lagbe Match</p>
            <p className="text-xs text-forest-700">Scored against what you told us</p>
          </div>
        </div>
      )}

      <h3
        className={cn(
          "font-bold text-ink",
          variant === "panel" ? "text-sm" : "text-base",
        )}
      >
        Why this works for you
      </h3>

      <ul className="mt-2.5 space-y-2">
        {match.factors.map((factor) => {
          const { Icon, className, srLabel } = VERDICT[factor.verdict];
          return (
            <li key={factor.key} className="flex gap-2.5 text-sm">
              <Icon size={15} className={cn("mt-0.5 shrink-0", className)} aria-hidden />
              <span className="sr-only">{srLabel}:</span>
              <span className="flex-1 leading-snug text-ink-soft">
                <span className="font-semibold text-ink">{factor.label}</span>
                <span className="mx-1.5 text-hairline-strong" aria-hidden>
                  ·
                </span>
                {factor.detail}
              </span>
              <span className="shrink-0 text-xs font-semibold text-muted tnum">
                {formatPoints(factor.score * factor.weight)}/{factor.weight}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 border-t border-forest-200 pt-3 text-xs leading-relaxed text-forest-700">
        Scores are arithmetic over the requirements you entered — budget 35, location 25, property
        type 20, move-in 10, preferences 10. No machine learning is involved.
      </p>
    </div>
  );
}
