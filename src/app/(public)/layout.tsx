import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/25">
      {/* Sticky Glass Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-lg hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet-600 to-cyan-500 shadow-md shadow-primary/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-foreground tracking-tight">
              Aether<span className="text-primary">Chat</span>
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link
              href="/#fitur"
              className="hover:text-foreground transition-colors"
            >
              Fitur Unggulan
            </Link>
            <Link
              href="/#demo"
              className="hover:text-foreground transition-colors"
            >
              Coba Chat
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="/#faq"
              className="hover:text-foreground transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              variant="glow"
              size="sm"
              asChild
              className="rounded-xl px-4 text-white font-medium"
            >
              <Link href="/register">
                <span>Daftar Gratis</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/40 py-12 text-sm text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <span>AetherChat</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Antarmuka chatbot AI generasi baru bergaya Grok dengan streaming multi-model ultra-cepat, BYOK fleksibel, dan privasi terenkripsi.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                Navigasi
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/chat" className="hover:text-foreground transition-colors">
                    Mulai Chat Sekarang
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    Cerita & Misi Kami
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-foreground transition-colors">
                    Daftar Akun Baru
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                Legalitas
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
                Teknologi
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ditenagai oleh Next.js 15, Vercel AI SDK, Supabase PostgreSQL & Auth, Tailwind CSS, dan model AI terkini.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-primary">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Semua Sistem Beroperasi Normal</span>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground/80">
            <p>© {new Date().getFullYear()} AetherChat. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="mt-2 sm:mt-0">Dibuat dengan presisi untuk pengguna AI di Indonesia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
