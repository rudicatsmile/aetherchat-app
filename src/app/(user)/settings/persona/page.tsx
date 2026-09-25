"use client";

import React, { useState } from "react";
import { Sparkles, Check, Wand2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRESET_TEMPLATES = [
  {
    name: "Senior Software Architect",
    role: "Spesialis Coding & Cloud",
    prompt:
      "Kamu adalah Senior Fullstack Software Architect yang berfokus pada performa, arsitektur bersih, dan keamanan Next.js 15, TypeScript, dan sistem terdistribusi. Berikan solusi kode yang ringkas, modern, tanpa boilerplate kuno, dan jelaskan rationale teknis secara to-the-point.",
  },
  {
    name: "Asisten Hukum Indonesia",
    role: "Regulasi & UU RI",
    prompt:
      "Kamu adalah asisten hukum Indonesia yang ramah, objektif, dan selalu menyertakan dasar hukum positif yang berlaku di Republik Indonesia (UU, PP, Perpres, atau KUHPer/KUHP) pada setiap analisa, dengan disclaimer bahwa kamu bukan pengganti pengacara resmi.",
  },
  {
    name: "Growth & Copywriter Startup",
    role: "Marketing & Konversi",
    prompt:
      "Kamu adalah Head of Growth & Direct-Response Copywriter untuk startup teknologi di Asia Tenggara. Gaya bahasamu energik, persuasif, berbasis data, dan ahli menyusun hook, landing page, dan email campaign yang memicu aksi konversi nyata.",
  },
  {
    name: "Tutor Akademik & Peneliti",
    role: "Metodologi & Jurnal",
    prompt:
      "Kamu adalah dosen pembimbing akademik dan peneliti berpengalaman. Bantu saya menstrukturkan metodologi penelitian, menyusun tinjauan pustaka yang kritis, dan mereview logika hipotesis dengan standar sitasi ilmiah internasional.",
  },
];

export default function PersonaSettingsPage() {
  const [systemPrompt, setSystemPrompt] = useState(
    "Kamu adalah AetherChat, asisten AI cerdas dan solutif. Jawab dengan gaya bahasa profesional, ramah, gunakan Markdown rapi, dan berikan contoh konkret bila relevan."
  );
  const [saved, setSaved] = useState(false);

  const handleApplyPreset = (preset: string) => {
    setSystemPrompt(preset);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Persona & System Prompt Kustom
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Definisikan instruksi dasar dan kepribadian AI yang akan disisipkan di setiap percakapan baru Anda.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pilih Preset Siap Pakai
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESET_TEMPLATES.map((tmpl, idx) => (
            <Card
              key={idx}
              onClick={() => handleApplyPreset(tmpl.prompt)}
              className="p-3.5 bg-card/60 border-border/70 hover:border-primary/50 hover:bg-secondary/40 cursor-pointer transition-all rounded-xl group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                  {tmpl.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {tmpl.role}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {tmpl.prompt}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Textarea Form */}
      <form onSubmit={handleSave}>
        <Card className="bg-card/70 border-border/80 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                System Prompt Kustom
              </span>
              <span className="text-xs font-mono font-normal text-muted-foreground">
                {systemPrompt.length} / 2000 karakter
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Instruksi ini akan otomatis digabungkan dengan panduan default AetherChat saat memproses respon AI.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <textarea
              rows={8}
              maxLength={2000}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Contoh: Kamu adalah konsultan keuangan yang berhati-hati..."
              className="w-full resize-y rounded-xl border border-border/70 bg-secondary/30 p-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 leading-relaxed font-sans"
            />
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setSystemPrompt(
                  "Kamu adalah AetherChat, asisten AI cerdas dan solutif. Jawab dengan gaya bahasa profesional, ramah, gunakan Markdown rapi, dan berikan contoh konkret bila relevan."
                )
              }
              className="text-xs text-muted-foreground"
            >
              <RefreshCcw className="h-3.5 w-3.5 mr-1" />
              Reset ke Default
            </Button>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Tersimpan!
                </span>
              )}
              <Button type="submit" variant="glow" size="sm" className="text-white">
                Simpan Persona
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
