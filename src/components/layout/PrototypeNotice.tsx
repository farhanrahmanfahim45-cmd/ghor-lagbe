import { FlaskConical } from "lucide-react";

/**
 * Mandatory disclosure. Every listing in this build is invented seed data.
 * This must stay visible and must not be softened.
 */
export function PrototypeNotice() {
  return (
    <div className="border-b border-forest-200 bg-forest-50">
      <p className="container-page flex items-center gap-2 py-2 text-xs text-forest-700">
        <FlaskConical size={14} className="shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold">Prototype demo.</strong> Listings shown are synthetic
          seed data and do not represent real rental availability.
        </span>
      </p>
    </div>
  );
}
