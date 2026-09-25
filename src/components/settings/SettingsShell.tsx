"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  User,
  Cpu,
  KeyRound,
  Sparkles,
  Sliders,
  Flame,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SETTINGS_NAV_ITEMS = [
  { href: "/settings/general", label: "Umum & Profil", icon: User },
  { href: "/settings/models", label: "Model AI Default", icon: Cpu },
  { href: "/settings/api-keys", label: "API Key Pribadi (BYOK)", icon: KeyRound },
  { href: "/settings/persona", label: "Persona & Prompt", icon: Sparkles },
  { href: "/settings/parameters", label: "Parameter Model", icon: Sliders },
  { href: "/settings/usage", label: "Kuota & Penggunaan", icon: Flame },
  { href: "/settings/data", label: "Data & Ekspor", icon: Database },
];

export function SettingsShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-card/60 px-4 md:px-8 backdrop-blur-md">
        <Link
          href="/chat"
          className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Chat</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Pengaturan Akun & Sistem
          </span>
        </div>
      </header>

      {/* Main Settings Container */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row gap-8 px-4 py-8 md:px-8">
        {/* Left Settings Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {SETTINGS_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Right Settings Content Panel */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  );
}
