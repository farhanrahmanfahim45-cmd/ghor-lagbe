import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { PopularAreas } from "@/components/home/PopularAreas";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DEMO_PROPERTIES } from "@/data/properties";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";

export default function Home() {
  const { isSaved, toggleSaved } = useAppState();
  const { notify } = useToast();

  const recent = DEMO_PROPERTIES.filter((p) => p.availabilityStatus !== "unavailable").slice(0, 4);

  return (
    <>
      <Hero />

      <section aria-labelledby="recent-heading" className="container-page py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="recent-heading" className="text-2xl font-extrabold text-ink sm:text-3xl">
              Recently added
            </h2>
            <p className="mt-2 text-sm text-muted">
              A sample of the demo dataset. Match scores appear once you tell us what you need.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-700"
          >
            Browse all listings
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              saved={isSaved(property.id)}
              onToggleSave={(id) => {
                const added = toggleSaved(id);
                notify(added ? "Saved to your shortlist" : "Removed from your shortlist");
              }}
            />
          ))}
        </div>
      </section>

      <HowItWorks />
      <PopularAreas />
      <TrustSection />
    </>
  );
}
