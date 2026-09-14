/** Bangladesh-facing formatting helpers. */

const TAKA = "\u09F3";

export function taka(amount: number): string {
  return TAKA + amount.toLocaleString("en-IN");
}

/** Compact form for dense surfaces like map markers: ৳12K, ৳8.5K */
export function takaCompact(amount: number): string {
  if (amount < 1000) return taka(amount);
  const k = amount / 1000;
  const rounded = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
  return `${TAKA}${rounded}K`;
}

export function daysSince(iso: string): number {
  const then = new Date(iso).getTime();
  return Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
}

export function lastUpdatedLabel(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return "Updated today";
  if (d === 1) return "Updated yesterday";
  if (d < 30) return `Updated ${d} days ago`;
  const months = Math.floor(d / 30);
  return `Updated ${months} month${months > 1 ? "s" : ""} ago`;
}

/** Compact form for card footers, where the full sentence gets truncated. */
export function lastUpdatedShort(iso: string): string {
  const d = daysSince(iso);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 35) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export function isStale(iso: string): boolean {
  return daysSince(iso) > 21;
}

/** "1 October 2026" — spelled out, since renters read dates rather than sort them. */
export function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function availableFromLabel(iso: string): string {
  const diff = Math.floor((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diff <= 0) return "Available now";
  return `Available from ${longDate(iso)}`;
}
