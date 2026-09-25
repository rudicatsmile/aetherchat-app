"use client";

import React, { useState, useEffect } from "react";
import { Flame, Clock, MessageSquare, ImageIcon, Globe, Zap, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserUsageAction } from "@/actions/settings";

export default function UsageSettingsPage() {
  const [usage, setUsage] = useState({
    messagesUsed: 0,
    messagesLimit: 50,
    imageGenUsed: 0,
    imageGenLimit: 5,
    webSearchUsed: 0,
    webSearchLimit: 20,
    resetHoursRemaining: 12,
    weeklyStats: [
      { day: "Min", messages: 0 },
      { day: "Sen", messages: 0 },
      { day: "Sel", messages: 0 },
      { day: "Rab", messages: 0 },
      { day: "Kam", messages: 0 },
      { day: "Jum", messages: 0 },
      { day: "Sab", messages: 0 },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getUserUsageAction();
        setUsage(res);
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const msgPercent = Math.min(100, Math.round((usage.messagesUsed / usage.messagesLimit) * 100));
  const imgPercent = Math.min(100, Math.round((usage.imageGenUsed / usage.imageGenLimit) * 100));
  const searchPercent = Math.min(100, Math.round((usage.webSearchUsed / usage.webSearchLimit) * 100));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Kuota & Penggunaan Harian
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pantau alokasi kuota gratis Anda yang di-refresh otomatis setiap 00:00 WIB.
          </p>
        </div>

        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 font-mono text-xs">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Reset Dalam: ~{usage.resetHoursRemaining} Jam</span>
        </Badge>
      </div>

      {/* 3 Quota Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Messages */}
        <Card className="p-4 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-primary" />
              Pesan Chat
            </span>
            <span className="text-xs font-bold font-mono text-foreground">
              {usage.messagesUsed} / {usage.messagesLimit}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${msgPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tersisa {Math.max(0, usage.messagesLimit - usage.messagesUsed)} pesan gratis hari ini.
          </p>
        </Card>

        {/* Image Generation */}
        <Card className="p-4 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-cyan-400" />
              Image AI (DALL-E)
            </span>
            <span className="text-xs font-bold font-mono text-foreground">
              {usage.imageGenUsed} / {usage.imageGenLimit}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${imgPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tersisa {Math.max(0, usage.imageGenLimit - usage.imageGenUsed)} gambar gratis hari ini.
          </p>
        </Card>

        {/* Web Search */}
        <Card className="p-4 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-emerald-400" />
              Web Search Realtime
            </span>
            <span className="text-xs font-bold font-mono text-foreground">
              {usage.webSearchUsed} / {usage.webSearchLimit}
            </span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${searchPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Tersisa {Math.max(0, usage.webSearchLimit - usage.webSearchUsed)} pencarian gratis hari ini.
          </p>
        </Card>
      </div>

      {/* 7-Day Usage Activity Bar Chart */}
      <Card className="bg-card/70 border-border/80 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Aktivitas Percakapan 7 Hari Terakhir
          </CardTitle>
          <CardDescription className="text-xs">
            Grafik riwayat interaksi harian Anda di platform AetherChat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-3 h-40 pt-4 px-2">
            {usage.weeklyStats.map((item, i) => {
              const heightPercent = Math.min(100, Math.max(10, (item.messages / 50) * 100));
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.messages}
                  </span>
                  <div className="w-full bg-secondary rounded-lg h-28 flex items-end p-1">
                    <div
                      className="w-full bg-primary/80 group-hover:bg-primary rounded-md transition-all duration-300"
                      style={{ height: `${item.messages > 0 ? heightPercent : 4}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* BYOK Info Banner */}
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-xs text-muted-foreground flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Ingin obrolan tanpa batas pesan harian? Masukkan API Key pribadi Anda di menu{" "}
          <strong className="text-foreground">API Key Pribadi (BYOK)</strong> untuk melewati semua batas kuota gratis server.
        </p>
      </div>
    </div>
  );
}
