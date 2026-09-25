# ✦ AetherChat — Modern Grok-Styled AI Chatbot

Aplikasi chatbot kecerdasan buatan (AI) modern berbasis web dengan estetika minimalis bergaya **Grok / ChatGPT**, dibangun menggunakan **Next.js 16 (App Router)**, **Supabase** (Auth, PostgreSQL, Storage, Realtime), **Tailwind CSS v4**, **shadcn/ui & Radix UI**, serta **Vercel AI SDK**.

---

## 🌟 Fitur Unggulan

- **Antarmuka Bergaya Grok**:
  - Tema gelap presisi (`#0b0b0f`), aksen violet glow (`#8b5cf6`), dan tipografi modern Geist Sans & Geist Mono.
  - Streaming respons real-time ultra cepat dengan visual kursor berkedip.
  - Code blocks interaktif dengan tombol salin, deteksi sintaksis bahasa, dan rendering Markdown kaya (tabel, kutipan, list).
- **Multi-Model AI Fleksibel**:
  - Dukungan langsung untuk **Groq** (Llama 3.3 70B Versatile super cepat ~300+ tok/s).
  - Integrasi **OpenAI** (GPT-4o, GPT-4o-mini).
  - Dukungan **OpenRouter** (Mistral, Claude 3.5 Sonnet, DeepSeek).
  - Fitur **BYOK (Bring Your Own Key)** terenkripsi **AES-256-GCM** tingkat perbankan.
- **Manajemen Riwayat & Folder Tingkat Lanjut**:
  - Folder kustom berwarna dengan drag-and-drop / selector perpindahan percakapan.
  - Fitur pin (sematkan) percakapan penting dan pencarian riwayat real-time.
  - Sinkronisasi instan multi-perangkat via **Supabase Realtime channels**.
- **Analisis Dokumen & Multimedia**:
  - Unggah file PDF, DOCX, TXT, MD, CSV, dan JSON dengan ekstraksi teks instan.
  - Pratinjau thumbnail file pada input chat.
  - Generate gambar AI kreatif (DALL·E 3 / Flux).
- **Pencarian Web Real-time**:
  - Integrasi **Tavily AI Search** untuk pencarian berita dan informasi terkini.
  - Kutipan sumber bernomor (citations) terintegrasi pada respons chat.
- **Input Suara (Voice to Text)**:
  - Dukungan Web Speech API native Bahasa Indonesia (`id-ID`) dengan durasi hingga 120 detik per rekaman.
- **Ekspor Riwayat Multi-Format**:
  - Ekspor ke **Markdown (.md)**, **JSON (.json)**, **HTML/PDF siap cetak**, dan **Bulk ZIP** untuk semua riwayat percakapan.
