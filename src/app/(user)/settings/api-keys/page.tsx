"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, ShieldCheck, Plus, Trash2, Check, Lock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  getUserApiKeysAction,
  saveUserApiKeyAction,
  deleteUserApiKeyAction,
} from "@/actions/api-keys";
import { updateUserSettingsAction } from "@/actions/settings";

interface StoredApiKey {
  id: string;
  provider: "groq" | "openai" | "openrouter";
  keyHint: string;
  isActive: boolean;
  createdAt: string;
}

export default function ApiKeysSettingsPage() {
  const [useByok, setUseByok] = useState(true);
  const [keys, setKeys] = useState<StoredApiKey[]>([]);
  const [newProvider, setNewProvider] = useState<"groq" | "openai" | "openrouter">("groq");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadKeys() {
      const serverKeys = await getUserApiKeysAction();
      const localKeys: StoredApiKey[] = [];

      (["groq", "openai", "openrouter"] as const).forEach((prov) => {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(`aether_byok_${prov}`);
          if (stored && stored.trim()) {
            const trimmed = stored.trim();
            const prefix = trimmed.slice(0, 4);
            const suffix = trimmed.slice(-4);
            localKeys.push({
              id: `local-${prov}`,
              provider: prov,
              keyHint: `${prefix}••••••••${suffix}`,
              isActive: true,
              createdAt: "Tersimpan di browser",
            });
          }
        }
      });

      const mergedMap = new Map<string, StoredApiKey>();
      // Prefer server keys if available
      (serverKeys || []).forEach((k: any) => mergedMap.set(k.provider, k as StoredApiKey));
      // Fallback to local keys for guest / unauthenticated
      localKeys.forEach((lk: StoredApiKey) => {
        if (!mergedMap.has(lk.provider)) {
          mergedMap.set(lk.provider, lk);
        }
      });

      setKeys(Array.from(mergedMap.values()));
    }
    loadKeys();
  }, []);

  const handleToggleByok = async (checked: boolean) => {
    setUseByok(checked);
    if (typeof window !== "undefined") {
      localStorage.setItem("aether_byok_enabled", checked ? "true" : "false");
    }
    await updateUserSettingsAction({ useByok: checked }).catch(() => {});
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = newKeyValue.trim();
    if (!cleanKey) return;

    setIsLoading(true);

    // 1. Immediately persist to localStorage for instant client-side BYOK support
    if (typeof window !== "undefined") {
      localStorage.setItem(`aether_byok_${newProvider}`, cleanKey);
      localStorage.setItem("aether_byok_enabled", "true");
    }

    // 2. Persist to Supabase if user is logged in
    const res = await saveUserApiKeyAction({
      provider: newProvider,
      apiKey: cleanKey,
    });
    setIsLoading(false);

    const prefix = cleanKey.slice(0, 4);
    const suffix = cleanKey.slice(-4);
    const keyHint = res?.keyHint || `${prefix}••••••••${suffix}`;

    setKeys((prev) => [
      {
        id: res?.keyId || `key-${Date.now()}`,
        provider: newProvider,
        keyHint,
        isActive: true,
        createdAt: "Baru saja",
      },
      ...prev.filter((k) => k.provider !== newProvider),
    ]);

    setNewKeyValue("");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteKey = async (id: string, provider: "groq" | "openai" | "openrouter") => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`aether_byok_${provider}`);
    }
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (!id.startsWith("local-")) {
      await deleteUserApiKeyAction(id).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          API Key Pribadi (Bring Your Own Key)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gunakan API Key Anda sendiri dari Groq, OpenAI, atau OpenRouter untuk obrolan model AI tanpa batas kuota server.
        </p>
      </div>

      {/* BYOK Toggle Card */}
      <Card className="bg-card/70 border-border/80 rounded-2xl">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-sm text-foreground">
              Gunakan API Key Pribadi Saya
            </h3>
            <p className="text-xs text-muted-foreground">
              Jika aktif, permintaan obrolan di halaman Chat akan menggunakan key terdaftar Anda dan melewati limit kuota gratis server.
            </p>
          </div>
          <Switch checked={useByok} onCheckedChange={handleToggleByok} />
        </CardContent>
      </Card>

      {/* Security Guarantee Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-400">
            Enkripsi Standar Keamanan AES-256-GCM
          </p>
          <p className="leading-relaxed">
            API key yang Anda simpan langsung dienkripsi pada layer server Supabase. Kunci juga disinkronkan ke sesi browser lokal Anda agar obrolan di <strong>/chat</strong> dapat langsung beroperasi seketika.
          </p>
        </div>
      </div>

      {/* Existing Keys List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Kunci Terdaftar ({keys.length})
        </h3>
        {keys.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
            Belum ada API key pribadi yang disimpan. Tambahkan kunci di bawah untuk mulai chat.
          </div>
        ) : (
          keys.map((k) => (
            <Card
              key={k.id}
              className="p-4 bg-card/60 border-border/70 rounded-xl flex items-center justify-between shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-foreground uppercase">{k.provider} Key</span>
                  <Badge variant="outline" className="text-[10px] font-mono uppercase">
                    {k.provider}
                  </Badge>
                  <span className="text-[10px] text-emerald-400 font-medium">● Siap Digunakan</span>
                </div>
                <p className="text-xs font-mono text-muted-foreground">{k.keyHint}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {k.createdAt}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDeleteKey(k.id, k.provider)}
                  className="text-muted-foreground hover:text-destructive"
                  title="Hapus Kunci"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Form Add New Key */}
      <Card className="bg-card/70 border-border/80 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Tambahkan API Key Baru
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih provider dan tempelkan kunci API yang Anda dapatkan dari dashboard resmi penyedia model AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddKey} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Penyedia AI (Provider)
              </label>
              <div className="flex gap-2">
                {(["groq", "openai", "openrouter"] as const).map((prov) => (
                  <Button
                    key={prov}
                    type="button"
                    variant={newProvider === prov ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewProvider(prov)}
                    className="capitalize text-xs rounded-xl"
                  >
                    {prov === "groq" ? "Groq (Rekomendasi Cepat)" : prov}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nilai API Key
              </label>
              <Input
                type="password"
                required
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                placeholder={
                  newProvider === "groq"
                    ? "gsk_••••••••••••••••"
                    : newProvider === "openai"
                    ? "sk-proj-••••••••••••"
                    : "sk-or-••••••••••••••"
                }
                className="text-xs font-mono"
              />
              <p className="text-[11px] text-muted-foreground">
                {newProvider === "groq" && (
                  <span>
                    Dapatkan kunci gratis di:{" "}
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      console.groq.com/keys
                    </a>
                  </span>
                )}
                {newProvider === "openai" && (
                  <span>
                    Dapatkan kunci di:{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      platform.openai.com/api-keys
                    </a>
                  </span>
                )}
                {newProvider === "openrouter" && (
                  <span>
                    Dapatkan kunci di:{" "}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      openrouter.ai/keys
                    </a>
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {savedSuccess && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                    <Check className="h-3.5 w-3.5" />
                    Kunci berhasil disimpan dan langsung aktif untuk chat!
                  </span>
                )}
              </span>
              <Button type="submit" variant="glow" size="sm" disabled={isLoading} className="text-white">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Enkripsi & Simpan Kunci"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
