import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "ok" | "warn" | "danger" | "forest" | "ochre";

const TONES: Record<Tone, string> = {
  neutral: "bg-paper-deep text-ink-soft",
  ok: "bg-ok-100 text-ok-600",
  warn: "bg-warn-100 text-warn-700",
  danger: "bg-danger-100 text-danger-600",
  forest: "bg-forest-100 text-forest-700",
  ochre: "bg-ochre-100 text-ochre-700",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
