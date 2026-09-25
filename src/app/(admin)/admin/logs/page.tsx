"use client";

import React, { useState } from "react";
import { FileText, Search, AlertCircle, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { MOCK_ADMIN_LOGS } from "@/lib/mock-data";

export default function AdminLogsPage() {
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLogs = MOCK_ADMIN_LOGS.filter((log) => {
    const matchType = filterType === "all" || log.type.includes(filterType.toUpperCase());
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Audit Trail & Log Sistem
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Rekaman peristiwa keamanan sistem, pemicu rate limit, eksekusi pg_cron, dan deteksi anomali.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter keterangan atau user..."
            className="pl-9 h-10 text-xs bg-card/60 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("all")}
            className="text-xs rounded-xl"
          >
            Semua
          </Button>
          <Button
            variant={filterType === "rate_limit" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("rate_limit")}
            className="text-xs rounded-xl"
          >
            Rate Limit
          </Button>
          <Button
            variant={filterType === "auth" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("auth")}
            className="text-xs rounded-xl"
          >
            Autentikasi
          </Button>
          <Button
            variant={filterType === "cron" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType("cron")}
            className="text-xs rounded-xl"
          >
            Cron
          </Button>
        </div>
      </div>

      {/* Logs Table */}
      <Card className="bg-card/70 border-border/80 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Waktu (WIB)</TableHead>
              <TableHead className="text-xs">Tipe Event</TableHead>
              <TableHead className="text-xs">Pengguna / Aktor</TableHead>
              <TableHead className="text-xs">Detail Peristiwa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">
                  Tidak ada rekaman log yang cocok.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => {
                const isWarning = log.type.includes("WARNING");
                return (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isWarning ? "destructive" : "outline"}
                        className="text-[10px] font-mono"
                      >
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground whitespace-nowrap">
                      {log.user}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground leading-relaxed">
                      {log.detail}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
