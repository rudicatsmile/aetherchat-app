import React from "react";
import Link from "next/link";
import { Sparkles, Heart, Rocket, Shield, Terminal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs text-primary font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Tentang AetherChat</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Menghadirkan Kebebasan Berpikir dengan AI
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          AetherChat lahir dari kebutuhan akan antarmuka AI yang cepat, bersih, menghargai privasi, dan memberikan kendali penuh kepada penggunanya.
        </p>
      </div>

      {/* Story Content */}
      <div className="space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
        <Card className="p-6 sm:p-8 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Latar Belakang & Masalah
          </h2>
          <p className="mb-3">
            Di era saat ini, pengguna dihadapkan pada fragmentasi model kecerdasan buatan. Sebagian orang menyukai kecepatan Groq untuk brainstorming cepat, namun membutuhkan penalaran mendalam OpenAI GPT-4o untuk analisa kode rumit, atau model open-source di OpenRouter.
          </p>
          <p>
            Sayangnya, beralih antar aplikasi menghabiskan waktu, membuat riwayat percakapan tercecer, dan antarmuka bawaan seringkali dipenuhi iklan atau keterbatasan kuota yang kaku. AetherChat memecahkan ini dengan menyatukan seluruh provider global ke dalam satu kanvas ergonomis.
          </p>
        </Card>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <Heart className="h-6 w-6 text-red-400 mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">
              Fokus Pengguna
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Desain minimalis bergaya Grok tanpa distraksi, mengutamakan kenyamanan membaca Markdown dan kode panjang.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <Shield className="h-6 w-6 text-emerald-400 mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">
              Privasi Mutlak (BYOK)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              API key pribadi Anda disimpan dengan enkripsi AES-256-GCM tingkat server dan data percakapan dilindungi PostgreSQL RLS.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <Terminal className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-foreground text-sm mb-1">
              Stack Mutakhir
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dibangun dengan Next.js 15, Vercel AI SDK, Supabase, dan Tailwind CSS untuk menjamin keandalan kelas industri.
            </p>
          </div>
        </div>

        <Card className="p-6 sm:p-8 bg-card/60 border-border/70 rounded-2xl">
          <h2 className="text-xl font-bold text-foreground mb-3">
            Misi Kami
          </h2>
          <p>
            Misi kami adalah mendemokratisasi akses ke kecerdasan buatan terbaik tanpa biaya berlangganan bulanan yang memberatkan. Melalui kuota harian gratis dan fleksibilitas Bring-Your-Own-Key (BYOK), setiap pelajar, developer, dan profesional di Indonesia dapat berkarya dengan efisiensi maksimal.
          </p>
        </Card>
      </div>

      {/* CTA Box */}
      <div className="mt-12 text-center">
        <Button variant="glow" size="lg" asChild className="rounded-2xl text-white">
          <Link href="/chat">
            <span>Mulai Percakapan Pertama</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
