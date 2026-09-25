export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "user" | "admin";
  locale: string;
  theme: "dark" | "light" | "system";
}

export interface MockFolder {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId?: string | null;
  count?: number;
}

export interface MockConversation {
  id: string;
  title: string;
  model: string;
  provider: "groq" | "openai" | "openrouter";
  isPinned: boolean;
  isFavorite: boolean;
  folderId?: string | null;
  updatedAt: string;
  lastMessageSnippet?: string;
}

export interface MockMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  provider?: string;
  createdAt: string;
  totalTokens?: number;
  durationMs?: number;
}

export const CURRENT_MOCK_USER: MockUser = {
  id: "usr-01",
  email: "rizky.pratama@example.id",
  fullName: "Rizky Pratama",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "admin",
  locale: "id-ID",
  theme: "dark",
};

export const MOCK_FOLDERS: MockFolder[] = [
  { id: "f-1", name: "Kerjaan Startup", color: "violet", icon: "briefcase", count: 5 },
  { id: "f-2", name: "Skripsi Kuliah", color: "blue", icon: "graduation-cap", count: 3 },
  { id: "f-3", name: "Kesehatan & Diet", color: "emerald", icon: "activity", count: 4 },
  { id: "f-4", name: "Random Ide", color: "amber", icon: "lightbulb", count: 3 },
];

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: "conv-01",
    title: "Strategi Content Marketing untuk Startup B2B 2025",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: true,
    isFavorite: true,
    folderId: "f-1",
    updatedAt: "10 menit lalu",
    lastMessageSnippet: "Berikut rencana pilar konten LinkedIn dan newsletter...",
  },
  {
    id: "conv-02",
    title: "Cara Perbaiki Error TypeError: Cannot read property",
    model: "gpt-4o-mini",
    provider: "openai",
    isPinned: true,
    isFavorite: false,
    folderId: "f-1",
    updatedAt: "1 jam lalu",
    lastMessageSnippet: "Gunakan optional chaining ?. atau default value...",
  },
  {
    id: "conv-03",
    title: "Rencana Makanan Sehat 7 Hari untuk Diet Rendah Karbo",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: true,
    folderId: "f-3",
    updatedAt: "Kemarin",
    lastMessageSnippet: "Menu sarapan hari ke-1: Omelet telur bayam...",
  },
  {
    id: "conv-04",
    title: "Ide Nama Brand Kopi Lokal yang Unik & Filosofis",
    model: "mistral-large-2407",
    provider: "openrouter",
    isPinned: false,
    isFavorite: false,
    folderId: "f-4",
    updatedAt: "2 hari lalu",
    lastMessageSnippet: "1. Seduh Jiwa, 2. Rona Kopi, 3. Titik Temu...",
  },
  {
    id: "conv-05",
    title: "Ringkas Paper AI: Retrieval-Augmented Generation",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-2",
    updatedAt: "3 hari lalu",
    lastMessageSnippet: "Paper ini mendiskusikan mekanisme embedding similarity...",
  },
  {
    id: "conv-06",
    title: "Analisis Pasar E-Commerce SaaS di Indonesia",
    model: "gpt-4o-mini",
    provider: "openai",
    isPinned: false,
    isFavorite: false,
    folderId: "f-1",
    updatedAt: "4 hari lalu",
    lastMessageSnippet: "Tingkat penetrasi omnichannel di segmen UMKM meningkat...",
  },
  {
    id: "conv-07",
    title: "Panduan Olahraga HIIT 20 Menit untuk Pemula",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-3",
    updatedAt: "5 hari lalu",
    lastMessageSnippet: "Pemanasan dinamis 3 menit, jumping jack 40 detik...",
  },
  {
    id: "conv-08",
    title: "Review Kode Refactoring React Custom Hooks",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-1",
    updatedAt: "6 hari lalu",
    lastMessageSnippet: "Sebaiknya pecah useFetch menjadi useAsyncState...",
  },
  {
    id: "conv-09",
    title: "Outline Skripsi Bab 2: Tinjauan Pustaka LLM",
    model: "gpt-4o-mini",
    provider: "openai",
    isPinned: false,
    isFavorite: false,
    folderId: "f-2",
    updatedAt: "1 minggu lalu",
    lastMessageSnippet: "2.1 Sejarah Pemodelan Bahasa Alami...",
  },
  {
    id: "conv-10",
    title: "Ide Konsep Cafe Minimalis Gaya Industrial Modern",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-4",
    updatedAt: "1 minggu lalu",
    lastMessageSnippet: "Gunakan semen ekspos dan pencahayaan warm 2700K...",
  },
  {
    id: "conv-11",
    title: "Checklist SEO Teknis untuk Website Next.js 15",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-1",
    updatedAt: "2 minggu lalu",
    lastMessageSnippet: "1. Canonical tags, 2. OpenGraph, 3. sitemap.xml...",
  },
  {
    id: "conv-12",
    title: "Panduan Manajemen Stres untuk Pekerja Remote",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-3",
    updatedAt: "2 minggu lalu",
    lastMessageSnippet: "Buat batasan tegas antara jam kerja dan istirahat...",
  },
  {
    id: "conv-13",
    title: "Metodologi Penelitian Kuantitatif Pengaruh AI",
    model: "gpt-4o-mini",
    provider: "openai",
    isPinned: false,
    isFavorite: false,
    folderId: "f-2",
    updatedAt: "3 minggu lalu",
    lastMessageSnippet: "Gunakan kuesioner skala Likert 5 poin...",
  },
  {
    id: "conv-14",
    title: "Storyline Podcast Fiksi Ilmiah Jakarta Tahun 2085",
    model: "mistral-large-2407",
    provider: "openrouter",
    isPinned: false,
    isFavorite: false,
    folderId: "f-4",
    updatedAt: "3 minggu lalu",
    lastMessageSnippet: "Episode 1: Sinyal Misterius dari Dasar Waduk Pluit...",
  },
  {
    id: "conv-15",
    title: "Panduan Nutrisi Makro untuk Menaikkan Massa Otot",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    isPinned: false,
    isFavorite: false,
    folderId: "f-3",
    updatedAt: "1 bulan lalu",
    lastMessageSnippet: "Target protein harian 1.8 - 2.2 gram per kg berat badan...",
  },
];

