import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

function alertVariantClasses(variant: AlertVariant): string {
  switch (variant) {
    case "info":
      return "bg-info/10 border-info/30 text-text-primary [&_[data-alert-icon]]:text-info";
    case "success":
      return "bg-success/10 border-success/30 text-text-primary [&_[data-alert-icon]]:text-success";
    case "warning":
      return "bg-warning/10 border-warning/30 text-text-primary [&_[data-alert-icon]]:text-warning";
    case "error":
      return "bg-error/10 border-error/30 text-text-primary [&_[data-alert-icon]]:text-error";
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

function defaultAlertIcon(variant: AlertVariant): ReactNode {
  switch (variant) {
    case "info":
      return <Info className="size-5" />;
    case "success":
      return <CheckCircle2 className="size-5" />;
    case "warning":
      return <AlertTriangle className="size-5" />;
    case "error":
      return <AlertCircle className="size-5" />;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "info",
      title,
      icon,
      dismissible = false,
      onDismiss,
      className,
      children,
      role = "alert",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      role={role}
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        alertVariantClasses(variant),
        className,
      )}
      {...props}
    >
      <span data-alert-icon className="shrink-0">
        {icon ?? defaultAlertIcon(variant)}
      </span>
      <div className="flex-1 space-y-1">
        {title && <p className="text-sm font-semibold text-text-primary">{title}</p>}
        {children && <div className="text-sm text-text-secondary">{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-text-muted transition-colors hover:text-text-primary"
          aria-label="Dismiss alert"
        >
          <span aria-hidden className="text-lg leading-none">
            &times;
          </span>
        </button>
      )}
    </div>
  ),
);

Alert.displayName = "Alert";
