import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "default" | "primary" | "accent" | "success" | "warning" | "error" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

function badgeVariantClasses(variant: BadgeVariant): string {
  switch (variant) {
    case "default":
      return "bg-surface-overlay text-text-secondary border border-border-subtle";
    case "primary":
      return "bg-brand-primary/15 text-brand-primary border border-brand-primary/30";
    case "accent":
      return "bg-brand-accent/15 text-brand-accent border border-brand-accent/30";
    case "success":
      return "bg-success/15 text-success border border-success/30";
    case "warning":
      return "bg-warning/15 text-warning border border-warning/30";
    case "error":
      return "bg-error/15 text-error border border-error/30";
    case "outline":
      return "bg-transparent text-text-muted border border-border";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function badgeSizeClasses(size: BadgeSize): string {
  switch (size) {
    case "sm":
      return "px-2 py-0.5 text-[10px] rounded-sm";
    case "md":
      return "px-2.5 py-0.5 text-xs rounded-md";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center font-medium leading-none whitespace-nowrap",
        badgeVariantClasses(variant),
        badgeSizeClasses(size),
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";
