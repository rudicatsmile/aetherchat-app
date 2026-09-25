"use client";

import React, { useState } from "react";
import { User, Mail, Globe, Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CURRENT_MOCK_USER } from "@/lib/mock-data";

export default function GeneralSettingsPage() {
  const [fullName, setFullName] = useState(CURRENT_MOCK_USER.fullName);
  const [email] = useState(CURRENT_MOCK_USER.email);
  const [locale, setLocale] = useState(CURRENT_MOCK_USER.locale);
  const [theme, setTheme] = useState(CURRENT_MOCK_USER.theme);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Pengaturan Umum & Profil
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kelola informasi akun Anda dan preferensi tampilan AetherChat.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="bg-card/70 border-border/80 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Profil Pengguna</CardTitle>
            <CardDescription className="text-xs">
              Foto dan nama tampilan Anda akan terlihat pada bubble pesan obrolan.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-border/80">
                <AvatarImage src={CURRENT_MOCK_USER.avatarUrl} alt={fullName} />
                <AvatarFallback>RP</AvatarFallback>
              </Avatar>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => alert("Upload foto profil baru (akan terintegrasi dengan Supabase Storage di Fase 2)")}
                >
                  Ubah Foto Profil
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Mendukung JPG, PNG atau GIF maksimal 2MB.
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Lengkap
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="max-w-md text-xs"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Alamat Email
              </label>
              <Input
                value={email}
                disabled
                className="max-w-md text-xs opacity-70 bg-secondary/30"
              />
              <p className="text-[11px] text-muted-foreground">
                Email terikat dengan login Supabase Auth Anda.
              </p>
            </div>

            {/* Locale */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Bahasa Antarmuka
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLocale("id-ID")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs border transition-all ${
                    locale === "id-ID"
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <span>🇮🇩</span>
                  <span>Bahasa Indonesia (Default)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("en-US")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs border transition-all ${
                    locale === "en-US"
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <span>🇺🇸</span>
                  <span>English (US)</span>
                </button>
              </div>
            </div>

            {/* Theme Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tema Tampilan
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs border transition-all ${
                    theme === "dark"
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Moon className="h-3.5 w-3.5" />
                  <span>Dark Mode (Grok Style)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs border transition-all ${
                    theme === "light"
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {saved && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium animate-in fade-in">
                  <Check className="h-3.5 w-3.5" />
                  Perubahan berhasil disimpan!
                </span>
              )}
            </span>
            <Button type="submit" variant="glow" size="sm" className="text-white px-5">
              Simpan Pengaturan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
