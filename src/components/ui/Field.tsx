import { useId } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const CONTROL =
  "h-11 w-full rounded-md border border-hairline-strong bg-surface px-3 text-[0.9375rem] " +
  "text-ink placeholder:text-muted transition-colors hover:border-forest-200 " +
  "focus:border-forest-500 focus:outline-none";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink-soft">
      {children}
    </label>
  );
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string;
  hint?: string;
  prefix?: ReactNode;
}

export function Input({ label, hint, prefix, className, id, ...props }: InputProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div>
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {prefix}
          </span>
        )}
        <input id={fieldId} className={cn(CONTROL, prefix ? "pl-8" : undefined, className)} {...props} />
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export function Select({ label, hint, options, className, id, ...props }: SelectProps) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <div>
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <select id={fieldId} className={cn(CONTROL, "appearance-none pr-9", className)} {...props}>
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

/** Segmented control — used for Rent/Buy and List/Map style choices. */
export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string; disabled?: boolean; note?: string }>;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      <div role="group" aria-label={label} className="inline-flex rounded-md border border-hairline-strong bg-paper-deep p-0.5">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              disabled={o.disabled}
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              title={o.note}
              className={cn(
                "rounded px-3.5 py-1.5 text-sm font-semibold transition-colors",
                active ? "bg-surface text-forest-600 shadow-sm" : "text-muted hover:text-ink",
                o.disabled && "cursor-not-allowed opacity-45 hover:text-muted",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
