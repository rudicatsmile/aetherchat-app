"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Globe, Moon, Sun, Check, Loader2, UploadCloud, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfileAction, updateUserProfileAction } from "@/actions/settings";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState("id-ID");
  const [theme, setTheme] = useState("dark");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const profile = await getUserProfileAction();
        setFullName(profile.fullName || "");
        setEmail(profile.email || "");
        setLocale(profile.locale || "id-ID");
        setTheme(profile.theme || "dark");
        setAvatarUrl(profile.avatarUrl || "");
      } catch (err: unknown) {
        console.error("Gagal memuat profil:", err);
        setError("Gagal memuat data profil.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, GIF, WebP)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran foto maksimal 2MB");
      return;
    }

    try {
      setUploadingAvatar(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", "avatars");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mengunggah foto profil");
      }

      const newUrl = data.file.url;
      setAvatarUrl(newUrl);

      // Automatically persist to Supabase profile
      await updateUserProfileAction({
        fullName,
        locale,
        theme,
        avatarUrl: newUrl,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah foto profil";
      setError(msg);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const res = await updateUserProfileAction({
        fullName,
        locale,
        theme,
        avatarUrl,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan pengaturan";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AC";

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-xs text-muted-foreground">Memuat profil pengguna...</span>
      </div>
    );
  }

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

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-xl animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              <Avatar className="h-16 w-16 border-2 border-border/80 shadow-md">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingAvatar}
                  className="text-xs flex items-center gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-3.5 w-3.5" />
                      Ubah Foto Profil
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Mendukung JPG, PNG, GIF atau WebP maksimal 2MB. Disimpan langsung di Supabase Storage.
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
                placeholder="Masukkan nama lengkap Anda"
                className="max-w-md text-xs"
              />
            </div>

            {/* Email (Readonly) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Alamat Email
              </label>
              <Input
                value={email || "Tidak ada email"}
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
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={saving}
              className="text-white px-5 flex items-center gap-1.5"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
