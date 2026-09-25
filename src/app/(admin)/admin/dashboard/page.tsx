"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Cpu,
  Activity,
  ShieldCheck,
  TrendingUp,
  Server,
  Zap,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAdminStatsAction, getAdminLogsAction, AdminStats, AdminLogItem } from "@/actions/admin";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsersToday: 0,
    totalMessages: 0,
    totalTokensUsed: "0",
    cacheHitRatio: "89.2%",
  });
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsData, logsData] = await Promise.all([
          getAdminStatsAction(),
          getAdminLogsAction(),
        ]);
        setStats(statsData);
        setLogs(logsData.slice(0, 4));
      } catch (err) {
        console.error("Gagal memuat data dashboard admin:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Eksekutif Administrator
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Pantau metrik kesehatan sistem, volume pesan AI, dan penggunaan kuota global dari database Supabase.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <Badge variant="outline" className="gap-1 py-1 px-2.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              Menyinkronkan...
            </Badge>
          ) : (
            <Badge variant="success" className="gap-1 py-1 px-2.5 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Sistem Beroperasi Optimal
            </Badge>
          )}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Total Pengguna Terdaftar</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {stats.totalUsers.toLocaleString("id-ID")}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
            <TrendingUp className="h-3 w-3" />
            <span>Terverifikasi di Supabase Auth</span>
          </div>
        </Card>

        {/* Active Today */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Pengguna Aktif Hari Ini</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {stats.activeUsersToday.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Berdasarkan log kuota aktif
          </div>
        </Card>

        {/* Total Messages */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Total Pesan Diproses</span>
            <MessageSquare className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {stats.totalMessages.toLocaleString("id-ID")}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Tersimpan di tabel messages
          </div>
        </Card>

        {/* Total Tokens */}
        <Card className="p-5 bg-card/70 border-border/80 rounded-2xl">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs font-medium">Token Dihasilkan</span>
            <Cpu className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {stats.totalTokensUsed}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Estimasi efisiensi cache {stats.cacheHitRatio}
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
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: &lt;500ms</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">OpenAI (GPT-4o Mini)</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: ~1.1s</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">OpenRouter API</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: ~890ms</p>
              </div>
              <Badge variant="success" className="text-[10px]">Normal</Badge>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40">
              <div>
                <p className="font-semibold text-foreground">Tavily Web Search</p>
                <p className="text-[11px] text-muted-foreground">Latensi rata-rata: ~1.2s</p>
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
            <span className="text-xs text-muted-foreground font-mono">Tabel admin_logs</span>
          </div>

          <div className="space-y-2.5">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Belum ada aktivitas audit log yang tercatat.
              </div>
            ) : (
              logs.map((log) => (
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
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
