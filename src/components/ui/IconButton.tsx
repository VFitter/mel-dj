"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ButtonSize, ButtonVariant } from "@/components/ui/Button";

export type IconButtonVariant = ButtonVariant;
export type IconButtonSize = ButtonSize;

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  label: string;
  icon?: ReactNode;
  children?: ReactNode;
}

function iconButtonVariantClasses(variant: IconButtonVariant): string {
  switch (variant) {
    case "primary":
      return cn(
        "bg-brand-primary text-text-inverse",
        "shadow-glow hover:bg-brand-primary-hover hover:shadow-glow",
        "focus-visible:ring-brand-primary/60",
      );
    case "secondary":
      return cn(
        "bg-surface-raised text-text-primary border border-border",
        "hover:bg-surface-overlay hover:border-border-subtle",
        "focus-visible:ring-border",
      );
    case "ghost":
      return cn(
        "bg-transparent text-text-secondary",
        "hover:bg-surface-raised hover:text-text-primary",
        "focus-visible:ring-border-subtle",
      );
    case "danger":
      return cn(
        "bg-error/15 text-error border border-error/30",
        "hover:bg-error/25 hover:border-error/50",
        "focus-visible:ring-error/50",
      );
    case "accent":
      return cn(
        "bg-brand-accent text-text-inverse",
        "shadow-glow-accent hover:bg-brand-accent-hover hover:shadow-glow-accent",
        "focus-visible:ring-brand-accent/60",
      );
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function iconButtonSizeClasses(size: IconButtonSize): string {
  switch (size) {
    case "sm":
      return "size-8 rounded-md [&_svg]:size-3.5";
    case "md":
      return "size-10 rounded-lg [&_svg]:size-4";
    case "lg":
      return "size-12 rounded-lg [&_svg]:size-5";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      loading = false,
      disabled,
      label,
      icon,
      children,
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const content = icon ?? children;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-label={label}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center shrink-0",
          "transition-all duration-normal ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:pointer-events-none disabled:opacity-50",
          iconButtonVariantClasses(variant),
          iconButtonSizeClasses(size),
          className,
        )}
        {...props}
      >
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : content}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
