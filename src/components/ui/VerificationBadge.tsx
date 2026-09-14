import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import type { VerificationStatus } from "@/types/property";
import { Badge } from "./Badge";

/**
 * Verification in this prototype is a demonstrated workflow, not a performed check.
 * The wording deliberately says "demo" so nothing on screen overstates what exists.
 */
export type VerificationLevel = "verified" | "partial" | "unverified";

export function verificationLevel(v: VerificationStatus): VerificationLevel {
  if (v.propertyDetailsVerified && v.identityVerified) return "verified";
  if (v.phoneVerified || v.propertyDetailsVerified) return "partial";
  return "unverified";
}

const COPY: Record<VerificationLevel, { label: string; tone: "ok" | "warn" | "neutral"; Icon: typeof ShieldCheck }> = {
  verified: { label: "Verified (demo)", tone: "ok", Icon: ShieldCheck },
  partial: { label: "Partly verified (demo)", tone: "warn", Icon: ShieldQuestion },
  unverified: { label: "Not verified", tone: "neutral", Icon: ShieldAlert },
};

export function VerificationBadge({
  verification,
  showLabel = true,
}: {
  verification: VerificationStatus;
  showLabel?: boolean;
}) {
  const level = verificationLevel(verification);
  const { label, tone, Icon } = COPY[level];
  return (
    <Badge tone={tone} icon={<Icon size={12} aria-hidden />}>
      {showLabel ? label : <span className="sr-only">{label}</span>}
    </Badge>
  );
}
