import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "xl" | "lg" | "md" | "sm";
export type HeadingVariant = "display" | "title" | "subtitle" | "section";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  variant?: HeadingVariant;
  gradient?: boolean;
}

function variantToSize(variant: HeadingVariant): HeadingSize {
  switch (variant) {
    case "display":
      return "xl";
    case "title":
      return "lg";
    case "subtitle":
      return "md";
    case "section":
      return "sm";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function sizeClasses(size: HeadingSize): string {
  switch (size) {
    case "xl":
      return "text-4xl sm:text-5xl font-bold tracking-tight";
    case "lg":
      return "text-2xl sm:text-3xl font-bold tracking-tight";
    case "md":
      return "text-xl font-semibold";
    case "sm":
      return "text-lg font-semibold";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Tag = "h2", size, variant, gradient, className, children, ...props }, ref) => {
    const resolvedSize = size ?? (variant ? variantToSize(variant) : "md");

    return (
      <Tag
        ref={ref}
        className={cn(
          sizeClasses(resolvedSize),
          gradient ? "text-gradient" : "text-text-primary",
          className,
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

Heading.displayName = "Heading";
