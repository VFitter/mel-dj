import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "glass" | "raised" | "elevated" | "featured";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

function cardVariantClasses(variant: CardVariant): string {
  switch (variant) {
    case "default":
      return "bg-surface-raised border border-border";
    case "glass":
      return "bg-surface-glass border border-border-subtle backdrop-blur-md";
    case "raised":
      return "bg-surface-overlay border border-border shadow-md";
    case "elevated":
      return "bg-surface-overlay border border-border shadow-lg";
    case "featured":
      return cn(
        "bg-surface-glass border border-brand-primary/40 backdrop-blur-md",
        "shadow-glow",
      );
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl text-text-primary",
        cardVariantClasses(variant),
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-6 pb-0", className)}
      {...props}
    />
  ),
);

CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  ),
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 p-6 pt-0", className)}
      {...props}
    />
  ),
);

CardFooter.displayName = "CardFooter";
