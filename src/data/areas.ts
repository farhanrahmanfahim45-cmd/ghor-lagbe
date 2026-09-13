/**
 * Dhaka-area reference data.
 * `typicalFrom` is an indicative starting rent for the demo dataset — it is not
 * market research and is labelled as demo data wherever it appears in the UI.
 */
export interface Area {
  id: string;
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  /** Indicative rent multiplier used when seeding demo listings. */
  rentIndex: number;
  typicalFrom: number;
  note: string;
}

export const AREAS: Area[] = [
  { id: "mirpur", name: "Mirpur", district: "Dhaka", latitude: 23.8069, longitude: 90.3687, rentIndex: 0.85, typicalFrom: 5500, note: "Dense, well-connected, wide range of rooms and flats" },
  { id: "mohammadpur", name: "Mohammadpur", district: "Dhaka", latitude: 23.759, longitude: 90.3595, rentIndex: 0.9, typicalFrom: 6000, note: "Established residential, strong bachelor and family supply" },
  { id: "uttara", name: "Uttara", district: "Dhaka", latitude: 23.87, longitude: 90.399, rentIndex: 1.15, typicalFrom: 8000, note: "Planned sectors, airport and metro access" },
  { id: "badda", name: "Badda", district: "Dhaka", latitude: 23.7806, longitude: 90.4264, rentIndex: 0.88, typicalFrom: 6000, note: "Central-east, popular with working renters" },
  { id: "bashundhara", name: "Bashundhara R/A", district: "Dhaka", latitude: 23.82, longitude: 90.4265, rentIndex: 1.25, typicalFrom: 9000, note: "University corridor, high student demand" },
  { id: "rampura", name: "Rampura", district: "Dhaka", latitude: 23.761, longitude: 90.418, rentIndex: 0.86, typicalFrom: 5800, note: "Mixed residential along the main artery" },
  { id: "kallyanpur", name: "Kallyanpur", district: "Dhaka", latitude: 23.779, longitude: 90.3597, rentIndex: 0.82, typicalFrom: 5000, note: "Affordable, close to Mirpur Road transport" },
  { id: "jatrabari", name: "Jatrabari", district: "Dhaka", latitude: 23.7104, longitude: 90.4335, rentIndex: 0.7, typicalFrom: 4500, note: "South Dhaka, lower rent band" },
  { id: "savar", name: "Savar", district: "Dhaka", latitude: 23.8583, longitude: 90.2667, rentIndex: 0.62, typicalFrom: 4000, note: "Outer belt, budget and family housing" },
  { id: "tongi", name: "Tongi", district: "Gazipur", latitude: 23.8917, longitude: 90.4058, rentIndex: 0.65, typicalFrom: 4200, note: "Northern edge, industrial employment base" },
  { id: "keraniganj", name: "Keraniganj", district: "Dhaka", latitude: 23.69, longitude: 90.39, rentIndex: 0.6, typicalFrom: 3800, note: "Across the river, lowest rent band" },
  { id: "narayanganj", name: "Narayanganj", district: "Narayanganj", latitude: 23.6238, longitude: 90.5, rentIndex: 0.66, typicalFrom: 4200, note: "Separate city, commuter and family supply" },
];

/** The eight surfaced on the homepage — the rest stay available in search. */
export const FEATURED_AREA_IDS = [
  "mirpur",
  "mohammadpur",
  "uttara",
  "badda",
  "bashundhara",
  "rampura",
  "kallyanpur",
  "jatrabari",
];

export const areaByName = (name: string) => AREAS.find((a) => a.name === name);
