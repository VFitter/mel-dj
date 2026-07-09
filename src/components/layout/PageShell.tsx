import { type ReactNode } from "react";
import { cn } from "@/lib/cn";
import SiteHeader, { type NavItem } from "./SiteHeader";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  withMesh?: boolean;
  nav?: NavItem[];
  locale?: "en" | "fr";
  showHeader?: boolean;
  withPlayerPadding?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export default function PageShell({
  children,
  className,
  maxWidth = "xl",
  withMesh = true,
  nav,
  locale = "en",
  showHeader = true,
  withPlayerPadding = true,
}: PageShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col", withMesh && "bg-mesh")}>
      {showHeader && <SiteHeader nav={nav} locale={locale} />}
      <main
        className={cn(
          "flex-1 w-full mx-auto px-3 sm:px-4 lg:px-6 max-[220px]:px-2 py-4 sm:py-6",
          withPlayerPadding &&
            "pb-[calc(var(--player-bar-height)+env(safe-area-inset-bottom,0px)+1rem)]",
          maxWidthClasses[maxWidth],
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