export const MOCK_MESSAGES_CONV_01: MockMessage[] = [
  {
    id: "m-01",
    conversationId: "conv-01",
    role: "user",
    content: "Halo AetherChat! Saya sedang menyusun strategi content marketing untuk startup B2B SaaS di Indonesia untuk kuartal pertama 2025. Produk kami adalah software automasi invoice dan rekonsiliasi bank untuk UMKM dan mid-market. Bisakah kamu berikan panduan komprehensif pilar konten, channel utama, dan contoh ide postingan LinkedIn yang konversinya tinggi?",
    createdAt: "10:15 WIB",
  },
  {
    id: "m-02",
    conversationId: "conv-01",
    role: "assistant",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    totalTokens: 540,
    durationMs: 820,
    content: `Halo Rizky! Tentu, ini adalah strategi content marketing B2B SaaS yang terfokus pada edukasi problem-aware dan membangun kepercayaan (trust & authority) untuk pasar Indonesia.

### 1. Tiga Pilar Konten Utama (Framework 60-30-10)

* **Pilar 1: Pain-Point & Practical Education (60%)**
  Fokus pada masalah nyata yang dialami Finance Manager & CFO: selisih kas, waktu lembur rekap bon bulanan, risiko denda pajak, dan human-error spreadsheet.
* **Pilar 2: Social Proof & Case Studies (30%)**
  Studi kasus nyata: *"Bagaimana Kopi Kenangan memangkas waktu rekonsiliasi 40 jam menjadi 15 menit dengan AetherInvoice"*.
* **Pilar 3: Product Insights & Roadmap (10%)**
  Fitur baru, integrasi API perbankan BCA/Mandiri/BRI, dan keamanan data standar ISO 27001.

---

### 2. Contoh Template Postingan LinkedIn Berkonversi Tinggi

Berikut format narasi personal story + data:

\`\`\`markdown
Kemarin saya ngobrol dengan seorang CFO startup retail yang punya 45 cabang.

Setiap tanggal 28 sampai 3, tim finansialnya kerja lembur sampai jam 10 malam.
Bukan karena kekurangan staf, tapi karena:
- Mencocokkan 12.000 transaksi mutasi bank secara manual di Excel.
- Menemukan selisih Rp 150.000 yang bikin laporan bulanan tertunda 4 hari.

Padahal di era sekarang, 95% proses ini bisa selesai otomatis dalam 3 menit.

Berikut 3 langkah awal memodernisasi rekonsiliasi finansial bisnis Anda:
1. Stop ekspor CSV manual antar rekening
2. Gunakan direct webhook perbankan
3. Pasang algoritma auto-matching berbasis nomor invoice

Apakah tim keuangan Anda masih lembur di akhir bulan? Mari diskusi di komentar! 👇
\`\`\`

---

### 3. Eksekusi Minggu Pertama

1. **Jadwal Posting**: 3x seminggu di LinkedIn (Selasa, Rabu, Kamis pukul 08:30 WIB).
2. **Lead Magnet**: Buatkan checklist gratis *"Audit Kesiapan Rekonsiliasi Bank Otomatis 2025"* format PDF.
3. **Distribution**: Re-purpose ke newsletter email mingguan.

Apakah kamu ingin kita kembangkan draf lead magnet PDF-nya sekarang?`,
    createdAt: "10:16 WIB",
  },
  {
    id: "m-03",
    conversationId: "conv-01",
    role: "user",
    content: "Bagus sekali! Bisakah buatkan script helper kecil TypeScript untuk menghitung rasio konversi konten dan perkiraan ROI lead magnet tersebut?",
    createdAt: "10:18 WIB",
  },
  {
    id: "m-04",
    conversationId: "conv-01",
    role: "assistant",
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    totalTokens: 380,
    durationMs: 610,
    content: `Tentu! Ini script TypeScript fungsional yang bisa kamu jalankan di Node.js atau Next.js untuk mengukur metrics funnel content marketing:

\`\`\`typescript
interface FunnelMetrics {
  impressions: number;
  clicks: number;
  leadDownloads: number;
  mql: number; // Marketing Qualified Leads
  dealsClosed: number;
  dealValueAverage: number; // dalam IDR
}

interface FunnelReport {
  ctrPercentage: string;
  downloadRatePercentage: string;
  mqlConversionRate: string;
  winRatePercentage: string;
  totalRevenueIdr: string;
}

export function calculateContentRoi(metrics: FunnelMetrics): FunnelReport {
  const ctr = (metrics.clicks / metrics.impressions) * 100;
  const downloadRate = (metrics.leadDownloads / metrics.clicks) * 100;
  const mqlRate = (metrics.mql / metrics.leadDownloads) * 100;
  const winRate = (metrics.dealsClosed / metrics.mql) * 100;
  const totalRevenue = metrics.dealsClosed * metrics.dealValueAverage;

  return {
    ctrPercentage: ctr.toFixed(2) + "%",
    downloadRatePercentage: downloadRate.toFixed(2) + "%",
    mqlConversionRate: mqlRate.toFixed(2) + "%",
    winRatePercentage: winRate.toFixed(2) + "%",
    totalRevenueIdr: new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(totalRevenue),
  };
}

// Contoh Penggunaan:
const campaign = calculateContentRoi({
  impressions: 45000,
  clicks: 1800,
  leadDownloads: 320,
  mql: 48,
  dealsClosed: 6,
  dealValueAverage: 35000000, // Rp 35 Juta ACV
});

console.log(campaign);
\`\`\`

Script di atas akan menghitung secara presisi rasio dari tayangan hingga deal tertutup, sehingga kamu punya metrik konkret saat presentasi ke stakeholder!`,
    createdAt: "10:19 WIB",
  },
];

