"use client";

import React, { useState } from "react";
import { SlidersHorizontal, Check, Server, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { saveAdminGlobalConfigAction } from "@/actions/admin";

export default function AdminProvidersPage() {
  const [defaultProvider, setDefaultProvider] = useState("groq");
  const [defaultModel, setDefaultModel] = useState("llama-3.3-70b-versatile");
  const [dailyMessages, setDailyMessages] = useState("50");
  const [dailyImageGen, setDailyImageGen] = useState("5");
  const [dailyWebSearch, setDailyWebSearch] = useState("20");
  const [rateLimitReqPerMin, setRateLimitReqPerMin] = useState("500");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const res = await saveAdminGlobalConfigAction({
        defaultProvider,
        defaultModel,
        dailyMessages: parseInt(dailyMessages, 10) || 50,
        dailyImageGen: parseInt(dailyImageGen, 10) || 5,
        dailyWebSearch: parseInt(dailyWebSearch, 10) || 20,
        rateLimitReqPerMin: parseInt(rateLimitReqPerMin, 10) || 500,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan konfigurasi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-6 w-6 text-primary" />
          Konfigurasi Provider & Kuota Global
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Atur penyedia AI bawaan, model gratis default, dan batasan kuota harian untuk seluruh pengguna.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs text-rose-400 bg-rose-950/30 border border-rose-800/50 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card className="bg-card/70 border-border/80 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Penyedia & Model Bawaan Sistem
            </CardTitle>
            <CardDescription className="text-xs">
              Konfigurasi ini akan menjadi fallback default bagi setiap pengguna baru.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Free Provider
                </label>
                <select
                  value={defaultProvider}
                  onChange={(e) => setDefaultProvider(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border/70 bg-card px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="groq">Groq Cloud (Rekomendasi - Super Cepat)</option>
                  <option value="openai">OpenAI (GPT-4o Mini)</option>
                  <option value="openrouter">OpenRouter (Mistral / DeepSeek)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Default Model ID
                </label>
                <Input
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="border-t border-border/40 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Batasan Kuota Harian Pengguna Gratis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Pesan Chat / Hari
                  </label>
                  <Input
                    type="number"
                    value={dailyMessages}
                    onChange={(e) => setDailyMessages(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Generate Gambar / Hari
                  </label>
                  <Input
                    type="number"
                    value={dailyImageGen}
                    onChange={(e) => setDailyImageGen(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Web Search / Hari
                  </label>
                  <Input
                    type="number"
                    value={dailyWebSearch}
                    onChange={(e) => setDailyWebSearch(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border/40 pt-4">
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  Abuse Detection Rate Limit (Req/Menit)
                </label>
                <Input
                  type="number"
                  value={rateLimitReqPerMin}
                  onChange={(e) => setRateLimitReqPerMin(e.target.value)}
                  className="text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Akun yang melampaui batas ini akan otomatis masuk masa karantina (quarantine).
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {saved && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold animate-in fade-in">
                  <Check className="h-4 w-4" />
                  Konfigurasi berhasil dicatat ke sistem audit!
                </span>
              )}
            </span>
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={saving}
              className="text-white flex items-center gap-1.5"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {saving ? "Menyimpan..." : "Terapkan Konfigurasi Global"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
