import type {
  MatchFactor,
  MatchResult,
  Property,
  RenterRequirements,
} from "@/types/property";
import { AREAS } from "@/data/areas";
import { AMENITIES } from "@/data/amenities";
import { taka, longDate } from "./format";

/**
 * Ghor Lagbe Match — a transparent, rule-based score.
 *
 * This is arithmetic over stated requirements, not a learned model, and it is
 * never described as AI anywhere in the product. Every factor returns the
 * sentence a renter would need to understand why the number came out as it did.
 *
 * Weights are fixed by the product spec:
 *   budget 35 · location 25 · property type 20 · move-in 10 · preferences 10
 */
export const WEIGHTS = {
  budget: 35,
  location: 25,
  propertyType: 20,
  moveInDate: 10,
  preferences: 10,
} as const;

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Straight-line distance in km. Good enough for ranking within one city. */
function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function distanceFromArea(property: Property, areaName: string): number | null {
  const area = AREAS.find((a) => a.name === areaName);
  if (!area) return null;
  return haversineKm(area.latitude, area.longitude, property.latitude, property.longitude);
}

/* ── Individual factors ───────────────────────────────────────────── */

function budgetFactor(p: Property, r: RenterRequirements): MatchFactor {
  // Judged on what the renter actually pays each month where that is known,
  // because rent alone is the number that misleads people.
  const monthly = p.cost.estimatedMonthlyCost ?? p.cost.rent;
  const usingTotal = p.cost.estimatedMonthlyCost !== null;
  const { budgetMin, budgetMax } = r;

  let score: number;
  let verdict: MatchFactor["verdict"];
  let detail: string;

  if (monthly <= budgetMax && monthly >= budgetMin) {
    score = 1;
    verdict = "met";
    detail = usingTotal
      ? `Full monthly cost of ${taka(monthly)} sits inside your budget`
      : `Rent of ${taka(monthly)} sits inside your budget`;
  } else if (monthly < budgetMin) {
    // Under budget is a mild mismatch, not a failure — cheaper rarely hurts.
    const gap = (budgetMin - monthly) / Math.max(budgetMin, 1);
    score = clamp01(1 - gap * 0.35);
    verdict = "met";
    detail = `${taka(monthly)} a month — below the range you set`;
  } else {
    const over = monthly - budgetMax;
    const overshoot = over / Math.max(budgetMax, 1);
    score = clamp01(1 - overshoot * 2.2);
    verdict = overshoot <= 0.12 ? "partial" : "missed";
    detail = `${taka(over)} a month over your maximum${
      usingTotal ? " once service charge and gas are counted" : ""
    }`;
  }

  return { key: "budget", label: "Budget", weight: WEIGHTS.budget, score, verdict, detail };
}

function locationFactor(p: Property, r: RenterRequirements): MatchFactor {
  const sameArea = p.area === r.area;
  const km = distanceFromArea(p, r.area);

  if (sameArea) {
    return {
      key: "location",
      label: "Location",
      weight: WEIGHTS.location,
      score: 1,
      verdict: "met",
      detail: `In ${p.neighborhood}, inside the area you chose`,
    };
  }

  if (km === null) {
    return {
      key: "location",
      label: "Location",
      weight: WEIGHTS.location,
      score: 0.5,
      verdict: "partial",
      detail: `In ${p.area} rather than ${r.area}`,
    };
  }

  // Falls away over roughly 12km — Dhaka-scale, not country-scale.
  const score = clamp01(1 - km / 12);
  return {
    key: "location",
    label: "Location",
    weight: WEIGHTS.location,
    score,
    verdict: km <= 4 ? "partial" : "missed",
    detail: `About ${km.toFixed(1)} km from ${r.area}, in ${p.area}`,
  };
}

/** Types a renter is usually willing to accept as a substitute. */
const NEIGHBOURING_TYPES: Record<string, string[]> = {
  room: ["shared-room", "sublet"],
  "shared-room": ["room", "sublet"],
  sublet: ["room", "shared-room", "apartment"],
  apartment: ["sublet", "house"],
  house: ["apartment"],
  commercial: [],
};

