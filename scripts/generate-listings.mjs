/**
 * Generates src/data/listings.json — the full synthetic seed dataset.
 * Run: node scripts/generate-listings.mjs
 *
 * Records match the Property interface in src/types/property.ts exactly.
 * Nothing here is real: no real properties, owners, photos or availability.
 */
import { writeFileSync, mkdirSync } from "node:fs";

const AREAS = [
  { name: "Mirpur", hoods: ["Mirpur 1", "Mirpur 2", "Mirpur 10", "Mirpur 11", "Kazipara", "Shewrapara"], lat: 23.8069, lng: 90.3687, idx: 0.85 },
  { name: "Mohammadpur", hoods: ["Tajmahal Road", "Shyamoli", "Adabor", "Katasur"], lat: 23.759, lng: 90.3595, idx: 0.9 },
  { name: "Uttara", hoods: ["Sector 3", "Sector 7", "Sector 10", "Sector 13"], lat: 23.87, lng: 90.399, idx: 1.15 },
  { name: "Badda", hoods: ["Middle Badda", "North Badda", "Merul Badda"], lat: 23.7806, lng: 90.4264, idx: 0.88 },
  { name: "Bashundhara R/A", hoods: ["Block A", "Block C", "Block D", "Block G"], lat: 23.82, lng: 90.4265, idx: 1.25 },
  { name: "Rampura", hoods: ["West Rampura", "Banasree", "Ulon"], lat: 23.761, lng: 90.418, idx: 0.86 },
  { name: "Kallyanpur", hoods: ["Kallyanpur", "Darussalam"], lat: 23.779, lng: 90.3597, idx: 0.82 },
  { name: "Jatrabari", hoods: ["Jatrabari", "Dholairpar", "Konapara"], lat: 23.7104, lng: 90.4335, idx: 0.7 },
  { name: "Savar", hoods: ["Bank Colony", "Genda", "Radio Colony"], lat: 23.8583, lng: 90.2667, idx: 0.62 },
  { name: "Tongi", hoods: ["Cherag Ali", "Station Road"], lat: 23.8917, lng: 90.4058, idx: 0.65 },
  { name: "Keraniganj", hoods: ["Zinzira", "Aganagar"], lat: 23.69, lng: 90.39, idx: 0.6 },
  { name: "Narayanganj", hoods: ["Chashara", "Fatullah"], lat: 23.6238, lng: 90.5, idx: 0.66 },
];

const TYPES = [
  { type: "shared-room", accom: "shared", w: 18, beds: [1, 1], sqft: [90, 170], rent: [4000, 8000], baths: [1, 1] },
  { type: "room", accom: "single", w: 16, beds: [1, 1], sqft: [110, 210], rent: [6000, 11000], baths: [1, 1] },
  { type: "sublet", accom: "single", w: 11, beds: [1, 2], sqft: [280, 620], rent: [8000, 15000], baths: [1, 2] },
  { type: "apartment", accom: "entire", w: 41, beds: [1, 4], sqft: [450, 1400], rent: [9000, 34000], baths: [1, 3] },
  { type: "house", accom: "entire", w: 8, beds: [3, 5], sqft: [1200, 2200], rent: [24000, 55000], baths: [2, 4] },
  { type: "commercial", accom: "entire", w: 6, beds: [0, 0], sqft: [200, 900], rent: [12000, 40000], baths: [1, 2] },
];

const AMENITIES = ["lift", "wifi", "gas", "generator", "parking", "balcony", "attached-bathroom", "furnished", "water-reserve", "security", "cctv", "rooftop"];
const CONDITIONS = [
  { v: "newly-renovated", w: 3 },
  { v: "good", w: 6 },
  { v: "needs-minor-maintenance", w: 2 },
];
const FURNISHING = [
  { v: "unfurnished", w: 5 },
  { v: "semi-furnished", w: 4 },
  { v: "furnished", w: 2 },
];
const NEARBY = [
  ["University", 0.3, 3.2],
  ["Bus stop", 0.1, 0.9],
  ["Hospital", 0.5, 3.5],
  ["Grocery", 0.1, 0.8],
  ["Metro station", 0.5, 4.0],
  ["Pharmacy", 0.1, 1.1],
];

