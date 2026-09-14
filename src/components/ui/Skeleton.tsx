import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-paper-deep", className)} aria-hidden />;
}

/** Matches PropertyCard's footprint so grids don't jump while data loads. */
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-surface">
      <Skeleton className="aspect-4/3 rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