function propertyTypeFactor(p: Property, r: RenterRequirements): MatchFactor {
  const base = { key: "propertyType" as const, label: "Property type", weight: WEIGHTS.propertyType };

  if (r.propertyType === "any") {
    // Not a confirmed fit, just an absent constraint — scored as neutral so
    // listings that actually match a stated type can rank above it.
    return { ...base, score: 0.9, verdict: "met", detail: "You're open to any property type" };
  }

  if (p.propertyType === r.propertyType) {
    const accomOk =
      r.accommodationType === "any" || p.accommodationType === r.accommodationType;
    return {
      ...base,
      score: accomOk ? 1 : 0.8,
      verdict: accomOk ? "met" : "partial",
      detail: accomOk
        ? "Exactly the kind of place you asked for"
        : `The right type, but ${p.accommodationType} rather than ${r.accommodationType}`,
    };
  }

  if (NEIGHBOURING_TYPES[r.propertyType]?.includes(p.propertyType)) {
    return {
      ...base,
      score: 0.55,
      verdict: "partial",
      detail: `A ${p.propertyType.replace("-", " ")} rather than the ${r.propertyType.replace("-", " ")} you asked for`,
    };
  }

  return {
    ...base,
    score: 0,
    verdict: "missed",
    detail: `A ${p.propertyType.replace("-", " ")}, not what you were looking for`,
  };
}

function moveInFactor(p: Property, r: RenterRequirements): MatchFactor {
  const base = { key: "moveInDate" as const, label: "Move-in date", weight: WEIGHTS.moveInDate };
  const want = new Date(r.moveInDate).getTime();
  const free = new Date(p.availableFrom).getTime();
  const daysLate = Math.round((free - want) / 86400000);

  if (p.availabilityStatus === "unavailable") {
    return { ...base, score: 0, verdict: "missed", detail: "Currently rented out" };
  }

  if (daysLate <= 0) {
    return {
      ...base,
      score: 1,
      verdict: "met",
      detail: `Free from ${longDate(p.availableFrom)}, before you need it`,
    };
  }

  // A month of waiting is tolerable; beyond that it stops being the same search.
  const score = clamp01(1 - daysLate / 45);
  return {
    ...base,
    score,
    verdict: daysLate <= 14 ? "partial" : "missed",
    detail: `Free from ${longDate(p.availableFrom)} — ${daysLate} day${daysLate > 1 ? "s" : ""} after you wanted to move`,
  };
}

function preferencesFactor(p: Property, r: RenterRequirements): MatchFactor {
  const base = { key: "preferences" as const, label: "Your preferences", weight: WEIGHTS.preferences };

  if (r.preferredAmenities.length === 0) {
    return { ...base, score: 0.9, verdict: "met", detail: "You didn't name anything essential" };
  }

  const have = r.preferredAmenities.filter((a) => p.amenities.includes(a));
  const missing = r.preferredAmenities.filter((a) => !p.amenities.includes(a));
  const score = have.length / r.preferredAmenities.length;

  if (missing.length === 0) {
    return { ...base, score: 1, verdict: "met", detail: "Has everything you asked for" };
  }

  const missingLabels = missing.map((m) => AMENITIES[m].label.toLowerCase()).join(", ");
  return {
    ...base,
    score,
    verdict: score >= 0.5 ? "partial" : "missed",
    detail: `No ${missingLabels}`,
  };
}

/* ── Scoring ──────────────────────────────────────────────────────── */

export function scoreProperty(p: Property, r: RenterRequirements): MatchResult {
  const factors = [
    budgetFactor(p, r),
    locationFactor(p, r),
    propertyTypeFactor(p, r),
    moveInFactor(p, r),
    preferencesFactor(p, r),
  ];

  const weighted = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  const total = factors.reduce((sum, f) => sum + f.weight, 0);
  const pct = (weighted / total) * 100;

  // Only a genuinely perfect fit is allowed to read as 100%. Rounding a 99.6
  // up to 100 while a factor is still flagged as partial reads as dishonest.
  const score = pct >= 99.995 ? 100 : Math.min(99, Math.round(pct));

  return { propertyId: p.id, score, factors };
}

export function scoreAll(
  properties: Property[],
  requirements: RenterRequirements,
): Map<string, MatchResult> {
  const map = new Map<string, MatchResult>();
  for (const p of properties) map.set(p.id, scoreProperty(p, requirements));
  return map;
}

/** Default requirements so search is usable before anyone fills the intake in. */
export const DEFAULT_REQUIREMENTS: RenterRequirements = {
  purpose: "rent",
  area: "Mirpur",
  budgetMin: 6000,
  budgetMax: 12000,
  propertyType: "any",
  accommodationType: "any",
  moveInDate: new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10),
  priority: "best-location",
  preferredAmenities: [],
};
