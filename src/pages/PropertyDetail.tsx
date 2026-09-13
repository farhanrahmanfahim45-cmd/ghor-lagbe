import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, MapPin, Scale, SearchX, ArrowLeft } from "lucide-react";
import { propertyById } from "@/data/properties";
import { taka, longDate, lastUpdatedLabel, availableFromLabel, isStale } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { AmenityChip } from "@/components/ui/AmenityChip";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";

export default function PropertyDetail() {
  const { id = "" } = useParams();
  const property = propertyById(id);
  const [activeImage, setActiveImage] = useState(0);
  const { isSaved, toggleSaved, isComparing, toggleCompare } = useAppState();
  const { notify } = useToast();

  if (!property) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title="That listing isn't here."
          body="It may have been removed from the demo dataset, or the link is incorrect."
          action={
            <Link to="/search">
              <Button>Back to search</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const { cost } = property;
  const saved = isSaved(property.id);
  const comparing = isComparing(property.id);
  const image = property.images[activeImage];

  return (
    <div className="container-page py-6 md:py-10">
      <Link
        to="/search"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-forest-600"
      >
        <ArrowLeft size={15} aria-hidden />
        Back to results
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          {/* Gallery */}
          <figure>
            <div className="overflow-hidden rounded-lg border border-hairline bg-paper-deep">
              <img src={image.url} alt={image.alt} className="aspect-4/3 w-full object-cover" />
            </div>
            {property.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {property.images.map((img, i) => (
                  <button
                    key={img.url + i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show ${img.room}`}
                    aria-current={i === activeImage}
                    className={cn(
                      "shrink-0 overflow-hidden rounded border-2 transition-colors",
                      i === activeImage ? "border-forest-600" : "border-transparent hover:border-hairline-strong",
                    )}
                  >
                    <img src={img.url} alt="" className="h-16 w-22 object-cover" />
                    <span className="sr-only">{img.room}</span>
                  </button>
                ))}
              </div>
            )}
            <figcaption className="mt-2 text-xs text-muted">
              Illustrative demo images. These are not photographs of a real property.
            </figcaption>
          </figure>

          {/* Summary */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <AvailabilityBadge status={property.availabilityStatus} />
              <VerificationBadge verification={property.verification} />
              <span className={cn("text-xs", isStale(property.lastUpdated) ? "font-medium text-warn-700" : "text-muted")}>
                {lastUpdatedLabel(property.lastUpdated)}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">{property.title}</h1>

            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={15} aria-hidden />
              {property.address}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-4">
              <Fact label="Bedrooms" value={property.bedrooms || "—"} />
              <Fact label="Bathrooms" value={property.bathrooms} />
              <Fact label="Size" value={`${property.size} sqft`} />
              <Fact label="Floor" value={property.floor} />
            </dl>

            <p className="mt-6 leading-relaxed text-ink-soft">{property.description}</p>
          </div>

          {/* Amenities */}
          <section className="mt-8" aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="text-lg font-bold text-ink">
              What's included
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {property.amenities.map((key) => (
                <li key={key}>
                  <AmenityChip amenity={key} />
                </li>
              ))}
            </ul>
          </section>

          {/* Rules */}
          <section className="mt-8" aria-labelledby="rules-heading">
            <h2 id="rules-heading" className="text-lg font-bold text-ink">
              Who this suits
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              <li><Badge tone={property.rules.familyAllowed ? "ok" : "neutral"}>{property.rules.familyAllowed ? "Family allowed" : "Not for families"}</Badge></li>
              <li><Badge tone={property.rules.bachelorAllowed ? "ok" : "neutral"}>{property.rules.bachelorAllowed ? "Bachelor allowed" : "No bachelors"}</Badge></li>
              {property.rules.studentFriendly && <li><Badge tone="ok">Student friendly</Badge></li>}
              {property.rules.genderPreference && property.rules.genderPreference !== "any" && (
                <li><Badge tone="forest">{property.rules.genderPreference === "male" ? "Male occupant" : "Female occupant"}</Badge></li>
              )}
            </ul>
          </section>

          {/* Nearby */}
          <section className="mt-8" aria-labelledby="nearby-heading">
            <h2 id="nearby-heading" className="text-lg font-bold text-ink">
              Getting around
            </h2>
            <ul className="mt-3 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2">
              {property.nearby.map((n) => (
                <li key={n.label} className="flex items-center justify-between bg-surface px-4 py-3 text-sm">
                  <span className="text-ink-soft">{n.label}</span>
                  <span className="font-semibold text-ink tnum">{n.km} km</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sticky cost panel */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-hairline bg-surface p-5">
            <p className="text-2xl font-extrabold text-ink tnum">
              {taka(cost.rent)}
              <span className="text-base font-medium text-muted">/month</span>
            </p>
            <p className="mt-1 text-sm text-muted">{availableFromLabel(property.availableFrom)}</p>

            <h2 className="mt-5 text-sm font-bold text-ink">Monthly cost breakdown</h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <CostRow label="Rent" value={taka(cost.rent)} />
              <CostRow label="Service charge" value={cost.serviceCharge !== null ? taka(cost.serviceCharge) : "Not listed"} muted={cost.serviceCharge === null} />
              <CostRow label="Gas and utilities" value={cost.utilities !== null ? taka(cost.utilities) : "Not listed"} muted={cost.utilities === null} />
              <CostRow label="Electricity" value="Metered" muted />
            </dl>

            <div className="mt-3 border-t border-hairline pt-3">
              {cost.estimatedMonthlyCost ? (
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-ink">Estimated monthly</span>
                  <span className="text-lg font-extrabold text-forest-600 tnum">
                    {taka(cost.estimatedMonthlyCost)}
                  </span>
                </div>
              ) : (
                <p className="rounded bg-warn-100 px-3 py-2 text-xs leading-relaxed text-warn-700">
                  This owner hasn't listed every cost, so a monthly total can't be shown yet.
                </p>
              )}
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-hairline pt-3 text-sm">
              <CostRow label="Advance" value={`${cost.advanceMonths} month${cost.advanceMonths > 1 ? "s" : ""}`} />
              <CostRow label="Security deposit" value={cost.securityDeposit !== null ? taka(cost.securityDeposit) : "Not listed"} muted={cost.securityDeposit === null} />
            </dl>

            <div className="mt-5 space-y-2">
              <Button fullWidth disabled title="The inquiry flow arrives in the next build">
                Send inquiry
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => notify(toggleSaved(property.id) ? "Saved to your shortlist" : "Removed from your shortlist")}
                >
                  <Heart size={15} className={saved ? "fill-danger-600 text-danger-600" : ""} aria-hidden />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const added = toggleCompare(property.id);
                    notify(added ? "Added to compare" : comparing ? "Removed from compare" : "You can compare up to three places", added ? "ok" : "info");
                  }}
                >
                  <Scale size={15} aria-hidden />
                  {comparing ? "Comparing" : "Compare"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-hairline bg-surface p-5">
            <h2 className="text-sm font-bold text-ink">Listed by</h2>
            <p className="mt-1 font-semibold text-ink">{property.owner.name}</p>
            <p className="text-sm capitalize text-muted">{property.owner.role}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {property.owner.verification.phoneVerified && <li><Badge tone="ok">Phone verified (demo)</Badge></li>}
              {property.owner.verification.identityVerified && <li><Badge tone="ok">Identity verified (demo)</Badge></li>}
              {property.verification.propertyDetailsVerified && <li><Badge tone="ok">Property details verified (demo)</Badge></li>}
              {property.verification.verifiedOn && (
                <li><Badge tone="neutral">Checked {longDate(property.verification.verifiedOn)}</Badge></li>
              )}
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Verification states in this prototype demonstrate the intended workflow. No real
              identity or ownership check has been carried out.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 font-bold text-ink tnum">{value}</dd>
    </div>
  );
}

function CostRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={cn("font-semibold tnum", muted ? "text-muted" : "text-ink")}>{value}</dd>
    </div>
  );
}
