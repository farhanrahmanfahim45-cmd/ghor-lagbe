import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertyCard } from "@/components/property/PropertyCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { DEMO_PROPERTIES } from "@/data/properties";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/components/ui/Toast";

export default function Saved() {
  const { savedIds, isSaved, toggleSaved } = useAppState();
  const { notify } = useToast();
  const saved = DEMO_PROPERTIES.filter((p) => savedIds.includes(p.id));

  return (
    <>
      <PageHeader
        title="Saved places"
        lead="Shortlist the places worth a second look, then put them side by side."
        actions={
          saved.length > 1 ? (
            <Link to="/compare">
              <Button>Compare selected</Button>
            </Link>
          ) : undefined
        }
      />

      <div className="container-page py-8 md:py-10">
        {saved.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your shortlist is empty."
            body="Save a place while you browse and it will wait for you here."
            action={
              <Link to="/search">
                <Button>Explore properties</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={isSaved(property.id)}
                onToggleSave={(id) => {
                  toggleSaved(id);
                  notify("Removed from your shortlist");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
