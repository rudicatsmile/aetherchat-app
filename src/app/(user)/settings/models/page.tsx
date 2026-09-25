"use client";

import React, { useState } from "react";
import { Cpu, Zap, Sparkles, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AVAILABLE_MODELS = [
  {
    id: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B Versatile",
    provider: "groq",
    providerLabel: "Groq",
    contextWindow: "128K",
    speed: "Ultra Cepat (280 token/detik)",
    description: "Model open-source terkuat dari Meta yang diakselerasi LPU Groq. Sangat hemat kuota dan responsif untuk tugas sehari-hari.",
    isFreeTier: true,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    providerLabel: "OpenAI",
    contextWindow: "128K",
    speed: "Cepat (120 token/detik)",
    description: "Model ringan dan cerdas dari OpenAI dengan keahlian penalaran matematis dan pemahaman teks yang presisi.",
    isFreeTier: true,
  },
  {
    id: "mistral-large-2407",
    name: "Mistral Large 2",
    provider: "openrouter",
    providerLabel: "OpenRouter",
    contextWindow: "128K",
    speed: "Sedang (85 token/detik)",
    description: "Model flagship dari Mistral AI dengan keunggulan penalaran logika, coding multibahasa, dan multilingual Eropa & Asia.",
    isFreeTier: true,
  },
  {
    id: "gpt-4o",
    name: "GPT-4o (Omni)",
    provider: "openai",
    providerLabel: "OpenAI",
    contextWindow: "128K",
    speed: "Cepat (90 token/detik)",
    description: "Model tercanggih OpenAI untuk coding tingkat lanjut dan analisis instruksi kompleks. Membutuhkan API Key pribadi.",
    isFreeTier: false,
  },
];

export default function ModelsSettingsPage() {
  const [selectedModel, setSelectedModel] = useState("llama-3.3-70b-versatile");
  const [saved, setSaved] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedModel(id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Model AI Default
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pilih model kecerdasan buatan utama yang akan otomatis digunakan setiap membuka percakapan baru.
          </p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
            <Check className="h-4 w-4" />
            Model default diperbarui!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {AVAILABLE_MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <Card
              key={model.id}
              onClick={() => handleSelect(model.id)}
              className={`cursor-pointer transition-all duration-200 rounded-2xl p-5 border ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
                  : "border-border/70 bg-card/60 hover:bg-secondary/40 hover:border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-foreground">
                      {model.name}
                    </h3>
                    <Badge variant="outline" className="text-[10px] font-mono">
                      {model.providerLabel}
                    </Badge>
                    {model.isFreeTier ? (
                      <Badge variant="success" className="text-[10px]">
                        Tersedia di Kuota Gratis
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px] text-amber-400 border-amber-500/30">
                        Perlu BYOK
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {model.description}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono pt-1">
                    <span className="flex items-center gap-1 text-primary">
                      <Zap className="h-3 w-3" />
                      {model.speed}
                    </span>
                    <span>Konteks: {model.contextWindow}</span>
                  </div>
                </div>

                <div className="shrink-0 mt-1">
                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-border/80 bg-secondary"
                    }`}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="rounded-xl bg-secondary/30 border border-border/50 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p>
          Anda tetap dapat mengganti model secara dinamis kapan saja di toolbar bawah kotak pesan obrolan saat percakapan sedang berlangsung.
        </p>
      </div>
    </div>
  );
}
