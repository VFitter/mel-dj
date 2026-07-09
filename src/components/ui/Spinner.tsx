import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SpinnerSize = "xs" | "sm" | "md" | "lg";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  label?: string;
}

function spinnerSizeClasses(size: SpinnerSize): string {
  switch (size) {
    case "xs":
      return "size-3 border";
    case "sm":
      return "size-4 border-2";
    case "md":
      return "size-6 border-2";
    case "lg":
      return "size-8 border-[3px]";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", label = "Loading", className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-brand-primary/20 border-t-brand-primary",
          spinnerSizeClasses(size),
        )}
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  ),
);

Spinner.displayName = "Spinner";
