const STEPS = [
  {
    title: "Tell us what you need",
    body: "Area, budget, property type, move-in date and what matters most to you.",
  },
  {
    title: "Discover and match",
    body: "Listings are scored against your requirements, with every reason shown.",
  },
  {
    title: "Compare",
    body: "Put two or three places side by side on rent, total cost, size and trust.",
  },
  {
    title: "Connect",
    body: "Send a structured inquiry so the owner knows your budget and move-in date.",
  },
];

/** A genuine sequence, so numbering earns its place here. */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-heading" className="border-y border-hairline bg-paper-deep">
      <div className="container-page py-14 md:py-20">
        <h2 id="how-heading" className="text-2xl font-extrabold text-ink sm:text-3xl">
          How Ghor Lagbe works
        </h2>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-2 bg-surface p-5">
              <span className="text-sm font-extrabold text-forest-600 tnum">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-bold text-ink">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
