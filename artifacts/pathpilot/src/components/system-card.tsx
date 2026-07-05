import * as React from "react";
import { cn } from "@/lib/utils";

// ─── SystemCard ───────────────────────────────────────────────────────────────
// Dynamic SaaS card inspired by Linear and Notion.
// Features: subtle borders, refined shadows, smooth hover states, premium feel.

interface SystemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant: "default" | "elevated" | "interactive" */
  variant?: "default" | "elevated" | "interactive";
}

const SystemCard = React.forwardRef<HTMLDivElement, SystemCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border border-border/50 bg-card hover:border-border/70 hover:shadow-sm transition-all duration-200",
      elevated: "border border-border/60 bg-gradient-to-br from-card to-card/95 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200",
      interactive: "border border-border/40 bg-card hover:border-primary/40 hover:shadow-md hover:bg-card/95 transition-all duration-200 cursor-pointer group",
    };
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl flex flex-col overflow-hidden",
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
      className={cn("flex items-start justify-between gap-4 px-5 pt-5 pb-0", className)}
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
      className={cn("text-sm font-semibold text-foreground leading-snug tracking-tight", className)}
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
      className={cn("px-5 py-4 flex-1", className)}
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
      className={cn("flex items-center gap-3 text-[11px] text-muted-foreground px-5 pb-2", className)}
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
        "flex items-center justify-end gap-2 px-5 py-4 border-t border-border/30",
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
