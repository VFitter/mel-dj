"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import MelLogo from "@/components/brand/MelLogo";
import QrShareButton from "@/components/layout/QrShareButton";
import { cn } from "@/lib/cn";
import { alternateLocalePath, localePath, navItems, type Locale } from "@/lib/i18n";

export interface NavItem {
  href: string;
  label: string;
}

interface SiteHeaderProps {
  nav?: NavItem[];
  locale?: Locale;
}

const menuCopy = {
  en: { open: "Open menu", close: "Close menu" },
  fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
} as const;

export default function SiteHeader({ nav, locale = "en" }: SiteHeaderProps) {
  const pathname = usePathname();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const items = nav ?? navItems[locale];
  const menuLabels = menuCopy[locale];

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  const isNavActive = (href: string, itemHref: string) =>
    hasMounted && (pathname === href || (itemHref !== "/" && pathname.startsWith(href)));

  const linkClassName = (active: boolean) =>
    cn(
      "px-3 py-1.5 rounded-lg transition-all duration-200",
      active
        ? "text-brand-accent bg-brand-accent/10"
        : "text-text-secondary hover:text-text-primary hover:bg-surface-overlay",
    );

  const mobileLinkClassName = (active: boolean) =>
    cn(
      "flex items-center min-h-11 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
      active
        ? "text-brand-accent bg-brand-accent/10"
        : "text-text-secondary hover:text-text-primary hover:bg-surface-overlay",
    );

  return (
    <header className="sticky top-0 z-40 pt-safe">
      <div
        className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 max-[220px]:px-2 flex items-center justify-between border-b border-border bg-surface-glass backdrop-blur-lg backdrop-saturate-150"
        style={{ minHeight: "var(--header-height)" }}
      >
        <Link href={localePath("/", locale)} className="flex items-center gap-2.5 group min-h-11">
          <MelLogo size={20} className="transition-transform duration-300 group-hover:scale-110" />
          <span className="font-bold uppercase text-text-primary tracking-tight max-[220px]:hidden sm:inline">MEL Radio</span>
          <span className="font-bold uppercase text-text-primary tracking-tight hidden max-[220px]:inline text-sm">MEL</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {items.map((item) => {
            const href = localePath(item.href, locale);
            const active = isNavActive(href, item.href);
            return (
              <Link key={item.href} href={href} className={linkClassName(active)}>
                {item.label}
              </Link>
            );
          })}
          <QrShareButton locale={locale} className="ml-1" />
          <Link
            href={alternateLocalePath(pathname)}
            className="ml-2 px-2 py-1 text-xs text-text-muted hover:text-text-secondary border border-border rounded-md transition-colors"
            title={locale === "fr" ? "English" : "Français"}
          >
            {locale === "fr" ? "EN" : "FR"}
          </Link>
          <Link
            href="/admin"
            className="ml-1 px-2 py-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Admin
          </Link>
        </nav>

        <div className="md:hidden flex items-center gap-0.5">
          <QrShareButton locale={locale} panelClassName="right-0" />
          <button
            type="button"
            className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? menuLabels.close : menuLabels.open}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id={menuId}
          className="md:hidden fixed inset-0 top-[var(--header-height)] z-[var(--z-overlay)] bg-surface-base/95 backdrop-blur-lg border-t border-border overflow-y-auto"
        >
          <div className="flex flex-col gap-1 p-4 pb-[calc(var(--player-bar-height)+env(safe-area-inset-bottom,0px)+1rem)]">
            {items.map((item) => {
              const href = localePath(item.href, locale);
              const active = isNavActive(href, item.href);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={mobileLinkClassName(active)}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-2 pt-2 border-t border-border flex flex-col gap-1">
              <Link
                href={alternateLocalePath(pathname)}
                className="flex items-center min-h-11 px-4 py-3 rounded-xl text-base text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
                title={locale === "fr" ? "English" : "Français"}
                onClick={() => setMenuOpen(false)}
              >
                {locale === "fr" ? "English" : "Français"}
              </Link>
              <Link
                href="/admin"
                className="flex items-center min-h-11 px-4 py-3 rounded-xl text-base text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