const FIRST = ["Rafiqul", "Nusrat", "Shahin", "Farhana", "Kamrul", "Jamal", "Sabbir", "Abdul", "Tanvir", "Ruma", "Mizanur", "Sharmin", "Habibur", "Nasrin", "Delwar", "Ayesha", "Sohel", "Rokeya", "Anisur", "Mahmuda", "Faruk", "Shirin", "Jahangir", "Tahmina"];
const LAST = ["Islam", "Jahan", "Alam", "Karim", "Hasan", "Uddin", "Rahman", "Mannan", "Ahmed", "Akter", "Chowdhury", "Begum", "Sarkar", "Haque", "Mia", "Khatun"];

/* deterministic RNG so the dataset is identical on every run */
let seed = 20260914;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const int = (a, b) => Math.floor(a + rnd() * (b - a + 1));
const pick = (arr) => arr[int(0, arr.length - 1)];
const weighted = (arr) => {
  const total = arr.reduce((s, x) => s + x.w, 0);
  let r = rnd() * total;
  for (const x of arr) if ((r -= x.w) <= 0) return x;
  return arr[arr.length - 1];
};
const round = (n, to) => Math.round(n / to) * to;
const iso = (offsetDays) => new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10);

const TYPE_LABEL = {
  "shared-room": "Shared room",
  room: "Single room",
  sublet: "Sublet",
  apartment: "Apartment",
  house: "Family house",
  commercial: "Commercial space",
};

function makeVerification(level, verifiedDaysAgo) {
  const base = { demo: true };
  if (verifiedDaysAgo !== undefined) base.verifiedOn = iso(-verifiedDaysAgo);
  if (level === "full") return { ...base, identityVerified: true, phoneVerified: true, emailVerified: true, propertyDetailsVerified: true, locationConfirmed: true };
  if (level === "partial") return { ...base, identityVerified: false, phoneVerified: true, emailVerified: true, propertyDetailsVerified: true, locationConfirmed: false };
  return { ...base, identityVerified: false, phoneVerified: rnd() > 0.3, emailVerified: false, propertyDetailsVerified: false, locationConfirmed: false };
}

