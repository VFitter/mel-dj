import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SkeletonVariant = "text" | "circular" | "rectangular";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

function skeletonVariantClasses(variant: SkeletonVariant): string {
  switch (variant) {
    case "text":
      return "h-4 w-full rounded-md";
    case "circular":
      return "rounded-full";
    case "rectangular":
      return "rounded-lg";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "rectangular", width, height, className, style, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "animate-pulse bg-surface-overlay",
        skeletonVariantClasses(variant),
        className,
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  ),
);

Skeleton.displayName = "Skeleton";
