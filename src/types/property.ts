/**
 * Ghor Lagbe — domain model.
 * Designed to stay stable as later phases add matching, compare and owner flows.
 */

export type Purpose = "rent" | "buy";

export type PropertyType =
  | "room"
  | "shared-room"
  | "apartment"
  | "house"
  | "sublet"
  | "commercial";

export type AccommodationType = "single" | "shared" | "entire";

export type Furnishing = "furnished" | "semi-furnished" | "unfurnished";

export type AvailabilityStatus =
  | "available"
  | "recently-confirmed"
  | "needs-confirmation"
  | "unavailable";

export type AmenityKey =
  | "lift"
  | "wifi"
  | "gas"
  | "generator"
  | "parking"
  | "balcony"
  | "attached-bathroom"
  | "furnished"
  | "water-reserve"
  | "security"
  | "cctv"
  | "rooftop";

export interface Amenity {
  key: AmenityKey;
  label: string;
}

export interface PropertyRules {
  familyAllowed: boolean;
  bachelorAllowed: boolean;
  studentFriendly: boolean;
  genderPreference?: "male" | "female" | "any";
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
}

/**
 * Verification in this prototype is a *demonstrated workflow*, not a performed check.
 * `demo: true` is carried on every record so the UI can label it honestly.
 */
export interface VerificationStatus {
  demo: true;
  identityVerified: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  propertyDetailsVerified: boolean;
  locationConfirmed: boolean;
  verifiedOn?: string;
}

export interface Owner {
  id: string;
  name: string;
  role: "owner" | "caretaker";
  memberSince: string;
  responseTimeHours?: number;
  verification: VerificationStatus;
}

export interface PropertyImage {
  url: string;
  room: string;
  alt: string;
  /** All prototype imagery is illustrative, never a real property photo. */
  demo: true;
}

export interface CostBreakdown {
  rent: number;
  serviceCharge: number | null;
  utilities: number | null;
  securityDeposit: number | null;
  advanceMonths: number;
  /** null when the owner has not disclosed every component. */
  estimatedMonthlyCost: number | null;
}

export interface NearbyPlace {
  label: string;
  km: number;
}

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  accommodationType: AccommodationType;
  purpose: Purpose;

  area: string;
  neighborhood: string;
  address: string;
  latitude: number;
  longitude: number;
  nearby: NearbyPlace[];

  cost: CostBreakdown;

  bedrooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnishing: Furnishing;
  condition: "newly-renovated" | "good" | "needs-minor-maintenance";

  amenities: AmenityKey[];
  rules: PropertyRules;

  availableFrom: string;
  availabilityStatus: AvailabilityStatus;
  lastUpdated: string;

  owner: Owner;
  verification: VerificationStatus;
  images: PropertyImage[];
  description: string;

  views: number;
  inquiries: number;

  /** Every seed record is synthetic. Never remove this flag. */
  synthetic: true;
}

/* ── Matching (scored in a later phase; shape fixed now) ───────────── */

export type MatchFactorKey =
  | "budget"
  | "location"
  | "propertyType"
  | "moveInDate"
  | "preferences";

export interface MatchFactor {
  key: MatchFactorKey;
  label: string;
  weight: number;
  /** 0–1 */
  score: number;
  verdict: "met" | "partial" | "missed";
  detail: string;
}

export interface MatchResult {
  propertyId: string;
  /** 0–100, rounded for display. */
  score: number;
  factors: MatchFactor[];
}

export interface RenterRequirements {
  purpose: Purpose;
  area: string;
  budgetMin: number;
  budgetMax: number;
  propertyType: PropertyType | "any";
  accommodationType: AccommodationType | "any";
  moveInDate: string;
  priority: "lowest-cost" | "best-location" | "more-space" | "better-amenities";
  preferredAmenities: AmenityKey[];
}

/* ── Inquiries (stored in client state only) ───────────────────────── */

export interface Inquiry {
  id: string;
  propertyId: string;
  message: string;
  moveInDate: string;
  budgetMin: number;
  budgetMax: number;
  sentAt: string;
  status: "new" | "responded";
}

export type DemoRole = "renter" | "owner";
