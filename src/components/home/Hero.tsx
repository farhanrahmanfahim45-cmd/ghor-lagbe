import { Link } from "react-router-dom";
import { DiscoveryCard } from "./DiscoveryCard";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="border-b border-hairline bg-paper">
      <div className="container-page grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_26rem] lg:gap-14 lg:py-20">
        <div className="rise self-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-hairline-strong bg-surface px-3 py-1 text-xs font-semibold text-ink-soft">
            Dhaka rentals
            <span aria-hidden className="size-1 rounded-full bg-ochre-500" />
            rooms, sublets, flats and houses
          </p>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
            Find a place that fits your life.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            Discover rooms, shared accommodation, apartments and homes based on your location,
            budget and needs — with the full monthly cost shown before you call anyone.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/intake">
              <Button size="lg">Find a place</Button>
            </Link>
            <Link to="/list-property">
              <Button size="lg" variant="secondary">
                List your property
              </Button>
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-hairline pt-6 sm:grid-cols-3">
            <Stat value="12" label="Dhaka areas covered" />
            <Stat value="6" label="Accommodation types" />
            <Stat value="200" label="Demo listings" />
          </dl>
        </div>

        <div className="lg:pt-2">
          <DiscoveryCard />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block whitespace-nowrap text-xl font-extrabold text-forest-600 tnum">{value}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted">{label}</span>
      </dd>
    </div>
  );
}
