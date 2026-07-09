import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textareaSize?: TextareaSize;
  error?: boolean;
}

function textareaSizeClasses(size: TextareaSize): string {
  switch (size) {
    case "sm":
      return "px-3 py-2 text-xs min-h-20";
    case "md":
      return "px-3 py-2 text-sm min-h-28";
    case "lg":
      return "px-4 py-3 text-base min-h-36";
    default: {
      const _exhaustive: never = size;
      return _exhaustive;
    }
  }
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaSize = "md", error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full resize-y bg-surface-raised text-text-primary placeholder:text-text-muted",
        "border rounded-lg transition-colors duration-fast ease-out",
        "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error
          ? "border-error focus:border-error focus:ring-error/20"
          : "border-border",
        textareaSizeClasses(textareaSize),
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
