"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  SlidersHorizontal,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ADMIN_NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard Ringkasan", icon: LayoutDashboard },
  { href: "/admin/users", label: "Kelola Pengguna", icon: Users },
  { href: "/admin/providers", label: "Provider & Model AI", icon: SlidersHorizontal },
  { href: "/admin/logs", label: "Log Sistem & Abuse", icon: FileText },
];

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border/70 bg-card/80 p-4 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-500/20">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Aether Admin</h2>
              <Badge variant="violet" className="text-[10px] px-1.5 py-0">
                Superadmin
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Link: Back to Chat */}
        <div className="border-t border-border/60 pt-4">
          <Link
            href="/chat"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Chat</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
