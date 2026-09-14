import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { useHabito } from "@/hooks/useHabito";
import { db, DEMO_OWNER_ID } from "@/lib/db";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { money, longDate } from "@/lib/format";
import { CATEGORY_LABEL } from "@/types/space";
import type { Owner } from "@/types/space";

export default function Profile() {
  const { role, savedIds, compareIds, inquiries, requests, requirements, hasStatedNeeds, refresh } = useHabito();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    void db.owner(DEMO_OWNER_ID).then(setOwner);
  }, []);

  const reset = async () => {
    setResetting(true);
    await db.reset();
    await refresh();
    setResetting(false);
  };

  return (
    <>
      <PageHeader
        title="Your profile"
        lead="Enough context for an owner to reply, without handing over your documents."
      />

      <div className="container-page grid gap-5 py-8 md:grid-cols-2 md:py-10">
        <section className="rounded-card bg-surface p-6 ring-1 ring-hairline">
          <h2 className="font-display text-lg font-bold text-ink">Demo profile</h2>
          <p className="mt-1 text-sm text-muted">
            Browsing as a <strong className="font-semibold text-ink">{role}</strong>.
          </p>
          <ul className="mt-4 flex flex-wrap gap-1.5 text-xs">
            <li className="rounded-full bg-ok-100 px-2.5 py-1 font-semibold text-ok-600">Phone verified (demo)</li>
            <li className="rounded-full bg-ok-100 px-2.5 py-1 font-semibold text-ok-600">Email verified (demo)</li>
            <li className="rounded-full bg-aqua-100 px-2.5 py-1 font-semibold text-aqua-700">Student</li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            There's no sign-in in this prototype. The role switch in the header lets an evaluator
            see both sides of the marketplace immediately.
          </p>
        </section>

        <section className="rounded-card bg-surface p-6 ring-1 ring-hairline">
          <h2 className="font-display text-lg font-bold text-ink">What you're looking for</h2>
          {hasStatedNeeds ? (
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Category" value={requirements.category === "any" ? "Anything" : CATEGORY_LABEL[requirements.category]} />
              <Row label="Area" value={requirements.area} />
              <Row label="Budget" value={`${money(requirements.budgetMin)} – ${money(requirements.budgetMax)}`} />
              <Row label="Needed by" value={longDate(requirements.moveInDate)} />
            </dl>
          ) : (
            <>
              <p className="mt-2 text-sm text-muted">You haven't told us what you need yet.</p>
              <Link to="/find" className="mt-4 inline-block">
                <Button size="sm">Tell us what you need</Button>
              </Link>
            </>
          )}
        </section>

        {owner && (
          <section className="rounded-card bg-surface p-6 ring-1 ring-hairline">
            <h2 className="font-display text-lg font-bold text-ink">Owner side</h2>
            <p className="mt-1 text-sm text-muted">Signed in as {owner.name} in demo mode.</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Owner state" value={`${owner.verification.replace("-", " ")} (demo)`} />
              <Row label="Response rate" value={`${owner.responseRate}%`} />
              <Row label="Usual reply" value={`Within ${owner.responseTimeHours}h`} />
              <Row label="Member since" value={longDate(owner.memberSince)} />
            </dl>
            <Link to="/portfolio" className="mt-4 inline-block">
              <Button size="sm" variant="secondary">
                Open my spaces
              </Button>
            </Link>
          </section>
        )}

        <section className="rounded-card bg-surface p-6 ring-1 ring-hairline">
          <h2 className="font-display text-lg font-bold text-ink">This device</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Saved spaces" value={String(savedIds.length)} />
            <Row label="In compare" value={String(compareIds.length)} />
            <Row label="Inquiries sent" value={String(inquiries.length)} />
            <Row label="Requests posted" value={String(requests.length)} />
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Habito stores your data on this device, so it survives a refresh. Resetting restores the
            original seed dataset and clears anything you've added.
          </p>
          <Button variant="secondary" size="sm" className="mt-4" disabled={resetting} onClick={() => void reset()}>
            <RotateCcw size={14} aria-hidden />
            {resetting ? "Resetting…" : "Reset demo data"}
          </Button>
        </section>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold text-ink">{value}</dd>
    </div>
  );
}
