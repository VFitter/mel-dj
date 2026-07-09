"use client";

import { useEffect, useId, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Disc3,
  ListOrdered,
  DollarSign,
  History,
  Mail,
  LogOut,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import { Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tracks", label: "Tracks", icon: Disc3 },
  { href: "/admin/queue", label: "Queue", icon: ListOrdered },
  { href: "/admin/ads", label: "Ads & Pricing", icon: DollarSign },
  { href: "/admin/history", label: "History", icon: History },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/visitors", label: "Visitors", icon: MapPin },
];

function getPageTitle(pathname: string): string {
  const item = navItems.find((nav) => nav.href === pathname);
  return item?.label ?? "Admin";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuId = useId();
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) setAuthed(true);
        else router.push("/admin/login");
      })
      .catch(() => router.push("/admin/login"))
      .finally(() => setLoading(false));
  }, [pathname, router]);

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

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (!authed) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const navLinkClassName = (active: boolean, mobile = false) =>
    cn(
      "flex items-center gap-3 rounded-lg text-sm transition-all duration-200",
      mobile ? "min-h-11 px-4 py-3 text-base" : "px-3 py-2",
      active
        ? "bg-brand-primary text-white shadow-glow"
        : "text-text-secondary hover:text-text-primary hover:bg-surface-overlay",
    );

  const sidebar = (
    <>
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="text-xs leading-none tracking-tight uppercase text-text-primary">
          MEL Radio
        </Link>
        <p className="text-xs text-text-muted">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClassName(active, menuOpen)}
              onClick={() => setMenuOpen(false)}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 min-h-11 px-3 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-overlay mb-1 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Disc3 className="h-4 w-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 min-h-11 px-3 py-2 text-sm text-text-secondary hover:text-error rounded-lg hover:bg-surface-overlay w-full transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-base flex flex-col lg:flex-row">
      <header className="lg:hidden sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-surface-raised/95 backdrop-blur-lg px-3 py-3 pt-safe">
        <button
          type="button"
          className="inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-muted">MEL Radio Admin</p>
          <h1 className="text-base font-semibold text-text-primary truncate">{pageTitle}</h1>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        id={menuId}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(18rem,88vw)] bg-surface-raised border-r border-border flex flex-col transition-transform duration-300 ease-out lg:static lg:z-auto lg:w-56 lg:translate-x-0",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      <main className="flex-1 min-w-0 overflow-auto p-4 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
        {children}
      </main>
    </div>
  );
}
