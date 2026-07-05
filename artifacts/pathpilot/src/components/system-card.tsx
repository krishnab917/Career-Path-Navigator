import * as React from "react";
import { cn } from "@/lib/utils";

// ─── SystemCard ───────────────────────────────────────────────────────────────
// Unified card primitive for PathPilot Light Mode.
// Clean white/light blue aesthetic with subtle shadows and borders.
// Enforces: title (high contrast) → description (muted) → action row (bottom-right)

interface SystemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual weight: "default" | "elevated" | "ghost" */
  variant?: "default" | "elevated" | "ghost";
}

const SystemCard = React.forwardRef<HTMLDivElement, SystemCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border border-border/60 bg-card hover:border-primary/30 hover:shadow-sm",
      elevated: "border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/2 shadow-md hover:shadow-lg hover:border-primary/40",
      ghost: "border border-border/20 bg-white/50",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl flex flex-col overflow-hidden transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
SystemCard.displayName = "SystemCard";

// ─── Header ───────────────────────────────────────────────────────────────────
interface SystemCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional badge/label slot rendered top-right */
  badge?: React.ReactNode;
}

const SystemCardHeader = React.forwardRef<HTMLDivElement, SystemCardHeaderProps>(
  ({ className, badge, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start justify-between gap-4 px-6 pt-6 pb-0", className)}
      {...props}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
    </div>
  )
);
SystemCardHeader.displayName = "SystemCardHeader";

// ─── Title ────────────────────────────────────────────────────────────────────
const SystemCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-bold text-foreground leading-snug tracking-tight", className)}
      {...props}
    />
  )
);
SystemCardTitle.displayName = "SystemCardTitle";

// ─── Description ─────────────────────────────────────────────────────────────
const SystemCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground mt-1 leading-relaxed", className)}
      {...props}
    />
  )
);
SystemCardDescription.displayName = "SystemCardDescription";

// ─── Content ─────────────────────────────────────────────────────────────────
const SystemCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4 flex-1", className)}
      {...props}
    />
  )
);
SystemCardContent.displayName = "SystemCardContent";

// ─── Metadata row ─────────────────────────────────────────────────────────────
const SystemCardMeta = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 text-[11px] text-muted-foreground px-6 pb-2", className)}
      {...props}
    />
  )
);
SystemCardMeta.displayName = "SystemCardMeta";

// ─── Action row (buttons aligned bottom-right) ────────────────────────────────
const SystemCardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-end gap-2 px-6 py-4 border-t border-border/40",
        className
      )}
      {...props}
    />
  )
);
SystemCardActions.displayName = "SystemCardActions";

export {
  SystemCard,
  SystemCardHeader,
  SystemCardTitle,
  SystemCardDescription,
  SystemCardContent,
  SystemCardMeta,
  SystemCardActions,
};
