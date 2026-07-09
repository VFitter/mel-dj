import type { NavItem } from "@/components/layout/SiteHeader";

export type Locale = "en" | "fr";

export const navItems: Record<Locale, NavItem[]> = {
  en: [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Advertise" },
    { href: "/contact", label: "Contact" },
    { href: "/design-system", label: "Design" },
  ],
  fr: [
    { href: "/", label: "Accueil" },
    { href: "/pricing", label: "Publicité" },
    { href: "/contact", label: "Contact" },
    { href: "/design-system", label: "Design" },
  ],
};

/** Strip /fr prefix to get the canonical path segment (e.g. /fr/pricing → /pricing). */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/fr" || pathname === "/fr/") return "/";
  if (pathname.startsWith("/fr/")) return pathname.slice(3) || "/";
  return pathname;
}

/** Build a locale-aware path from a canonical segment (e.g. /pricing + fr → /fr/pricing). */
export function localePath(path: string, locale: Locale): string {
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === "fr") {
    return normalized === "/" ? "/fr" : `/fr${normalized}`;
  }
  return normalized;
}

/** Toggle between English and French for the current pathname. */
export function alternateLocalePath(pathname: string): string {
  const canonical = stripLocalePrefix(pathname);
  const isFrench = pathname === "/fr" || pathname.startsWith("/fr/");
  return localePath(canonical, isFrench ? "en" : "fr");
}

export interface SitemapPage {
  href: string;
  label: string;
  description: string;
  locale: Locale;
}

export const publicPages: SitemapPage[] = [
  { href: "/", label: "Home", description: "Live radio player and queue", locale: "en" },
  { href: "/pricing", label: "Advertise", description: "Advertising tiers and pricing", locale: "en" },
  { href: "/contact", label: "Contact", description: "Get in touch with the MEL team", locale: "en" },
  { href: "/design-system", label: "Design System", description: "Visual language and UI components", locale: "en" },
  { href: "/sitemap", label: "Sitemap", description: "All pages on MEL Radio", locale: "en" },
  { href: "/fr", label: "Accueil", description: "Lecteur radio en direct et file d'attente", locale: "fr" },
  { href: "/fr/pricing", label: "Publicité", description: "Forfaits et tarifs publicitaires", locale: "fr" },
  { href: "/fr/contact", label: "Contact", description: "Contactez l'équipe MEL", locale: "fr" },
  { href: "/fr/design-system", label: "Système de Design", description: "Langage visuel et composants UI", locale: "fr" },
  { href: "/fr/sitemap", label: "Plan du Site", description: "Toutes les pages de MEL Radio", locale: "fr" },
];
