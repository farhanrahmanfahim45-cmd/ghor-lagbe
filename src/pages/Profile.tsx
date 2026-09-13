import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { useAppState } from "@/hooks/useAppState";

/** Phase 1: renter profile shape. No authentication exists in this prototype. */
export default function Profile() {
  const { role, savedIds, compareIds } = useAppState();

  return (
    <>
      <PageHeader
        title="Your profile"
        lead="A renter profile gives owners enough context to reply — without handing over your documents."
      />

      <div className="container-page grid gap-6 py-8 md:grid-cols-2 md:py-10">
        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="font-bold text-ink">Demo profile</h2>
          <p className="mt-1 text-sm text-muted">
            Currently browsing as a <strong className="font-semibold text-ink">{role}</strong>.
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            <li><Badge tone="ok">Phone verified (demo)</Badge></li>
            <li><Badge tone="ok">Email verified (demo)</Badge></li>
            <li><Badge tone="forest">Student</Badge></li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            There is no sign-in in this prototype. The role switch in the header exists so an
            evaluator can see both sides of the marketplace immediately.
          </p>
        </section>

        <section className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="font-bold text-ink">This session</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Saved places</dt>
              <dd className="font-bold text-ink tnum">{savedIds.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Selected for comparison</dt>
              <dd className="font-bold text-ink tnum">{compareIds.length}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Nothing is stored. Refreshing the page clears this session.
          </p>
        </section>
      </div>
    </>
  );
}
