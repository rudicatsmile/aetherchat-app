import React from "react";
import { FileCheck, AlertCircle, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary font-medium mb-3">
          <FileCheck className="h-3.5 w-3.5" />
          <span>Ketentuan Layanan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Syarat & Ketentuan Penggunaan
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Berlaku sejak 25 September 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            1. Ketentuan Kuota Gratis & Penyalahgunaan
          </h2>
          <p>
            Pengguna terdaftar berhak menggunakan kuota gratis harian (50 pesan, 5 image generation, 20 web search per hari). Upaya otomatisasi scraping massal, brute force, DDoS, atau pengiriman lebih dari 500 request per menit akan memicu pemblokiran otomatis oleh firewall sistem.
          </p>
        </Card>

        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            2. Larangan Konten Berbahaya
          </h2>
          <p>
            Dilarang keras menggunakan AetherChat untuk menghasilkan instruksi pembuatan senjata, malware berbahaya, aktivitas ilegal, atau ujaran kebencian. Pelanggaran berat akan mengakibatkan penutupan akun permanen.
          </p>
        </Card>

        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2">
            3. Penafian Tanggung Jawab Output AI
          </h2>
          <p>
            Model kecerdasan buatan dapat memproduksi informasi yang keliru, halusinasi, atau kurang akurat. Pengguna bertanggung jawab penuh atas segala tindakan atau keputusan yang diambil berdasarkan jawaban dari AetherChat.
          </p>
        </Card>
      </div>
    </div>
  );
}
