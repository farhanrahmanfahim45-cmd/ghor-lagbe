import type { Property } from "@/types/property";
import dataset from "./listings.json";

/**
 * SYNTHETIC SEED DATA — 200 generated records.
 * These are invented listings used to build and demonstrate the interface.
 * They do not represent real rental availability, real owners or real photos.
 *
 * Regenerate with: node scripts/generate-listings.mjs
 */
export const DEMO_PROPERTIES = dataset.listings as unknown as Property[];

export const DATASET_NOTICE = dataset._notice;
export const DATASET_GENERATED_ON = dataset.generatedOn;

export const propertyById = (id: string) => DEMO_PROPERTIES.find((p) => p.id === id);
