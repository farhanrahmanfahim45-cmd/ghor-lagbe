import type { AvailabilityStatus } from "@/types/property";
import { Badge } from "./Badge";

const COPY: Record<AvailabilityStatus, { label: string; tone: "ok" | "warn" | "neutral" | "forest" }> = {
  available: { label: "Available", tone: "forest" },
  "recently-confirmed": { label: "Confirmed", tone: "ok" },
  "needs-confirmation": { label: "Needs confirmation", tone: "warn" },
  unavailable: { label: "Rented out", tone: "neutral" },
};

export function AvailabilityBadge({ status }: { status: AvailabilityStatus }) {
  const { label, tone } = COPY[status];
  return <Badge tone={tone}>{label}</Badge>;
}
