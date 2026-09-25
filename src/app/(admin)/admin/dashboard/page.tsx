"use client";

import React from "react";
import {
  Users,
  MessageSquare,
  Cpu,
  Activity,
  ShieldCheck,
  TrendingUp,
  Server,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MOCK_ADMIN_STATS, MOCK_ADMIN_LOGS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Eksekutif Administrator
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pantau metrik kesehatan sistem, volume pesan AI, dan penggunaan kuota global.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1 py-1 px-2.5 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Sistem Beroperasi Optimal
          </Badge>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Total Pengguna</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {MOCK_ADMIN_STATS.totalUsers.toLocaleString("id-ID")}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>+14.2% dari bulan lalu</span>
          </div>
        </Card>

        {/* Active Today */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Pengguna Aktif Hari Ini</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {MOCK_ADMIN_STATS.activeUsersToday.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Tingkat retensi harian 21.8%
          </div>
        </Card>

        {/* Total Messages */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Total Pesan Diproses</span>
            <MessageSquare className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {MOCK_ADMIN_STATS.totalMessages.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Rata-rata 42 pesan/user
          </div>
        </Card>

        {/* Total Tokens */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Token Dihasilkan</span>
            <Cpu className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {MOCK_ADMIN_STATS.totalTokensUsed}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Cache hit ratio {MOCK_ADMIN_STATS.cacheHitRatio}
          </div>
        </Card>
      </div>

      {/* Middle Section: Providers Health & Recent System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider Status */}
        <Card className="bg-card/70 border-border/80 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            Status Provider AI
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">Groq (Llama 3.3)</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: 420ms</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">OpenAI (GPT-4o)</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: 1.1s</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">OpenRouter API</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: 890ms</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">Tavily Web Search</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: 1.4s</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>
          </div>
        </Card>

        {/* Live System Activity Log Overview */}
        <Card className="lg:col-span-2 bg-card/70 border-border/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Aktivitas Audit Log Terkini
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Realtime feed</span>
          </div>

          <div className="space-y-2.5">
            {MOCK_ADMIN_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {log.type}
                    </Badge>
                    <span className="font-semibold text-foreground">{log.user}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{log.detail}</p>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
