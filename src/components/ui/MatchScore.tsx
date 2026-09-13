import { cn } from "@/lib/cn";

/**
 * The signature element of the product. Rule-based and transparent —
 * never described as AI anywhere in the interface.
 */
export function MatchScore({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-2.5 py-1",
    lg: "text-2xl px-4 py-2",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1 rounded bg-forest-600 font-bold text-white tnum",
        sizes[size],
        className,
      )}
    >
      {score}%
      <span className={cn("font-medium opacity-90", size === "lg" ? "text-sm" : "text-[0.7rem]")}>
        match
      </span>
    </span>
  );
}

/** Placeholder used before the matching engine lands in a later phase. */
export function MatchScorePlaceholder({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-6 w-16", md: "h-7 w-20", lg: "h-11 w-32" } as const;
  return (
    <span
      className={cn("inline-block rounded bg-forest-100", sizes[size])}
      aria-label="Match score available once you tell us what you need"
    />
  );
}
