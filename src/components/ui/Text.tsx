import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TextVariant = "body" | "lead" | "secondary" | "muted" | "caption" | "label";
export type TextSize = "xs" | "sm" | "base" | "lg";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "div";
  variant?: TextVariant;
  size?: TextSize;
}

function variantClasses(variant: TextVariant): string {
  switch (variant) {
    case "body":
      return "text-text-primary";
    case "lead":
      return "text-text-secondary leading-relaxed";
    case "secondary":
      return "text-text-secondary";
    case "muted":
      return "text-text-muted";
    case "caption":
      return "text-text-muted";
    case "label":
      return "text-text-secondary font-medium";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function sizeClasses(size: TextSize): string {
  switch (size) {
    case "xs":
      return "text-xs";
    case "sm":
      return "text-sm";
    case "base":
      return "text-base";
    case "lg":
      return "text-lg";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

function defaultSizeForVariant(variant: TextVariant): TextSize {
  switch (variant) {
    case "body":
    case "lead":
      return "base";
    case "secondary":
    case "muted":
    case "label":
      return "sm";
    case "caption":
      return "xs";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Tag = "p", variant = "body", size, className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        variantClasses(variant),
        sizeClasses(size ?? defaultSizeForVariant(variant)),
        className,
      )}
      {...props}
    />
  ),
);

Text.displayName = "Text";
