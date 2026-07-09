import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/Label";

export interface FormFieldProps {
  id?: string;
  htmlFor?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({
  id,
  htmlFor,
  label,
  description,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const fieldId = id ?? htmlFor;
  const descriptionId = description && fieldId ? `${fieldId}-description` : undefined;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && fieldId && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}
      {label && !fieldId && (
        <Label required={required}>{label}</Label>
      )}
      <div
        aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
      >
        {children}
      </div>
      {description && (
        <p id={descriptionId} className="text-xs text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
