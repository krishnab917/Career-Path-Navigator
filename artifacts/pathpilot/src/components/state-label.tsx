import * as React from "react";
import { cn } from "@/lib/utils";

// ─── StateLabel ───────────────────────────────────────────────────────────────
// Cheap, powerful UI badge that creates "system intelligence" feel.
// Used on simulation cards, scenario headers, and opportunity cards.

export type StateLabelVariant =
  | "stable"
  | "evolving"
  | "high-risk"
  | "time-pressure"
  | "active"
  | "completed"
  | "locked";

interface StateLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: StateLabelVariant;
  /** Override the default label text */
  label?: string;
}

const VARIANTS: Record<
  StateLabelVariant,
  { dot: string; text: string; bg: string; border: string; defaultLabel: string }
> = {
  stable: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    defaultLabel: "Stable",
  },
  evolving: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    defaultLabel: "Evolving",
  },
  "high-risk": {
    dot: "bg-red-400",
    text: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    defaultLabel: "High Risk",
  },
  "time-pressure": {
    dot: "bg-orange-400 animate-pulse",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    defaultLabel: "Time Pressure",
  },
  active: {
    dot: "bg-indigo-400 animate-pulse",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    defaultLabel: "Active",
  },
  completed: {
    dot: "bg-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    defaultLabel: "Completed",
  },
  locked: {
    dot: "bg-zinc-500",
    text: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    defaultLabel: "Locked",
  },
};

export function StateLabel({ variant, label, className, ...props }: StateLabelProps) {
  const v = VARIANTS[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
        v.bg,
        v.border,
        v.text,
        className
      )}
      {...props}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", v.dot)} />
      {label ?? v.defaultLabel}
    </span>
  );
}
