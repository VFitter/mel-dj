"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export type SelectSize = "sm" | "md" | "lg";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  selectSize?: SelectSize;
  error?: boolean;
}

function selectSizeClasses(size: SelectSize): string {
  switch (size) {
    case "sm":
      return "h-8 pl-3 pr-8 text-xs";
    case "md":
      return "h-10 pl-3 pr-9 text-sm";
    case "lg":
      return "h-12 pl-4 pr-10 text-base";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, selectSize = "md", error, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none cursor-pointer bg-surface-raised text-text-primary",
          "border rounded-lg transition-colors duration-fast ease-out",
          "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-border",
          selectSizeClasses(selectSize),
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
    </div>
  ),
);

Select.displayName = "Select";