- **Admin Management Console**:
  - Dashboard statistik analitik pengguna, manajemen provider LLM, serta audit log sistem & abuse.

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) + React 19 + TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + CSS Variables + Radix UI Primitives |
| **AI Integration** | [Vercel AI SDK v4](https://sdk.vercel.ai/) (`@ai-sdk/groq`, `@ai-sdk/openai`, `ai`) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL 15, Auth SSR, Storage, Realtime) |
| **Keamanan BYOK** | Enkripsi simetris Node.js `crypto` **AES-256-GCM** |
| **Web Search** | [Tavily Search API](https://tavily.com/) |
| **Voice Input** | Web Speech Recognition API (`id-ID`) |
| **Pengujian** | Automated E2E Runner via `tsx` |

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
- **Node.js**: v20.x atau v24.x (disarankan v24)
- **NPM**: v10.x ke atas
- Akun **Supabase** (Gratis)
- API Key **Groq** dan/atau **OpenAI** (Opsional untuk pengujian AI langsung)

### 2. Kloning & Instalasi Dependensi
```bash
# Masuk ke direktori proyek
cd d:/project/web/AetherChat

# Instal seluruh dependensi
npm install
```

### 3. Konfigurasi Variabel Lingkungan (`.env.local`)
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Sesuaikan nilai konfigurasi berikut:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AetherChat
NODE_ENV=development

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Kunci Enkripsi BYOK (32-byte string atau base64)
# Dapat dibuat dengan: openssl rand -base64 32
APP_ENCRYPTION_KEY=aetherchat-32-byte-secret-encryption-key!

# AI Provider Keys
GROQ_API_KEY=gsk_your_groq_api_key
OPENAI_API_KEY=sk-your_openai_api_key
TAVILY_API_KEY=tvly-your_tavily_api_key

# Limit Kuota Gratis Harian
FREE_DAILY_MESSAGES=50
FREE_DAILY_IMAGE_GEN=5
FREE_DAILY_WEB_SEARCH=20
```

### 4. Menjalankan Server Pengembangan (Dev Mode)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 5. Menjalankan Test Suite Otomatis
AetherChat dilengkapi dengan suite validasi otomatis yang mencakup modul enkripsi AES-256-GCM, validator Zod, system prompt builder, logika kuota, dan ekspor dokumen:
```bash
npm test
```

### 6. Build Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 🗄️ Konfigurasi Supabase & Migrasi Database

AetherChat dilengkapi dengan skrip migrasi SQL lengkap yang mendukung **11 tabel**, fungsi trigger otomatis, **Row Level Security (RLS)** ketat, dan kebijakan **Supabase Storage**.

### Menjalankan Migrasi SQL
1. Buka dashboard proyek Supabase Anda di [supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor**.
3. Buka dan salin seluruh isi file [`supabase/migrations/0001_init.sql`](file:///d:/project/web/AetherChat/supabase/migrations/0001_init.sql).
4. Klik **Run** untuk mengeksekusi migrasi.
5. (Opsional) Jalankan [`supabase/seed.sql`](file:///d:/project/web/AetherChat/supabase/seed.sql) untuk mengisi data awal kategori dan provider AI.

### Struktur Tabel Inti:
1. `profiles`: Profil pengguna, avatar, preferensi tema, status admin.
2. `user_settings`: Konfigurasi LLM default, temperatur, top_p, persona kustom.
3. `folders`: Hirarki folder percakapan bersarang dengan kode warna.
4. `conversations`: Header chat, model yang digunakan, status pin/arsip.
5. `messages`: Riwayat chat pengguna dan asisten AI, durasi latensi, token.
6. `attachments`: Metadata file yang diunggah ke Supabase Storage.
7. `user_api_keys`: Tempat penyimpanan API Key pribadi (BYOK) yang terenkripsi AES-256-GCM.
8. `usage_tracking`: Pencatatan konsumsi kuota harian (pesan, gambar, pencarian web).
9. `ai_providers`: Daftar penyedia model AI yang aktif pada platform.
10. `system_logs`: Log aktivitas audit dan pencegahan abuse.
11. `shared_conversations`: Akses tautan publik percakapan.

---

## 🔑 Pengaturan Kunci API & Bring Your Own Key (BYOK)

### 1. Cara Mendapatkan Kunci API
- **Groq API Key**: Dapatkan secara gratis dengan latensi ultra-cepat di [console.groq.com](https://console.groq.com/).
- **OpenAI API Key**: Dapatkan di [platform.openai.com](https://platform.openai.com/).
- **Tavily API Key**: Dapatkan di [app.tavily.com](https://app.tavily.com/) (1.000 pencarian gratis/bulan).

### 2. Cara Mengaktifkan BYOK pada Aplikasi
1. Masuk ke AetherChat.
2. Buka menu **Pengaturan** (`/settings/api-keys`).
3. Pilih provider (misal: **Groq** atau **OpenAI**).
4. Masukkan API Key Anda lalu klik **Simpan & Uji Koneksi**.
5. Kunci Anda akan langsung dienkripsi menggunakan AES-256-GCM di sisi server sebelum disimpan di database, sehingga aman dan tidak dapat dibaca oleh pihak lain. Pengguna dengan BYOK mendapatkan kuota pesan tak terbatas.

---

## 🔒 Keamanan & Kebijakan Data

- **Zero-Exposure Security**: Secret API key, Service Role Key, dan Master Encryption Key tidak pernah dikirim ke browser client.
- **Content Security Policy (CSP)** & HTTP Headers ketat: HSTS 2 tahun, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin.
- **Row Level Security (RLS)**: Setiap pengguna hanya dapat membaca dan menulis data percakapannya sendiri.
- **Pembersihan Payload**: Sanitasi data input chat dan pencegahan eksploitasi prompt injection.

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Hak Cipta © 2026 **AetherChat Team**.
