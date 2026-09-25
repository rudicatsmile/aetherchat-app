import React from "react";
import { ShieldCheck, Lock, EyeOff, Server } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs text-emerald-400 font-medium mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Privasi & Keamanan Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Kebijakan Privasi AetherChat
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Terakhir diperbarui: 25 September 2026
        </p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            1. Perlindungan API Key Pribadi (BYOK)
          </h2>
          <p>
            Jika Anda memanfaatkan fitur Bring-Your-Own-Key (BYOK), API key pribadi Anda (OpenAI, Groq, OpenRouter) dienkripsi menggunakan algoritma standar industri <strong>AES-256-GCM</strong>. Kunci enkripsi disimpan secara terisolasi pada environment server dan kunci API Anda tidak pernah disimpan dalam format teks biasa (plain text), serta tidak pernah terekspos ke sisi peramban (client).
          </p>
        </Card>

        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            2. Penyimpanan Pesan & Row Level Security (RLS)
          </h2>
          <p>
            Semua riwayat percakapan dan metadata pesan disimpan di basis data PostgreSQL Supabase yang dilindungi oleh kebijakan <strong>Row Level Security (RLS)</strong>. Ini menjamin secara matematis bahwa hanya akun terautentikasi Anda yang memiliki hak akses untuk membaca, mengedit, atau menghapus riwayat obrolan Anda.
          </p>
        </Card>

        <Card className="p-6 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-amber-400" />
            3. Penggunaan Data untuk Pelatihan AI
          </h2>
          <p>
            AetherChat <strong>TIDAK PERNAH</strong> menjual atau memanfaatkan isi percakapan Anda untuk melatih model kecerdasan buatan pihak ketiga. Semua interaksi langsung diteruskan ke API provider resmi sesuai pilihan model Anda.
          </p>
        </Card>

        <div className="rounded-2xl border border-border/50 bg-secondary/30 p-6 text-xs text-muted-foreground space-y-3">
          <h3 className="font-semibold text-foreground text-sm">
            4. Hak Pengguna & Penghapusan Akun
          </h3>
          <p>
            Anda memiliki hak penuh untuk mengekspor seluruh riwayat obrolan Anda kapan saja melalui menu <em>Pengaturan &gt; Data &amp; Ekspor</em> atau mengajukan penghapusan akun permanen yang akan membersihkan seluruh basis data terkait dalam waktu 48 jam.
          </p>
        </div>
      </div>
    </div>
  );
}
