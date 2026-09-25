"use client";

import React, { useState } from "react";
import { Download, FileText, Database, FileCode, Trash2, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function DataSettingsPage() {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleExport = (format: string) => {
    window.open(`/api/export?format=${format.toLowerCase()}`, "_blank");
    setDownloadSuccess(`Ekspor format .${format.toLowerCase()} berhasil diunduh!`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirmInput === "HAPUS") {
      alert("Permintaan penghapusan akun telah dicatat. Sesi akan ditutup.");
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Data & Ekspor Arsip Percakapan
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Unduh salinan percakapan Anda untuk arsip lokal atau kelola retensi data akun Anda.
        </p>
      </div>

      {downloadSuccess && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Export Formats Card */}
      <Card className="bg-card/70 border-border/80 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-4 w-4 text-primary" />
            Ekspor Seluruh Percakapan
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih format dokumen arsip yang paling sesuai dengan kebutuhan dokumentasi Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Markdown */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileCode className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground">
                  Markdown (.md)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Format teks murni dengan formatting kode, heading, dan link. Sangat cocok untuk Obsidian atau Notion.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("MD")}
              className="text-xs"
            >
              Unduh .MD
            </Button>
          </div>

          {/* JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground">
                  JSON Terstruktur (.json)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Struktur data mentah lengkap dengan timestamp, token usage, dan metadata model AI.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("JSON")}
              className="text-xs"
            >
              Unduh .JSON
            </Button>
          </div>

          {/* PDF */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-foreground">
                  PDF Berdesain Rapi (.pdf)
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Dokumen visual siap cetak atau dibagikan ke klien dengan gaya elegan dark mode AetherChat.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("PDF")}
              className="text-xs"
            >
              Unduh .PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Delete Account */}
      <Card className="border-destructive/30 bg-destructive/5 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Zona Berbahaya
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Penghapusan akun bersifat permanen dan tidak dapat dibatalkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Menghapus akun Anda akan menghapus seluruh percakapan, folder, API key terenkripsi, dan pengaturan akun dari Supabase secara permanen.
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            className="text-xs font-semibold"
          >
            Hapus Akun Saya
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Konfirmasi Penghapusan Akun
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Ketik kata <strong className="text-foreground">HAPUS</strong> di bawah ini untuk mengonfirmasi bahwa Anda memahami data Anda akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Ketik HAPUS..."
              className="w-full rounded-xl border border-destructive/40 bg-secondary/50 px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={confirmInput !== "HAPUS"}
              onClick={handleDeleteAccount}
            >
              Hapus Akun Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
