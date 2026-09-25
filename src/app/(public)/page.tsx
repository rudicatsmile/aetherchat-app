"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  FolderTree,
  Globe2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  Send,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  // Interactive mini demo state
  const [demoInput, setDemoInput] = useState("");
  const [demoMessages, setDemoMessages] = useState([
    {
      role: "assistant",
      text: "Halo! Saya AetherChat. Coba tanyakan strategi bisnis, ide coding, atau minta saya menganalisis tren AI global.",
    },
  ]);
  const [isDemoStreaming, setIsDemoStreaming] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleDemoSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim() || isDemoStreaming) return;

    const userText = demoInput.trim();
    setDemoMessages((prev) => [...prev, { role: "user", text: userText }]);
    setDemoInput("");
    setIsDemoStreaming(true);

    setTimeout(() => {
      setDemoMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Pertanyaan yang luar biasa tentang "${userText}"! Di AetherChat, Anda menikmati streaming model AI tercepat (Groq Llama 3.3 & OpenAI) dengan rendering Markdown rapi, enkripsi privasi, dan tanpa hambatan kuota berbayar!`,
        },
      ]);
      setIsDemoStreaming(false);
    }, 600);
  };

  const FAQS = [
    {
      q: "Apakah AetherChat benar-benar gratis digunakan?",
      a: "Ya! Setiap akun terdaftar mendapatkan kuota gratis 50 pesan/hari, 5 image generation, dan 20 web search realtime. Jika ingin kuota tak terbatas, Anda cukup memasukkan API Key pribadi (BYOK) milik Anda sendiri tanpa biaya langganan tambahan.",
    },
    {
      q: "Model AI apa saja yang didukung oleh AetherChat?",
      a: "AetherChat mengintegrasikan provider AI terkemuka seperti Groq (Llama 3.3 70B ultra-cepat), OpenAI (GPT-4o & GPT-4o-mini), dan OpenRouter (Mistral, Claude, DeepSeek). Anda dapat berpindah model dalam satu klik.",
    },
    {
      q: "Apakah data dan API Key pribadi saya aman?",
      a: "Sangat aman. API Key pribadi Anda dienkripsi menggunakan standar militer AES-256-GCM di database Supabase dan tidak pernah dikirim ke browser client. Database kami dilindungi Row Level Security (RLS) ketat.",
    },
    {
      q: "Dapatkah saya mengekspor riwayat percakapan saya?",
      a: "Tentu saja. Anda dapat mengekspor satu percakapan atau seluruh arsip folder Anda ke dalam format Markdown (.md), PDF berdesain rapi, atau file JSON terstruktur.",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* SEO Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "AetherChat",
            operatingSystem: "Web Browser",
            applicationCategory: "CommunicationApplication, DeveloperApplication",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "IDR",
            },
            description:
              "Chatbot AI modern berbasis web bergaya Grok dengan streaming multi-model, manajemen percakapan folder, web search, dan keamanan BYOK terenkripsi.",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "1280",
              bestRating: "5",
              worstRating: "1",
            },
            featureList: [
              "Streaming AI super cepat bertenaga Groq Llama 3.3 dan OpenAI GPT-4o",
              "Pencarian web realtime bertenaga Tavily",
              "Generate gambar berkualitas tinggi",
              "Unggah dan analisis dokumen PDF, TXT, DOCX",
              "Input suara Web Speech API Bahasa Indonesia",
              "Enkripsi API key AES-256-GCM tingkat perbankan",
              "Ekspor riwayat percakapan ke Markdown, JSON, PDF/HTML, dan ZIP",
            ],
          }),
        }}
      />

      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/30 via-violet-600/20 to-cyan-500/20 blur-3xl opacity-70" />
      <div className="pointer-events-none absolute top-[900px] -left-60 -z-10 h-[450px] w-[500px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-[1400px] -right-60 -z-10 h-[450px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <Badge
          variant="violet"
          className="mb-6 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-primary/30 bg-primary/10 text-primary backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AetherChat Generasi Baru • Bergaya Grok & Minimalis
        </Badge>

        <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Chat dengan AI Terbaik,{" "}
          <span className="text-gradient">Gratis Selamanya.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          Ruang percakapan terpadu dengan kecepatan streaming instan, integrasi multi-provider (Groq, OpenAI, OpenRouter), privasi terenkripsi, dan antarmuka minimalis modern tanpa iklan.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="glow"
            size="lg"
            asChild
            className="w-full sm:w-auto h-12 px-8 text-base text-white font-semibold rounded-2xl"
          >
            <Link href="/register">
              <span>Mulai Chat Gratis</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>

          <Button
            variant="secondary"
            size="lg"
            asChild
            className="w-full sm:w-auto h-12 px-6 text-sm font-medium rounded-2xl border border-border/70 hover:bg-secondary/80"
          >
            <Link href="/chat">
              <span>Buka Chat Workspace</span>
            </Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/80">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            50 Pesan Harian Gratis
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Enkripsi BYOK AES-256
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Tanpa Kartu Kredit
          </span>
        </div>
      </section>

      {/* Interactive Mini Demo Section */}
      <section id="demo" className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="relative rounded-3xl border border-border/80 bg-card/80 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          {/* Mock Window Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-muted-foreground/80">
                demo-preview.aetherchat
              </span>
            </div>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] text-primary font-medium">
              Mode Interaktif
            </span>
          </div>

          {/* Messages Preview */}
          <div className="min-h-[220px] max-h-[320px] overflow-y-auto space-y-3 pr-2 text-sm">
            {demoMessages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[80%] leading-relaxed text-xs sm:text-sm",
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-secondary/70 text-foreground border border-border/40"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isDemoStreaming && (
              <div className="flex items-center gap-2 text-xs text-primary animate-pulse pl-9">
                <span>AetherChat sedang mengetik...</span>
              </div>
            )}
          </div>

          {/* Demo Input Form */}
          <form onSubmit={handleDemoSend} className="mt-4 flex items-center gap-2 pt-2 border-t border-border/40">
            <input
              type="text"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              placeholder="Ketik pertanyaan untuk uji coba langsung..."
              className="flex-1 rounded-xl bg-secondary/50 px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 border border-border/60 focus:outline-none focus:border-primary"
            />
            <Button
              type="submit"
              variant="glow"
              size="sm"
              disabled={!demoInput.trim() || isDemoStreaming}
              className="rounded-xl px-4 text-white"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline ml-1 text-xs">Kirim</span>
            </Button>
          </form>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="fitur" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Kapabilitas Lengkap
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Didesain untuk Kecepatan & Pengalaman Tanpa Batas
          </h3>
          <p className="mt-3 max-w-2xl mx-auto text-sm text-muted-foreground leading-relaxed">
            Semua yang Anda butuhkan dari sebuah platform AI modern, digabungkan dalam satu dashboard yang ergonomis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/15 text-primary mb-4 group-hover:scale-105 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Streaming Ultra Cepat
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Didukung oleh arsitektur Edge Runtime dan Groq LPUs dengan latensi TTFT di bawah 1.5 detik. Respons muncul instan kata demi kata.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Multi-Model Switcher
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pilih model terbaik untuk kebutuhan Anda: Groq Llama 3.3, OpenAI GPT-4o, atau OpenRouter Mistral dalam satu ruang obrolan.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              BYOK & Enkripsi AES-256
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bawa API key Anda sendiri untuk akses tanpa batas. Key dienkripsi di server dan tidak pernah terekspos ke perangkat mana pun.
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <FolderTree className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Manajemen Folder & Pin
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Rapikan ratusan obrolan dengan sistem folder bertingkat, sematkan chat penting di atas, dan cari topik dalam hitungan milidetik.
            </p>
          </Card>

          {/* Card 5 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Globe2 className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Pencarian Web Realtime
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dapatkan informasi terkini dengan sitasi bernomor [1], [2] yang mengarahkan langsung ke sumber berita atau dokumentasi resmi.
            </p>
          </Card>

          {/* Card 6 */}
          <Card className="bg-card/60 border-border/70 hover:border-primary/50 transition-all p-6 rounded-2xl group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              Ekspor Lengkap MD, PDF & JSON
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Arsipkan percakapan penting Anda ke file Markdown bersih, PDF bertema gelap yang elegan, atau data mentah JSON.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            Tanya Jawab
          </h2>
          <h3 className="text-3xl font-bold tracking-tight text-foreground">
            Pertanyaan yang Sering Diajukan
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border/70 bg-card/50 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-4",
                      isOpen && "rotate-180 text-primary"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-violet-950/40 via-card to-card p-8 sm:p-14 text-center shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Siap Merevolusi Cara Anda Berinteraksi dengan AI?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Daftar sekarang dan nikmati kebebasan mengeksplorasi ide, menulis kode, dan menata arsip percakapan tanpa batas.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              variant="glow"
              size="lg"
              asChild
              className="h-12 px-8 rounded-2xl text-base text-white font-semibold shadow-xl"
            >
              <Link href="/register">
                <span>Buka Akun Gratis Sekarang</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
