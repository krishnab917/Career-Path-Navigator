import * as React from "react";
import { cn } from "@/lib/utils";

// ─── StateLabel ───────────────────────────────────────────────────────────────
// Minimal SaaS status indicator inspired by Linear and Notion.
// Clean, engaging, and purposeful.

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
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    defaultLabel: "Stable",
  },
  evolving: {
    dot: "bg-blue-500",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    defaultLabel: "Evolving",
  },
  "high-risk": {
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    defaultLabel: "High Risk",
  },
  "time-pressure": {
    dot: "bg-orange-500 animate-pulse",
    text: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    defaultLabel: "Time Pressure",
  },
  active: {
    dot: "bg-blue-500 animate-pulse",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    defaultLabel: "Active",
  },
  completed: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    defaultLabel: "Completed",
  },
  locked: {
    dot: "bg-gray-400",
    text: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
    defaultLabel: "Locked",
  },
};

export function StateLabel({ variant, label, className, ...props }: StateLabelProps) {
  const v = VARIANTS[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md border",
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
