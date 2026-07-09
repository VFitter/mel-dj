import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  error?: boolean;
}

function inputSizeClasses(size: InputSize): string {
  switch (size) {
    case "sm":
      return "h-8 px-3 text-xs";
    case "md":
      return "h-10 px-3 text-sm";
    case "lg":
      return "h-12 px-4 text-base";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputSize = "md", error, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full bg-surface-raised text-text-primary placeholder:text-text-muted",
        "border rounded-lg transition-colors duration-fast ease-out",
        "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-error focus:border-error focus:ring-error/20"
          : "border-border",
        inputSizeClasses(inputSize),
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
