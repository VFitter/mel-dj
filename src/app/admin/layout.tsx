"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Disc3, ListOrdered, DollarSign, History, Mail, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tracks", label: "Tracks", icon: Disc3 },
  { href: "/admin/queue", label: "Queue", icon: ListOrdered },
  { href: "/admin/ads", label: "Ads & Pricing", icon: DollarSign },
  { href: "/admin/history", label: "History", icon: History },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  if (pathname === "/admin/login") return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!authed) return null;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <Link href="/admin" className="text-lg font-bold text-white">MEL Radio</Link>
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-zinc-800">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 mb-1">
            <Disc3 className="h-4 w-4" />
            View Site
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 w-full">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
