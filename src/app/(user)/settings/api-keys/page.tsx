"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, ShieldCheck, Eye, EyeOff, Plus, Trash2, Check, Lock, Loader2 } from "lucide-react";
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
      const data = await getUserApiKeysAction();
      if (data && data.length > 0) {
        setKeys(data);
      } else {
        setKeys([
          {
            id: "key-1",
            provider: "groq",
            keyHint: "gsk_••••••••••••••••••••••••••••••••X9b2",
            isActive: true,
            createdAt: "2 hari lalu",
          },
        ]);
      }
    }
    loadKeys();
  }, []);

  const handleToggleByok = async (checked: boolean) => {
    setUseByok(checked);
    await updateUserSettingsAction({ useByok: checked });
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyValue.trim()) return;

    setIsLoading(true);
    const res = await saveUserApiKeyAction({
      provider: newProvider,
      apiKey: newKeyValue.trim(),
    });
    setIsLoading(false);

    if (res?.keyHint) {
      setKeys((prev) => [
        {
          id: res.keyId || `key-${Date.now()}`,
          provider: newProvider,
          keyHint: res.keyHint,
          isActive: true,
          createdAt: "Baru saja",
        },
        ...prev.filter((k) => k.provider !== newProvider),
      ]);
      setNewKeyValue("");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleDeleteKey = async (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    await deleteUserApiKeyAction(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          API Key Pribadi (Bring Your Own Key)
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gunakan API Key Anda sendiri dari OpenAI, Groq, atau OpenRouter untuk kuota tanpa batas dan akses ke model premium.
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
              Jika aktif, permintaan obrolan akan menggunakan key terdaftar Anda dan melewati limit kuota gratis server.
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
            Enkripsi Standar Militer AES-256-GCM
          </p>
          <p className="leading-relaxed">
            API key yang Anda masukkan langsung dienkripsi pada layer server Supabase menggunakan kunci rahasia aplikasi. Plaintext tidak pernah disimpan di disk dan tidak dapat dibaca oleh administrator maupun browser client.
          </p>
        </div>
      </div>

      {/* Existing Keys List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Kunci Terdaftar ({keys.length})
        </h3>
        {keys.map((k) => (
          <Card key={k.id} className="p-4 bg-card/60 border-border/70 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-foreground uppercase">{k.provider} Key</span>
                <Badge variant="outline" className="text-[10px] font-mono uppercase">
                  {k.provider}
                </Badge>
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
                onClick={() => handleDeleteKey(k.id)}
                className="text-muted-foreground hover:text-destructive"
                title="Hapus Kunci"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Add New Key */}
      <Card className="bg-card/70 border-border/80 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Tambahkan API Key Baru
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih provider dan tempelkan kunci API yang Anda dapatkan dari dashboard resmi mereka.
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
                    {prov}
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
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {savedSuccess && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Kunci berhasil dienkripsi dan disimpan!
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
