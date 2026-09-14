import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Empty screens are an invitation to act, not an apology. */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-hairline-strong bg-surface/60 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
        <Icon size={22} aria-hidden />
      </span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
