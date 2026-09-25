export interface SuggestedPrompt {
  category: string;
  title: string;
  prompt: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    category: "Ide & Kreativitas",
    title: "Buat Pitch Deck Startup",
    prompt: "Buatkan outline pitch deck 10 slide untuk startup fintech pembayaran mikro berbasis QRIS di Asia Tenggara.",
  },
  {
    category: "Coding & Arsitektur",
    title: "Refactor Next.js App Router",
    prompt: "Bagaimana cara menstrukturisasi Server Actions dan Data Fetching di Next.js 15 agar bebas dari memory leak?",
  },
  {
    category: "Riset & Ringkasan",
    title: "Analisis Pasar AI 2025",
    prompt: "Bandingkan kelebihan dan kekurangan model Groq Llama 3.3 vs GPT-4o-mini dari sisi latensi dan biaya API.",
  },
  {
    category: "Produktivitas Bisnis",
    title: "Template Email Penawaran",
    prompt: "Tuliskan cold email B2B yang persuasif dan sopan kepada VP Finance untuk mendemokan software otomasi laporan keuangan.",
  },
];
