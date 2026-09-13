import {
  ArrowUpDown,
  Wifi,
  Flame,
  Zap,
  Car,
  Trees,
  ShowerHead,
  Sofa,
  Droplets,
  ShieldCheck,
  Cctv,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { AmenityKey } from "@/types/property";

export const AMENITIES: Record<AmenityKey, { label: string; icon: LucideIcon }> = {
  lift: { label: "Lift", icon: ArrowUpDown },
  wifi: { label: "Wi-Fi ready", icon: Wifi },
  gas: { label: "Gas line", icon: Flame },
  generator: { label: "Generator", icon: Zap },
  parking: { label: "Parking", icon: Car },
  balcony: { label: "Balcony", icon: Trees },
  "attached-bathroom": { label: "Attached bathroom", icon: ShowerHead },
  furnished: { label: "Furnished", icon: Sofa },
  "water-reserve": { label: "Water reserve", icon: Droplets },
  security: { label: "Security guard", icon: ShieldCheck },
  cctv: { label: "CCTV", icon: Cctv },
  rooftop: { label: "Rooftop access", icon: Building2 },
};

export const AMENITY_KEYS = Object.keys(AMENITIES) as AmenityKey[];
