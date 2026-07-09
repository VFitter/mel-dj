"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

function buttonVariantClasses(variant: ButtonVariant): string {
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

function buttonSizeClasses(size: ButtonSize): string {
  switch (size) {
    case "sm":
      return "h-8 gap-1.5 px-3 text-xs rounded-md";
    case "md":
      return "h-10 gap-2 px-4 text-sm rounded-lg";
    case "lg":
      return "h-12 gap-2.5 px-6 text-base rounded-lg";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-normal ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base",
          "disabled:pointer-events-none disabled:opacity-50",
          buttonVariantClasses(variant),
          buttonSizeClasses(size),
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
        ) : (
          leftIcon
        )}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