export const MOCK_SUGGESTED_PROMPTS = [
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

export const MOCK_ADMIN_STATS = {
  totalUsers: 14850,
  activeUsersToday: 3240,
  totalMessages: 684200,
  totalTokensUsed: "1.42B",
  serverUptime: "99.98%",
  cacheHitRatio: "88.4%",
};

export const MOCK_ADMIN_USERS = [
  { id: "usr-01", name: "Rizky Pratama", email: "rizky.pratama@example.id", role: "admin", joined: "15 Jan 2025", messagesToday: 18, status: "active" },
  { id: "usr-02", name: "Siti Nurhaliza", email: "siti.n@example.id", role: "user", joined: "18 Jan 2025", messagesToday: 42, status: "active" },
  { id: "usr-03", name: "Budi Santoso", email: "budi.santoso@startup.co.id", role: "user", joined: "02 Feb 2025", messagesToday: 50, status: "active" },
  { id: "usr-04", name: "Ahmad Fauzi", email: "fauzi_dev@gmail.com", role: "user", joined: "10 Feb 2025", messagesToday: 0, status: "inactive" },
  { id: "usr-05", name: "Devi Anggraini", email: "devi.ang@corp.net", role: "user", joined: "22 Feb 2025", messagesToday: 12, status: "active" },
  { id: "usr-06", name: "SpamBot99", email: "bot_attack@proxy.io", role: "user", joined: "01 Mar 2025", messagesToday: 520, status: "banned" },
];

export const MOCK_ADMIN_LOGS = [
  { id: "log-1", timestamp: "10:14:22 WIB", type: "RATE_LIMIT_WARNING", user: "SpamBot99 (usr-06)", detail: "Request 520/menit melebihi threshold 500 req/min. Sistem memicu auto-quarantine." },
  { id: "log-2", timestamp: "09:48:10 WIB", type: "AUTH_SUCCESS", user: "rizky.pratama@example.id", detail: "Login sukses via Google OAuth dari IP 182.253.110.12 (Jakarta)." },
  { id: "log-3", timestamp: "08:30:00 WIB", type: "CRON_EXECUTION", user: "SYSTEM (pg_cron)", detail: "Eksekusi reset kuota harian 'reset_daily_quota' selesai. 14,850 baris di-refresh." },
  { id: "log-4", timestamp: "06:12:45 WIB", type: "BYOK_ENCRYPTION", user: "budi.santoso@startup.co.id", detail: "Menyimpan API Key pribadi penyedia Groq dengan enkripsi AES-256-GCM." },
];
