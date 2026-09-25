"use client";

import React, { useState } from "react";
import { Sliders, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

export default function ParametersSettingsPage() {
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleReset = () => {
    setTemperature(0.7);
    setTopP(1.0);
    setMaxTokens(2048);
    setPresencePenalty(0);
    setFrequencyPenalty(0);
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
          Parameter Model AI
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Kustomisasi tingkat kreativitas, panjang respon, dan keberagaman kosakata yang dihasilkan oleh model bahasa.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="bg-card/70 border-border/80 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sliders className="h-4 w-4 text-primary" />
              Pengaturan Inferensi LLM
            </CardTitle>
            <CardDescription className="text-xs">
              Nilai default telah dioptimasi untuk keseimbangan akurasi logika dan keluwesan berbahasa.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground">Temperature</span>
                  <p className="text-[11px] text-muted-foreground">
                    Nilai rendah = jawaban fokus & deterministik. Nilai tinggi = lebih kreatif & variatif.
                  </p>
                </div>
                <span className="font-mono font-bold text-primary text-sm bg-secondary px-2 py-0.5 rounded-md">
                  {temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                min={0}
                max={2}
                step={0.05}
                value={[temperature]}
                onValueChange={(val) => setTemperature(val[0])}
              />
            </div>

            {/* Top P */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground">Top-P (Nucleus Sampling)</span>
                  <p className="text-[11px] text-muted-foreground">
                    Memilih dari probabilitas kumulatif token kata teratas.
                  </p>
                </div>
                <span className="font-mono font-bold text-primary text-sm bg-secondary px-2 py-0.5 rounded-md">
                  {topP.toFixed(2)}
                </span>
              </div>
              <Slider
                min={0.05}
                max={1}
                step={0.05}
                value={[topP]}
                onValueChange={(val) => setTopP(val[0])}
              />
            </div>

            {/* Max Output Tokens */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground">Max Completion Tokens</span>
                  <p className="text-[11px] text-muted-foreground">
                    Batas maksimum panjang token per respons (1 token ≈ 4 karakter).
                  </p>
                </div>
                <span className="font-mono font-bold text-primary text-sm bg-secondary px-2 py-0.5 rounded-md">
                  {maxTokens}
                </span>
              </div>
              <Slider
                min={256}
                max={8192}
                step={256}
                value={[maxTokens]}
                onValueChange={(val) => setMaxTokens(val[0])}
              />
            </div>

            {/* Frequency & Presence Penalties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Presence Penalty</span>
                  <span className="font-mono text-primary text-xs bg-secondary px-1.5 py-0.5 rounded">
                    {presencePenalty.toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[presencePenalty]}
                  onValueChange={(val) => setPresencePenalty(val[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Frequency Penalty</span>
                  <span className="font-mono text-primary text-xs bg-secondary px-1.5 py-0.5 rounded">
                    {frequencyPenalty.toFixed(1)}
                  </span>
                </div>
                <Slider
                  min={-2}
                  max={2}
                  step={0.1}
                  value={[frequencyPenalty]}
                  onValueChange={(val) => setFrequencyPenalty(val[0])}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/40 pt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-xs text-muted-foreground"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Kembalikan ke Default
            </Button>

            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Parameter tersimpan!
                </span>
              )}
              <Button type="submit" variant="glow" size="sm" className="text-white">
                Simpan Perubahan
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