function makeListing(i) {
  const area = pick(AREAS);
  const hood = pick(area.hoods);
  const t = weighted(TYPES);

  const bedrooms = int(t.beds[0], t.beds[1]);
  const bathrooms = Math.max(1, Math.min(bedrooms || 1, int(t.baths[0], t.baths[1])));
  const sqft = round(int(t.sqft[0], t.sqft[1]), 10);

  // rent scales with area index and, for apartments, with bedroom count
  let rentBase = int(t.rent[0], t.rent[1]);
  if (t.type === "apartment") rentBase = round(8000 + bedrooms * int(3500, 6500), 500);
  const rent = round(rentBase * area.idx, 500);

  // ~26% of listings deliberately hide part of the cost, so the transparency
  // feature has something to contrast against
  const disclosed = rnd() > 0.26;
  const serviceCharge = disclosed ? round(rent * (0.06 + rnd() * 0.08), 100) : null;
  const utilities = disclosed ? pick([800, 900, 1000, 1200]) : null;
  const securityDeposit = disclosed ? round(rent * pick([0.5, 1, 1]), 500) : null;
  const advanceMonths = pick([1, 2, 2, 3]);
  const estimatedMonthlyCost = disclosed ? rent + serviceCharge + utilities : null;

  // skewed toward recent; a meaningful minority go stale
  const updatedDays = Math.floor(Math.pow(rnd(), 2) * 48);
  const stale = updatedDays > 21;

  const availableInDays = int(0, 60);
  let availabilityStatus;
  const roll = rnd();
  if (roll > 0.9) availabilityStatus = "unavailable";
  else if (stale) availabilityStatus = "needs-confirmation";
  else if (updatedDays <= 3) availabilityStatus = "recently-confirmed";
  else availabilityStatus = "available";

  const vLevel = rnd() > 0.45 ? "full" : rnd() > 0.35 ? "partial" : "minimal";
  const verification = makeVerification(vLevel, vLevel === "full" ? int(2, 90) : undefined);

  const amenityPool = [...AMENITIES].sort(() => rnd() - 0.5);
  const amenities = amenityPool.slice(0, int(3, 7));
  const furnishing = weighted(FURNISHING).v;
  if (furnishing === "furnished" && !amenities.includes("furnished")) amenities.push("furnished");

  const isRoom = t.type === "shared-room" || t.type === "room";
  const familyAllowed = t.type === "apartment" || t.type === "house" ? rnd() > 0.25 : false;
  const bachelorAllowed = isRoom || t.type === "sublet" ? true : rnd() > 0.6;
  const genderPreference = isRoom ? pick(["male", "female", "any", "any"]) : undefined;

  const nearby = NEARBY.filter(() => rnd() > 0.3).map(([label, lo, hi]) => ({
    label,
    km: Number((lo + rnd() * (hi - lo)).toFixed(1)),
  }));

  const ownerName = `${pick(FIRST)} ${pick(LAST)}`;
  const rooms = ["Exterior", "Living room", "Bedroom", "Kitchen", "Bathroom", "Balcony"];
  const imageCount = int(2, 5);
  const title = `${TYPE_LABEL[t.type]} in ${hood}`;

  return {
    id: `GL-${String(i + 1).padStart(4, "0")}`,
    title,
    propertyType: t.type,
    accommodationType: t.accom,
    purpose: "rent",

    area: area.name,
    neighborhood: hood,
    address: `House ${int(3, 120)}, Road ${int(1, 22)}, ${hood}`,
    latitude: Number((area.lat + (rnd() - 0.5) * 0.014).toFixed(5)),
    longitude: Number((area.lng + (rnd() - 0.5) * 0.014).toFixed(5)),
    nearby,

    cost: { rent, serviceCharge, utilities, securityDeposit, advanceMonths, estimatedMonthlyCost },

    bedrooms,
    bathrooms,
    size: sqft,
    floor: int(1, 8),
    furnishing,
    condition: weighted(CONDITIONS).v,

    amenities,
    rules: {
      familyAllowed,
      bachelorAllowed,
      studentFriendly: isRoom || t.type === "sublet" ? rnd() > 0.2 : rnd() > 0.7,
      ...(genderPreference ? { genderPreference } : {}),
    },

    availableFrom: iso(availableInDays),
    availabilityStatus,
    lastUpdated: iso(-updatedDays),

    owner: {
      id: `O-${String(i + 1).padStart(4, "0")}`,
      name: ownerName,
      role: rnd() > 0.3 ? "owner" : "caretaker",
      memberSince: iso(-int(60, 400)),
      responseTimeHours: int(1, 36),
      verification: makeVerification(vLevel, vLevel === "full" ? int(2, 90) : undefined),
    },
    verification,

    images: Array.from({ length: imageCount }, (_, k) => ({
      url: `/photos/demo-${int(1, 8)}.svg`,
      room: rooms[k % rooms.length],
      alt: `Illustrative demo image representing the ${rooms[k % rooms.length].toLowerCase()} of a ${TYPE_LABEL[t.type].toLowerCase()} in ${hood}`,
      demo: true,
    })),

    description:
      `${TYPE_LABEL[t.type]} of ${sqft} sqft in ${hood}, ${area.name}. ` +
      `${bedrooms ? `${bedrooms} bedroom${bedrooms > 1 ? "s" : ""}, ` : ""}${bathrooms} bathroom${bathrooms > 1 ? "s" : ""}, ${furnishing.replace("-", " ")}. ` +
      (familyAllowed ? "Suitable for families. " : bachelorAllowed ? "Bachelors welcome. " : "") +
      (amenities.includes("lift") ? "Lift in the building. " : "") +
      (amenities.includes("generator") ? "Standby generator. " : ""),

    views: int(8, 260),
    inquiries: int(0, 30),
    synthetic: true,
  };
}

const COUNT = 200;
const listings = Array.from({ length: COUNT }, (_, i) => makeListing(i));

mkdirSync("src/data", { recursive: true });
writeFileSync(
  "src/data/listings.json",
  JSON.stringify(
    {
      _notice:
        "SYNTHETIC SEED DATA — generated for the Ghor Lagbe prototype. No real properties, owners, photos or availability.",
      generatedOn: new Date().toISOString().slice(0, 10),
      count: listings.length,
      listings,
    },
    null,
    1,
  ),
);

console.log(`wrote src/data/listings.json (${listings.length} records)`);
