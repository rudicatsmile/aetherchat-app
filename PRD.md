# AetherChat

---

## 1. Ringkasan & Tujuan Aplikasi
*Bagian ini menjelaskan gambaran umum proyek agar dipahami bersama oleh pemilik ide/klien dan tim pengembang.*
- **Nama Aplikasi**: AetherChat
- **Penjelasan Singkat**: AetherChat adalah aplikasi chatbot AI berbasis web dengan antarmuka minimalis modern bergaya Grok, mendukung streaming respons realtime antar-model AI global, rendering Markdown & code block yang rapi, upload file/gambar, web search, voice input, dan image generation dalam satu ruang percakapan yang elegan.
- **Masalah yang Diselesaikan**:
  - Pengguna harus membuka banyak tab untuk berpindah antar model AI (OpenAI, Groq, OpenRouter) karena tidak ada antarmuka terpadu yang enak dipakai.
  - Aplikasi AI populer saat ini berat, iklan, dan tidak menyimpan riwayat percakapan secara personal antar perangkat.
  - Pengguna tidak bisa mengontrol kreativitas AI, system prompt, atau memakai API key pribadi di aplikasi gratis publik.
  - Sulit mengekspor, menata, dan menemukan kembali percakapan penting karena fitur manajemen riwayat sangat terbatas.
- **Pengguna Aplikasi**:
  - **Tamu (Guest)**: Melihat landing page, mencoba 3 pesan percakapan tanpa simpan riwayat.
  - **Pengguna Terdaftar (Google/Email)**: Menyimpan unlimited riwayat percakapan, membuat folder, pin chat, ekspor, dan mengatur preferensi AI.
  - **Power User (BYOK - Bring Your Own Key)**: Cukup memasukkan API key pribadi (OpenAI/Groq/OpenRouter) untuk mengakses kuota tak terbatas tanpa bergantung kuota gratіs server.
  - **Administrator**: Mengelola kuota gratis harian, mengawasi abuse, dan mengelola konfigurasi provider default lewat dashboard admin Supabase.
- **Target Keberhasilan**:
  - Pengguna dapat memulai percakapan pertama dalam < 10 detik setelah sign-in.
  - Waktu hingga token pertama muncul (time to first token / TTFT) < 1,5 detik pada streaming AI.
  - Retensi pengguna mingguan (WAU/MAU ratio) ≥ 35% karena fitur riwayat & folder yang nyaman.
  - 0 secret key terekspos di sisi klien (semua panggilan AI lewat Server Actions/Route Handlers).
  - Lighthouse Performance & Accessibility ≥ 90 pada halaman chat utama.

---

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
*Menegaskan fitur apa yang dikerjakan di versi awal dan apa yang sengaja ditunda agar aplikasi cepat selesai dan tidak membengkak (mencegah scope creep).*
### ✅ Yang Dikerjakan:
- Landing page publik dengan animasi modern dan CTA "Mulai Chat Gratis".
- Autentikasi multi-login: Google OAuth + Email/Password & Magic Link via Supabase Auth.
- Chat utama dengan streaming response realtime (Server-Sent Events / Vercel AI SDK).
- Rendering Markdown + code block dengan syntax highlighting + tombol copy code.
- Sidebar riwayat percakapan: New Chat, Rename, Hapus, Pin/Favorite, Folder/Kategori, Search judul, Sinkronisasi otomatis antar perangkat.
- Upload file (PDF, TXT, MD, DOCX) & gambar (PNG/JPG/WEBP) ke chat, tersimpan di Supabase Storage.
- Voice Input (Speech-to-Text via Web Speech API / Whisper API).
- Image Generation (via DALL·E 3, Flux, atau model image pilihan provider).
- Web Search sederhana (via Tavily / Serper API) sebagai tool opsional pada model yang mendukung.
- Halaman Settings: pilih model, input API key pribadi (terenkripsi), persona/system prompt, temperature/top-p/max tokens, ekspor chat (Markdown & PDF), dan dashboard kuota gratis harian.
- Dark mode sebagai default + toggle light mode.
- Responsive desktop, tablet, dan mobile (drawer sidebar).

### ⛔ Yang Tidak Dikerjakan di Versi Awal:
- Sistem pembayaran / langganan berbayar (aplikasi 100% gratis tanpa gateway pembayaran).
- Team workspace / kolaborasi multi-user dalam satu percakapan.
- Fine-tuning model custom milik sendiri.
- Aplikasi mobile native (iOS/Android).
- Plugin/ekstensi pihak ketiga (Chrome extension, dsb).
- Integrasi email marketing / newsletter.
- Multi-bahasa UI (hanya Bahasa Indonesia & Inggris sederhana).

---

## 3. Daftar Halaman & Struktur Menu (Pages & Routing)
*Daftar lengkap halaman yang harus dibuat, dikelompokkan berdasarkan area atau peran pengguna (Role).*
### A. Public Area (Tanpa Login)
- `/` (Landing Page): Hero section dengan tagline, demo chat mini interaktif, daftar fitur unggulan, screenshot antarmuka, FAQ, dan CTA daftar gratis.
- `/about` (Tentang): Cerita proyek AetherChat, misi, teknologi yang digunakan, dan kontak.
- `/privacy` (Kebijakan Privasi): Penjelasan data yang dikumpulkan, penggunaan, dan hak pengguna.
- `/terms` (Syarat & Ketentuan): Aturan penggunaan layanan gratis.
- `/login` (Masuk): Form login email/password + tombol Google OAuth + opsi magic link.
- `/register` (Daftar): Form registrasi email/password + tombol Google OAuth.
- `/auth/callback` (Supabase Auth Callback): Route handler untuk OAuth redirect & konfirmasi email.

### B. Chat Area (Setelah Login)
- `/chat` (Chat Utama): Halaman default setelah login — menampilkan conversation aktif atau welcome screen "Mulai percakapan baru".
- `/chat/[conversationId]` (Chat Spesifik): Percakapan tertentu berdasarkan ID, dengan streaming AI dan panel sidebar.
- `/search` (Pencarian Global): Pencarian seluruh judul percakapan + isi pesan (full-text search via Postgres).

### C. User Area (Setelah Login)
- `/settings` (Pengaturan Utama): Navigasi tab ke sub-pengaturan di bawah.
- `/settings/general` (Umum): Nama tampilan, avatar, bahasa, toggle dark/light.
- `/settings/models` (Model AI Default): Pilih provider + model default (Groq Llama 3.3, OpenAI GPT-4o-mini, OpenRouter Mistral, dll).
- `/settings/api-keys` (API Key Pribadi): Input & kelola API key personal (OpenAI/Groq/OpenRouter) — dienkripsi di database.
- `/settings/persona` (Persona & System Prompt): Custom system prompt default yang akan dipakai di setiap chat baru.
- `/settings/parameters` (Parameter AI): Temperature, top_p, max_tokens, presence_penalty, frequency_penalty.
- `/settings/usage` (Kuota & Penggunaan): Dashboard penggunaan kuota gratis harian, statistik chat, sisa kuota, dan reset time.
- `/settings/data` (Data & Ekspor): Ekspor seluruh chat (Markdown/JSON/PDF), impor, dan hapus akun permanen.

### D. Admin Area (Internal)
- `/admin/dashboard`: Statistik total user, total pesan, usage kuota gratis global.
- `/admin/users`: Daftar user, status, usage, dan aksi ban/unban.
- `/admin/providers`: Konfigurasi provider default, model aktif, dan rate limit global.
- `/admin/logs`: Log error AI, rate-limit hits, dan abuse detection.

---

## 4. Pedoman UI/UX & Design System
*Panduan visual konkret agar AI coding assistant tidak membuat UI yang kaku atau default.*
- **Skema Warna (Dark Mode Default)**:
  - Background utama: `hsl(240, 10%, 4%)` — hitam pekat bergaya Grok.
  - Surface/Card: `hsl(240, 6%, 10%)` dengan border halus `hsl(240, 5%, 18%)`.
  - Foreground utama: `hsl(0, 0%, 98%)`, muted foreground: `hsl(240, 5%, 65%)`.
  - Primary/Accent: `hsl(258, 89%, 66%)` (violet elektrik) — untuk tombol kirim, active chat, dan brand.
  - Accent glow gradient: `linear-gradient(135deg, hsl(258,89%,66%), hsl(200,100%,60%))` untuk hero & logo.
  - Success: `hsl(142, 76%, 45%)`, Destructive: `hsl(0, 84%, 60%)`, Warning: `hsl(45, 93%, 58%)`.
- **Skema Warna (Light Mode Opsional)**:
  - Background: `hsl(0, 0%, 100%)`, Surface: `hsl(240, 20%, 98%)`, Border: `hsl(240, 10%, 90%)`, Foreground: `hsl(240, 10%, 8%)`.
- **Tipografi**:
  - Font utama (heading + UI): **Geist Sans** (modern, clean, eksklusif next-gen).
  - Font monospace (kode): **Geist Mono** atau **JetBrains Mono**.
  - Ukuran: heading-1 `text-3xl md:text-4xl font-semibold tracking-tight`, body `text-[15px] leading-relaxed`, chat bubble `text-[15.5px]`.
- **Aturan Komponen**:
  - Sudut membulat: `rounded-xl` untuk tombol/card, `rounded-2xl` untuk chat bubble user, `rounded-3xl` untuk container input chat.
  - Shadow: `shadow-sm` sebagai default, `shadow-md` saat hover, dan `glow shadow` spesial untuk tombol kirim.
  - Jarak antar elemen: gunakan spacing `gap-3` / `gap-4` yang konsisten, hindari gap kecil `< 8px`.
  - Chat bubble user: align kanan, warna surface lebih terang dengan `border border-white/5`.
  - Chat bubble AI: full-width (tanpa bubble) dengan padding `py-5` bergaya Grok/ChatGPT untuk keterbacaan Markdown panjang.
  - Code block: `.overflow-x-auto` + wrapper dengan header kecil berisi nama bahasa dan tombol copy.
  - Skeleton loading: gunakan shadcn `Skeleton` dengan animasi `pulse` saat AI merespons.
  - Cursor berkedip "▌" di akhir streaming response.
- **Nuansa & Vibe**: Minimalis futuristik seperti Grok — ruang kosong luas, tipografi tegas, gradient tipis di aksen, micro-animation halus (fade-in pesan, slide-in sidebar), dan fokus penuh pada isi percakapan tanpa elemen mengganggu.
- **Motion & Transisi**: Gunakan Framer Motion untuk animasi sidebar open/close (200ms ease-out), fade-in pesan baru (150ms), dan skeleton shimmer.
- **Responsif**:
  - Desktop (≥ 1024px): Sidebar persisten kiri 280px + chat window center max-width 760px.
  - Tablet (768–1023px): Sidebar collapsible via tombol hamburger.
  - Mobile (< 768px): Sidebar sebagai drawer overlay, tombol kirim full-width di bawah.

---

## 5. Pembagian Hak Akses Pengguna
*Tabel hak akses yang menentukan siapa saja yang boleh melihat, mengedit, atau mengelola data.*
| Menu / Halaman | Tamu (Guest) | Pengguna Terdaftar | Administrator |
| :--- | :---: | :---: | :---: |
| Landing Page `/` | ✅ | ✅ | ✅ |
| Halaman `/about`, `/privacy`, `/terms` | ✅ | ✅ | ✅ |
| Chat tanpa login (limit 3 pesan, tanpa simpan) | ✅ | ✅ | ✅ |
| Chat dengan riwayat tersimpan `/chat` | ❌ | ✅ | ✅ |
| Sidebar riwayat & folder | ❌ | ✅ | ✅ |
| Upload file & gambar ke chat | ❌ | ✅ | ✅ |
| Voice input (STT) | ✅ | ✅ | ✅ |
| Image generation | ❌ | ✅ | ✅ |
| Web Search tool | ❌ | ✅ | ✅ |
| Ekspor chat (Markdown / PDF / JSON) | ❌ | ✅ | ✅ |
| Halaman `/settings/*` (semua tab) | ❌ | ✅ | ✅ |
| Input API Key pribadi (BYOK) | ❌ | ✅ | ✅ |
| Dashboard `/admin/*` | ❌ | ❌ | ✅ |
| Ban / unban user | ❌ | ❌ | ✅ |
| Konfigurasi provider default & rate limit global | ❌ | ❌ | ✅ |

---

## 6. Alur Kerja dan Fitur Utama
*Menjelaskan cara kerja setiap fitur utama dalam bahasa yang mudah dipahami serta aturan logikanya.*

### A. Autentikasi Multi-Login (Google & Email)
1. **Cara Kerja**:
   - Pengguna membuka `/register` atau `/login`, lalu memilih tombol **"Lanjutkan dengan Google"** atau mengisi email & password.
   - Jika memilih Google OAuth → dikirim ke halaman consent Google → kembali ke `/auth/callback` → Supabase men-set sesi cookie.
   - Jika email/password → Supabase mengirim email konfirmasi (atau magic link) → user klik tautan → sesi dibuat.
   - Setelah login sukses, sistem otomatis membuat baris di `profiles` (jika belum ada) dan mengarahkan user ke `/chat`.
2. **Aturan Sistem**:
   - Password minimal 8 karakter, wajib mengandung 1 huruf & 1 angka.
   - Magic link berlaku maksimum 60 menit.
   - Rate limit verifikasi email: maksimal 3 kali per 15 menit per alamat email.
   - Sesi disimpan sebagai HTTP-only cookie via `@supabase/ssr` dengan refresh otomatis di middleware.
   - Semua rute `/chat`, `/settings`, dan `/admin` dilindungi middleware Next.js yang membaca sesi Supabase.

### B. Percakapan AI dengan Streaming Response Realtime
1. **Cara Kerja**:
   - User mengetik pesan di input bawah, menekan Enter (atau Shift+Enter untuk baris baru).
   - Pesan user disimpan ke tabel `messages` dengan role `user`.
   - Frontend memanggil Route Handler `/api/chat` (Edge Runtime) yang mengirim request streaming ke provider AI (Groq/OpenAI/OpenRouter) menggunakan **Vercel AI SDK** (`streamText`).
   - Response diproses sebagai **ReadableStream** (SSE) — setiap token langsung di-render ke bubble AI dengan cursor berkedip.
   - Setelah selesai, pesan assistant final disimpan ke `messages` dengan metadata token usage & durasi.
2. **Aturan Sistem**:
   - Kuota gratis: **50 pesan/hari** per user (di-refresh tiap 00:00 WIB). Setelah habis, user wajib memasukkan API key pribadi.
   - Timeout streaming maksimal 90 detik per respons.
   - Jika provider gagal, sistem fallback ke model gratis berikutnya (mis. Groq → OpenRouter free tier).
   - Semua API key server disimpan sebagai environment variable, TIDAK PERNAH dikirim ke browser.
   - System prompt dikombinasikan: `persona kustom user` + `panduan default AetherChat` + `konteks hasil web search (jika aktif)`.

### C. Riwayat Percakapan & Sidebar
1. **Cara Kerja**:
   - Setiap percakapan baru membuat baris di tabel `conversations` dengan judul otomatis dari 6 kata pertama pesan user.
   - Sidebar kiri menampilkan daftar conversation diurutkan by `is_pinned DESC, updated_at DESC`.
   - User dapat:
     - **Rename**: klik ikon pensil pada hover → edit inline → Enter untuk simpan.
     - **Hapus**: konfirmasi dialog → hapus cascade ke semua `messages` terkait.
     - **Pin/Favorite**: toggle icon pin → conversation naik ke paling atas.
     - **Folder**: klik kanan → "Pindahkan ke folder" → buat folder baru atau pilih folder existing.
     - **Search**: input di atas sidebar, melakukan full-text search (Postgres `tsvector`) pada judul & isi pesan.
     - **Sinkronisasi**: realtime otomatis via Supabase Realtime channel — buka di device lain dan daftar akan update otomatis.
2. **Aturan Sistem**:
   - Judul otomatis bisa diedit manual, maksimal 80 karakter.
   - Hapus bersifat soft delete untuk 30 hari (`deleted_at`), hard delete otomatis via cron.
   - Maksimum 500 conversation per user pada tier gratis untuk mencegah abuse.
   - Folder maksimum 3 level kedalaman.

### D. Upload File & Gambar ke Chat
1. **Cara Kerja**:
   - User menekan ikon klip / drag-and-drop file ke area chat.
   - File di-upload ke Supabase Storage bucket `chat-attachments` dengan path `{user_id}/{conversation_id}/{uuid}.{ext}`.
   - Setelah berhasil, URL publik (temporary signed URL) dan metadata disimpan ke tabel `attachments`.
   - Untuk gambar: preview thumbnail muncul di atas input.
   - Untuk dokumen (PDF/TXT/MD/DOCX): teks diekstrak via library (`pdf-parse` / `mammoth`) lalu di-inject sebagai context ke model AI.
2. **Aturan Sistem**:
   - Batas ukuran: gambar maks 10 MB, dokumen maks 20 MB.
   - Format didukung: `png, jpg, jpeg, webp, gif, pdf, txt, md, docx, csv, json`.
   - Maksimum 5 lampiran per pesan.
   - Signed URL berlaku 1 jam — refresh otomatis saat membuka riwayat lama.
   - File yang dihapus dari chat akan dihapus dari Storage (soft) via trigger Postgres atau cron.

### E. Voice Input (Speech-to-Text)
1. **Cara Kerja**:
   - User menekan ikon mikrofon → browser meminta izin mic.
   - Menggunakan **Web Speech API** (default, gratis) untuk transkripsi langsung di browser.
   - Teks transkrip muncul di kotak input dan bisa diedit sebelum dikirim.
   - Alternatif premium: jika browser tidak mendukung, fallback ke Whisper API via Supabase Edge Function (opsional di v2).
2. **Aturan Sistem**:
   - Bahasa default: Indonesia (`id-ID`), dapat diganti ke `en-US` di Settings.
   - Durasi maksimum per rekaman: 120 detik.
   - User dapat menekan tombol stop untuk mengakhiri sebelum batas waktu.

### F. Web Search / Browsing
1. **Cara Kerja**:
   - User menekan toggle **"Web Search"** di toolbar input (ikon globe).
   - Sistem mengirim query ke **Tavily API** (atau Serper) → mendapatkan top 5 hasil.
   - Hasil di-inject sebagai `tool_result` ke prompt AI.
   - AI merespons dengan sitasi bernomor `[1]`, `[2]`, dst — diklik membuka URL asli.
2. **Aturan Sistem**:
   - Toggle web search tersedia hanya untuk user terdaftar.
   - Hasil pencarian di-cache di Redis/Upstash selama 10 menit untuk query identik.
   - Kuota web search: 20 pencarian/hari dalam tier gratis.

### G. Image Generation
1. **Cara Kerja**:
   - User menekan ikon gambar di toolbar → memilih preset aspect ratio (1:1, 16:9, 9:16).
   - Prompt dari input diubah menjadi request ke provider (DALL·E 3 / Flux Schnell via Groq / OpenRouter image models).
   - Hasil gambar ditampilkan di chat bubble AI dengan tombol "Download" & "Regenerate".
   - Metadata disimpan di tabel `generated_images`.
2. **Aturan Sistem**:
   - Kuota: 5 gambar/hari dalam tier gratis.
   - Maksimal resolusi 1024×1024 untuk tier gratis.
   - Konten yang melanggar moderasi akan ditolak oleh provider.
   - Semua gambar disimpan di Supabase Storage bucket `generated-images`.

### H. Pengaturan Model, API Key Pribadi, & Persona
1. **Cara Kerja**:
   - Di `/settings/models`: user memilih provider (Groq/OpenAI/OpenRouter) + nama model yang ingin dipakai sebagai default.
   - Di `/settings/api-keys`: user memasukkan API key pribadi → disimpan **terenkripsi AES-256-GCM** di kolom `encrypted_key` tabel `user_api_keys`. Key hanya didekripsi di server saat akan memanggil provider.
   - Di `/settings/persona`: user menulis system prompt kustom (misal: "Kamu adalah asisten hukum Indonesia...") maksimal 2000 karakter.
   - Di `/settings/parameters`: slider temperature (0–2), top_p (0–1), max_tokens (256–8192).
2. **Aturan Sistem**:
   - API key pribadi HANYA dipakai jika user mengaktifkan toggle "Gunakan API Key Pribadi Saya" di halaman chat.
   - Enkripsi menggunakan `APP_ENCRYPTION_KEY` (32-byte base64) di env var server.
   - API key tidak pernah dikirim balik ke client setelah disimpan (hanya ditampilkan versi masked: `sk-...XXXX`).
   - Persona hanya berlaku untuk percakapan baru, atau dapat diterapkan retroaktif via tombol "Terapkan ke chat ini".

### I. Ekspor & Manajemen Data
1. **Cara Kerja**:
   - User membuka `/settings/data` atau klik kanan percakapan → "Ekspor".
   - Format ekspor: **Markdown** (`.md`), **JSON** struktur lengkap, atau **PDF** (dengan gaya visual).
   - Ekspor massal: pilih semua atau pilih folder → unduh sebagai ZIP.
   - Hapus akun: mengirimkan email konfirmasi, setelah 48 jam baru dihapus permanen.
2. **Aturan Sistem**:
   - Ekspor massal maksimum 1000 pesan per request.
   - PDF dihasilkan server-side menggunakan `puppeteer` / `@react-pdf/renderer`.
   - File ekspor diberi nama `aetherchat-export-{timestamp}.{ext}`.

### J. Kuota & Pengelolaan Tier Gratis
1. **Cara Kerja**:
   - Setiap pengguna terdaftar memiliki kuota harian yang tercatat di tabel `usage_logs`.
   - Dashboard `/settings/usage` menampilkan progress bar kuota: pesan, image generation, web search.
   - Jika kuota habis, UI menampilkan banner "Kuota harian habis — masukkan API key pribadi untuk lanjut".
2. **Aturan Sistem**:
   - Reset otomatis tiap hari pukul 00:00 WIB (dilakukan via cron Supabase Edge Function atau Postgres `pg_cron`).
   - Kuota default: 50 pesan, 5 image gen, 20 web search per hari.
   - Admin dapat menyesuaikan kuota global dari `/admin/providers`.
   - Abuse detection: jika 1 akun mengirim > 500 request/menit, auto rate-limit dan flag ke admin.

---

## 7. Alur Navigasi & Arsitektur Layout
*Peta navigasi alur halaman dan struktur tata letak (layout).*

### Arsitektur Layout (Persisten)
- **Public Layout**: Header transparan berisi logo AetherChat, navigasi (`Tentang`, `Fitur`, `Harga (Gratis)`, `Login`, `Daftar`) + Footer informatif.
- **Chat Layout**: Sidebar kiri persisten 280px (daftar conversation + tombol "New Chat" + search + folder), Header mini atas (nama percakapan, tombol share & ekspor), Main area chat window, Input composer bawah dengan toolbar (attach, web search, voice, image gen, model picker).
- **Settings Layout**: Sidebar kiri berisi daftar tab settings + main panel kanan, link "Kembali ke Chat" di atas.
- **Admin Layout**: Terpisah dengan sidebar admin khusus, hanya dapat diakses user dengan role `admin` di `profiles.role`.

### Bagan Alur (Flowchart)
```mermaid
flowchart TD
    A[Pengunjung] --> B[Landing Page /]
    B --> C{Sudah Login?}
    C -- Tidak --> D[Login / Register]
    D --> E{Metode}
    E -- Google OAuth --> F[Supabase Auth Callback]
    E -- Email & Password --> G[Verifikasi / Magic Link]
    F --> H[Sesi Dibuat]
    G --> H
    C -- Ya --> H
    H --> I[Chat Utama /chat]
    I --> J{Pilih Aksi}
    J -- New Chat --> K[Buat Conversation Baru]
    J -- Pilih Riwayat --> L[Load /chat/:id]
    J -- Buka Settings --> M[/settings]
    J -- Cari Chat --> N[/search]
    K --> O[Kirim Pesan]
    L --> O
    O --> P{Toggle Aktif?}
    P -- Web Search ON --> Q[Panggil Tavily API]
    P -- Image Gen ON --> R[Panggil Image Provider]
    P -- Voice ON --> S[Web Speech API]
    P -- Attach File --> T[Upload ke Supabase Storage]
    P -- Default --> U[Panggil LLM via AI SDK]
    Q --> U
    R --> V[Tampilkan Gambar di Chat]
    T --> U
    U --> W[Stream Token ke UI]
    W --> X[Simpan Pesan ke Postgres]
    X --> Y{Cek Kuota}
    Y -- Habis --> Z[Banner: Pakai API Key Pribadi]
    Y -- Ada --> I
    M --> AA[Settings Tabs]
    AA --> AB[/settings/models]
    AA --> AC[/settings/api-keys]
    AA --> AD[/settings/persona]
    AA --> AE[/settings/parameters]
    AA --> AF[/settings/usage]
    AA --> AG[/settings/data]
```

---

## 8. Kebutuhan Non-Fungsional (SEO, Keamanan, & Performa)
*Syarat wajib agar website siap rilis ke publik (production-ready).*
- **SEO**:
  - Dynamic `<title>` & meta description di setiap halaman publik (`/`, `/about`, `/privacy`, `/terms`).
  - Open Graph tags + Twitter Card dengan preview image AetherChat.
  - `sitemap.xml` dan `robots.txt` otomatis via `next-sitemap`.
  - Structured data JSON-LD tipe `SoftwareApplication` di landing page.
  - Halaman chat & settings di-`noindex` (tidak boleh terindeks mesin pencari).
- **Keamanan**:
  - Semua panggilan AI (OpenAI/Groq/OpenRouter) **hanya boleh lewat Server Actions / Route Handlers** — tidak pernah dari browser.
  - API key provider disimpan hanya di environment variable server; API key user dienkripsi AES-256-GCM di database.
  - **Row Level Security (RLS)** aktif di SEMUA tabel Supabase — user hanya bisa membaca/mengedit row miliknya sendiri (`auth.uid() = user_id`).
  - Validasi input dengan **Zod** di setiap Server Action & Route Handler.
  - Sanitasi HTML output Markdown AI menggunakan `DOMPurify` + `rehype-sanitize`.
  - Proteksi CSRF otomatis via Next.js Server Actions + SameSite cookies.
  - Rate limiting di Route Handler `/api/chat` menggunakan **Upstash Ratelimit** (sliding window 30 req/menit/user).
  - Header keamanan wajib: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy` ketat.
  - Audit log di tabel `admin_logs` untuk semua aksi user penting (hapus akun, upgrade, ban).
- **Performa**:
  - Gunakan `next/image` untuk gambar landing page & avatar.
  - Lazy load komponen berat (`MarkdownRenderer`, `CodeHighlighter`, `ImageGallery`) dengan `dynamic(() => import(...), { ssr: false })`.
  - Virtualisasi daftar panjang (ribuan pesan) menggunakan `@tanstack/react-virtual`.
  - Streaming response menggunakan **Vercel AI SDK** + Edge Runtime agar TTFT rendah.
  - Cache hasil web search di **Upstash Redis** (10 menit TTL).
  - Database index: `messages(conversation_id, created_at)`, `conversations(user_id, updated_at)`, full-text search index `to_tsvector('simple', title || ' ' || content)`.
  - Optimasi gambar chat menggunakan `next/image` dengan `sizes` yang tepat.

---

## 9. Panduan Bahasa, Copywriting, & Data Dummy
*Panduan nada bicara (Tone of Voice) dan contoh data agar prototipe terasa nyata.*
- **Gaya Bahasa**: Profesional, hangat, dan futuristik ringan — sapa pengguna dengan "Anda" dan "Kamu" (di chat AI gunakan "Kamu" agar terasa personal, slogan marketing gunakan "Anda"). Hindari istilah teknis di landing page, gunakan analogi sederhana untuk fitur teknis.
- **Instruksi Data Dummy**: JANGAN PERNAH MENGGUNAKAN "Lorem Ipsum". Selalu gunakan data dummy berbahasa Indonesia yang relevan dengan konteks aplikasi.
- **Contoh Data Dummy**:

  **User Profil**:
  - Nama: Rizky Pratama, email: `rizky.pratama@example.id`, avatar: `https://i.pravatar.cc/150?u=rizky`.
  - Nama: Siti Nurhaliza, email: `siti.n@example.id`, avatar: `https://i.pravatar.cc/150?u=siti`.

  **Judul Percakapan Dummy**:
  - "Strategi Content Marketing untuk Startup B2B 2025"
  - "Cara Perbaiki Error TypeError: Cannot read property"
  - "Rencana Makanan Sehat 7 Hari untuk Diet Rendah Karbo"
  - "Ide Nama Brand Kopi Lokal yang Unik"
  - "Ringkas Paper AI Terbaru tentang Retrieval-Augmented Generation"

  **Pesan Dummy di Chat**:
  - **User**: "Berikan saya 5 ide judul konten Instagram untuk brand skincare organik."
  - **AetherChat AI**: "Tentu! Ini 5 ide judul konten Instagram untuk brand skincare organik Anda: **1)** \"5 Bahan Alami Lokal yang Ampuh Mengatasi Jerawat Tanpa Efek Samping\", **2)** ..."

  **Contoh Prompt Placeholder Input**:
  - "Tanya apa saja ke AetherChat — coba \"Buatkan pitch deck startup fintech\"..."

  **Persona Dummy**:
  - "Kamu adalah asisten hukum Indonesia yang ramah, ringkas, dan selalu menjelaskan dasar hukum (UU/PP) pada setiap jawaban."

  **Folder Dummy**:
  - "Skripsi Kuliah", "Kerjaan Startup", "Kesehatan & Diet", "Random Ide".

---

## 10. Fondasi Teknis (Untuk Tim Pengembang / Programmer & AI)
*Petunjuk arsitektur teknis spesifik.*
- **Bahasa & Framework**: Next.js 15 (App Router, React 19, TypeScript strict mode, Server Actions, Route Handlers, Edge Runtime untuk streaming).
- **Tampilan Antarmuka (UI)**: Tailwind CSS v4 + shadcn/ui + Radix UI primitives + Lucide Icons + Framer Motion untuk animasi + `react-markdown` + `rehype-highlight` + `rehype-sanitize` + `shiki` untuk code highlighting.
- **Autentikasi**: **Supabase Auth** dengan provider Google OAuth + Email/Password + Magic Link. Middleware `@supabase/ssr` untuk refresh session.
- **Basis Data (Database)**: **Supabase PostgreSQL** dengan Row Level Security (RLS), `pg_cron` untuk reset kuota harian, `pgvector` (opsional v2 untuk embedding), full-text search (tsvector) untuk pencarian chat.
- **Storage**: **Supabase Storage** dengan bucket privat `chat-attachments` untuk file/gambar dan `generated-images` untuk hasil image AI. Policy RLS via `storage.objects`.
- **AI Integration**: **Vercel AI SDK** (`ai` package) untuk `streamText` + `generateImage` + tool calling (web search). Provider via `@ai-sdk/openai`, `@ai-sdk/groq`, `@ai-sdk/openrouter`.
- **Web Search**: Tavily API atau Serper.dev sebagai tool call.
- **Rate Limiting**: **Upstash Redis + @upstash/ratelimit** (sliding window).
- **PDF Export**: `@react-pdf/renderer` server-side atau Playwright HTML-to-PDF.
- **Validasi**: Zod + React Hook Form.
- **Testing**: Vitest (unit), Playwright (E2E).
- **Deployment**: Vercel (recommended) atau Docker + VPS.

### Struktur Skema Database Nyata (Supabase PostgreSQL)
*Jalankan via Supabase SQL Editor atau sebagai file migrasi `supabase/migrations/0001_init.sql`.*

```sql
-- =========================================================
-- AETHERCHAT DATABASE SCHEMA (Supabase PostgreSQL)
-- =========================================================

-- Ekstensi
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_cron";

-- =========================================================
-- 1. PROFILES (extends auth.users)
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  locale text not null default 'id-ID',
  theme text not null default 'dark' check (theme in ('dark','light','system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2. USER SETTINGS
-- =========================================================
create table public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  default_provider text not null default 'groq' check (default_provider in ('groq','openai','openrouter')),
  default_model text not null default 'llama-3.3-70b-versatile',
  system_prompt text default '',
  temperature numeric(3,2) not null default 0.7 check (temperature >= 0 and temperature <= 2),
  top_p numeric(3,2) not null default 1.0 check (top_p > 0 and top_p <= 1),
  max_tokens integer not null default 2048 check (max_tokens between 256 and 8192),
  presence_penalty numeric(3,2) not null default 0,
  frequency_penalty numeric(3,2) not null default 0,
  use_byok boolean not null default false,
  web_search_enabled boolean not null default false,
  voice_locale text not null default 'id-ID',
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 3. USER API KEYS (BYOK — Encrypted)
-- =========================================================
create table public.user_api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  provider text not null check (provider in ('groq','openai','openrouter')),
  encrypted_key text not null,   -- AES-256-GCM ciphertext
  key_hint text not null,        -- contoh: "sk-...Xk2Q"
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

-- =========================================================
-- 4. FOLDERS (Kategori percakapan)
-- =========================================================
create table public.folders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 60),
  color text default 'violet',
  icon text default 'folder',
  parent_id uuid references public.folders(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 5. CONVERSATIONS
-- =========================================================
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null default 'Percakapan Baru',
  model text not null default 'llama-3.3-70b-versatile',
  provider text not null default 'groq' check (provider in ('groq','openai','openrouter','image')),
  is_pinned boolean not null default false,
  is_favorite boolean not null default false,
  shared_token text unique,       -- untuk share link publik (optional v2)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz          -- soft delete 30 hari
);
create index idx_conversations_user_updated on public.conversations(user_id, updated_at desc) where deleted_at is null;
create index idx_conversations_folder on public.conversations(folder_id);

-- =========================================================
-- 6. MESSAGES
-- =========================================================
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null default '',
  model text,
  provider text,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  total_tokens integer default 0,
  finish_reason text,             -- 'stop','length','tool_calls', dll
  duration_ms integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index idx_messages_conv_created on public.messages(conversation_id, created_at asc);
create index idx_messages_search on public.messages using gin (to_tsvector('simple', content));

-- =========================================================
-- 7. ATTACHMENTS (File & gambar yang diupload ke chat)
-- =========================================================
create table public.attachments (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_type text not null,        -- mime type
  file_size integer not null,     -- bytes
  storage_path text not null,     -- path di Supabase Storage
  public_url text,
  extracted_text text,            -- hasil OCR/PDF parse (nullable)
  created_at timestamptz not null default now()
);

-- =========================================================
-- 8. GENERATED IMAGES
-- =========================================================
create table public.generated_images (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  prompt text not null,
  provider text not null,
  model text not null,
  aspect_ratio text default '1:1',
  storage_path text not null,
  public_url text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 9. WEB SEARCH RESULTS (Referensi/sitasi)
-- =========================================================
create table public.web_search_results (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid not null references public.messages(id) on delete cascade,
  query text not null,
  url text not null,
  title text not null,
  snippet text,
  rank integer default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 10. USAGE LOGS (Kuota harian)
-- =========================================================
create table public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null default current_date,
  message_count integer not null default 0,
  image_gen_count integer not null default 0,
  web_search_count integer not null default 0,
  tokens_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_date)
);

-- =========================================================
-- 11. ADMIN LOGS (Audit Trail)
-- =========================================================
create table public.admin_logs (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid not null references public.profiles(id) on delete set null,
  action text not null,           -- 'ban_user','unban_user','update_quota', dll
  target_type text,               -- 'user','provider','conversation'
  target_id uuid,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- =========================================================
-- TRIGGERS: auto create profile & settings saat signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update updated_at otomatis
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_conversations_updated before update on public.conversations
  for each row execute procedure public.touch_updated_at();

create trigger trg_settings_updated before update on public.user_settings
  for each row execute procedure public.touch_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) — SEMUA TABEL
-- =========================================================
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_api_keys enable row level security;
alter table public.folders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.attachments enable row level security;
alter table public.generated_images enable row level security;
alter table public.web_search_results enable row level security;
alter table public.usage_logs enable row level security;
alter table public.admin_logs enable row level security;

-- Profiles: user hanya bisa lihat/update dirinya sendiri
create policy "profiles_self_read" on public.profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update using (auth.uid() = id);

-- User settings: self only
create policy "settings_self_all" on public.user_settings for all using (auth.uid() = user_id);

-- API keys: self only
create policy "api_keys_self_all" on public.user_api_keys for all using (auth.uid() = user_id);

-- Folders: self only
create policy "folders_self_all" on public.folders for all using (auth.uid() = user_id);

-- Conversations: self only
create policy "conv_self_all" on public.conversations for all using (auth.uid() = user_id);

-- Messages: hanya pemilik conversation
create policy "messages_self_all" on public.messages for all
  using (auth.uid() = user_id);

-- Attachments: self only
create policy "attachments_self_all" on public.attachments for all using (auth.uid() = user_id);

-- Generated images: self only
create policy "genimg_self_all" on public.generated_images for all using (auth.uid() = user_id);

-- Web search results: hanya untuk message milik user
create policy "websearch_self_read" on public.web_search_results for select
  using (exists (select 1 from public.messages m where m.id = message_id and m.user_id = auth.uid()));

-- Usage logs: self read, server write
create policy "usage_self_read" on public.usage_logs for select using (auth.uid() = user_id);

-- Admin logs: hanya admin
create policy "admin_logs_admin_only" on public.admin_logs for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- =========================================================
-- STORAGE POLICIES (bucket: chat-attachments, generated-images)
-- =========================================================
insert into storage.buckets (id, name, public)
values ('chat-attachments', 'chat-attachments', false),
       ('generated-images', 'generated-images', false)
on conflict do nothing;

create policy "attachments_own_read" on storage.objects for select
  using (bucket_id = 'chat-attachments' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "attachments_own_write" on storage.objects for insert
  with check (bucket_id = 'chat-attachments' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "genimg_own_read" on storage.objects for select
  using (bucket_id = 'generated-images' and (auth.uid())::text = (storage.foldername(name))[1]);

create policy "genimg_own_write" on storage.objects for insert
  with check (bucket_id = 'generated-images' and (auth.uid())::text = (storage.foldername(name))[1]);

-- =========================================================
-- CRON: reset kuota harian
-- =========================================================
select cron.schedule(
  'reset_daily_quota',
  '0 17 * * *', -- 00:00 WIB (UTC+7) = 17:00 UTC
  $$ insert into public.usage_logs (user_id, usage_date)
     select id, current_date from public.profiles
     on conflict (user_id, usage_date) do nothing; $$
);
```

### Struktur Folder Proyek (Next.js 15 App Router)
```
aetherchat/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── page.tsx                 # Landing
│   │   │   ├── about/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (chat)/
│   │   │   ├── chat/page.tsx
│   │   │   ├── chat/[id]/page.tsx
│   │   │   └── search/page.tsx
│   │   ├── (user)/settings/
│   │   │   ├── general/page.tsx
│   │   │   ├── models/page.tsx
│   │   │   ├── api-keys/page.tsx
│   │   │   ├── persona/page.tsx
│   │   │   ├── parameters/page.tsx
│   │   │   ├── usage/page.tsx
│   │   │   └── data/page.tsx
│   │   ├── (admin)/admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── users/page.tsx
│   │   │   ├── providers/page.tsx
│   │   │   └── logs/page.tsx
│   │   ├── auth/callback/route.ts
│   │   ├── api/
│   │   │   ├── chat/route.ts           # Stream AI (Edge)
│   │   │   ├── image-gen/route.ts
│   │   │   ├── web-search/route.ts
│   │   │   ├── upload/route.ts
│   │   │   └── export/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── actions/                        # Server Actions
│   │   ├── auth.ts
│   │   ├── conversations.ts
│   │   ├── messages.ts
│   │   ├── folders.ts
│   │   ├── settings.ts
│   │   └── api-keys.ts
│   ├── components/
│   │   ├── ui/                         # shadcn components
│   │   ├── chat/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── StreamingCursor.tsx
│   │   │   └── ToolbarButtons.tsx
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── FolderTree.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── settings/
│   │   ├── landing/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── ai/
│   │   │   ├── providers.ts
│   │   │   ├── tools.ts
│   │   │   └── system-prompt.ts
│   │   ├── crypto.ts                   # AES-256-GCM encrypt/decrypt
│   │   ├── validators/                 # Zod schemas
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useConversations.ts
│   │   ├── useSpeechRecognition.ts
│   │   └── useUsage.ts
│   ├── types/
│   │   └── database.ts                 # Supabase generated types
│   └── middleware.ts
├── supabase/
│   ├── migrations/0001_init.sql
│   └── config.toml
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── components.json
├── tsconfig.json
└── package.json
```

### Variabel Lingkungan (`.env.example`)
```env
# =========================================================
# APP
# =========================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AetherChat
NODE_ENV=development

# =========================================================
# SUPABASE
# =========================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# =========================================================
# ENCRYPTION (untuk API Key BYOK)
# Generate: openssl rand -base64 32
# =========================================================
APP_ENCRYPTION_KEY=base64_32_byte_key_here

# =========================================================
# AI PROVIDER KEYS (Default/free tier)
# =========================================================
GROQ_API_KEY=gsk_xxxx
OPENAI_API_KEY=sk-xxxx
OPENROUTER_API_KEY=sk-or-xxxx

# Model default yang tersedia gratis
DEFAULT_FREE_PROVIDER=groq
DEFAULT_FREE_MODEL=llama-3.3-70b-versatile

# =========================================================
# WEB SEARCH
# =========================================================
TAVILY_API_KEY=tvly-xxxx
# atau
SERPER_API_KEY=xxxx

# =========================================================
# IMAGE GENERATION
# =========================================================
IMAGE_PROVIDER=openai
IMAGE_MODEL=dall-e-3

# =========================================================
# RATE LIMITING (Upstash)
# =========================================================
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxx

# =========================================================
# KUOTA GRATIS HARIAN
# =========================================================
FREE_DAILY_MESSAGES=50
FREE_DAILY_IMAGE_GEN=5
FREE_DAILY_WEB_SEARCH=20
```

---

## 11. Tahapan Pengerjaan & Task Breakdown (Actionable Work Breakdown Structure)
*Daftar tugas terstruktur dan terurut (Atomic Tasks) dengan format checklist markdown `- [ ] **Task X.Y**`. Dirancang khusus agar pengguna dapat menginstruksikan AI Coding Assistant (Antigravity, Cursor, Claude Code, Roo Code, dll.) untuk mengeksekusi proyek langkah demi langkah secara terukur, modular, dan bebas dari kehabisan context window.*

### Tahap 1: Fondasi Proyek, UI/UX, & Semua Halaman (Dummy Data)
*Tujuan: Membangun seluruh antarmuka visual secara 100% lengkap dan responsif menggunakan data dummy sebelum menyentuh database.*
- [ ] **Task 1.1 (Foundations & Design System)**: Setup proyek Next.js 15 + TypeScript strict, Tailwind CSS v4, shadcn/ui, konfigurasi CSS variable token warna dark-mode (violet `hsl(258,89%,66%)` accent), font **Geist Sans** + **Geist Mono**, install Lucide Icons & Framer Motion, dan instalasi base components (`Button`, `Card`, `Input`, `Dialog`, `Table`, `Badge`, `Dropdown`, `Tabs`, `Tooltip`, `Avatar`, `Skeleton`, `ScrollArea`, `Switch`, `Slider`, `Sheet`, `Separator`).
- [ ] **Task 1.2 (Layouts & Persistent Navigation)**: Buat `(public)/layout.tsx` dengan transparan Header (logo gradient + nav `Tentang`/`Fitur`/`Login`/`Daftar`) + Footer; `(chat)/layout.tsx` dengan Sidebar kiri persisten 280px + Header mini atas (judul chat + tombol ekspor/share) + drawer responsif untuk mobile; `(user)/settings/layout.tsx` dengan sidebar tab settings; `(admin)/admin/layout.tsx` dengan sidebar admin. Sertakan animasi Framer Motion untuk buka/tutup sidebar.
- [ ] **Task 1.3 (Public Pages Dummy)**: Buat halaman `/` (Landing: hero gradient dengan tagline "Chat dengan AI terbaik, gratis selamanya", mini demo chat interaktif, grid fitur unggulan, screenshot mockup, FAQ accordion, CTA), `/about`, `/privacy`, `/terms`, `/login`, `/register` — semua dengan copywriting Bahasa Indonesia, data dummy, dan animasi halus.
- [ ] **Task 1.4 (Chat Interface & Welcome Screen)**: Buat halaman `/chat` (welcome screen "Mulai percakapan baru" bergaya Grok dengan suggested prompts) dan `/chat/[id]` (chat window). Buat komponen `ChatWindow.tsx`, `MessageBubble.tsx` (user align kanan rounded-2xl, AI full-width tanpa bubble), `MarkdownRenderer.tsx` (react-markdown + rehype-sanitize + rehype-highlight/shiki), `CodeBlock.tsx` (header bahasa + tombol copy), `ChatInput.tsx` (textarea auto-resize + toolbar attach/globe/mic/image/model-picker + tombol kirim glow), dan `StreamingCursor.tsx` (cursor berkedip "▌"). Gunakan dummy data streaming simulasi 20 pesan contoh.
- [ ] **Task 1.5 (Sidebar & Conversation Management UI)**: Buat `Sidebar.tsx`, `ConversationList.tsx`, `FolderTree.tsx`, `SearchBar.tsx`. Lengkapi fitur dummy: tombol "New Chat" besar di atas, item chat dengan hover (ikon Rename/Hapus/Pin/Folder), folder collapsible, pencarian judul live filter, konfirmasi dialog hapus, dan menu konteks klik kanan. Gunakan mock array 15 percakapan + 4 folder.
- [ ] **Task 1.6 (Settings Pages Dummy)**: Buat seluruh halaman `/settings/general`, `/settings/models` (kartu pilih model dengan logo provider), `/settings/api-keys` (form dengan input masked + hint card), `/settings/persona` (textarea besar + preset template), `/settings/parameters` (slider temperature/top_p/max_tokens), `/settings/usage` (progress bar kuota harian + grafik dummy), `/settings/data` (tombol ekspor MD/JSON/PDF + danger zone hapus akun) — semua dengan mock state interaktif.
- [ ] **Task 1.7 (Admin & Search Pages Dummy)**: Buat `/search` (full-text search UI dengan hasil grouped & highlighted), `/admin/dashboard` (4 stat card + chart dummy), `/admin/users` (tabel user + filter + aksi ban), `/admin/providers` (form konfigurasi model aktif + kuota global), `/admin/logs` (tabel log dengan filter). Semua dummy.

### Tahap 2: Database, Autentikasi, & Integrasi AI Dasar
*Tujuan: Menghidupkan aplikasi dengan database Supabase nyata, sistem autentikasi, dan streaming AI.*
- [ ] **Task 2.1 (Supabase Setup & Database Schema)**: Buat proyek Supabase, jalankan migrasi `supabase/migrations/0001_init.sql` (11 tabel: `profiles`, `user_settings`, `user_api_keys`, `folders`, `conversations`, `messages`, `attachments`, `generated_images`, `web_search_results`, `usage_logs`, `admin_logs`) lengkap dengan triggers `handle_new_user` + `touch_updated_at` + RLS policies + storage buckets + pg_cron reset kuota. Generate TypeScript types dari Supabase CLI (`supabase gen types typescript`) dan buat script seed data awal.
- [ ] **Task 2.2 (Authentication Multi-Login)**: Konfigurasi Supabase Auth (Google OAuth + Email/Password + Magic Link), buat helper `lib/supabase/client.ts` & `server.ts` dengan `@supabase/ssr`, buat halaman `/login` & `/register` yang berfungsi, route handler `/auth/callback/route.ts`, dan `middleware.ts` untuk melindungi `/chat`, `/settings`, `/admin` + auto-refresh session. Uji login via Google dan email.
- [ ] **Task 2.3 (Server Actions CRUD Chat & Folder)**: Buat Server Actions di `actions/conversations.ts` (create, update title, pin, move folder, soft delete), `actions/messages.ts` (create user message, save assistant response, get paginated), `actions/folders.ts` (CRUD folder), `actions/settings.ts` (update user settings), `actions/api-keys.ts` (encrypt dengan AES-256-GCM via `lib/crypto.ts`, save, delete). Validasi semua input dengan Zod.
- [ ] **Task 2.4 (AI Streaming Integration)**: Buat Route Handler `/api/chat/route.ts` dengan Vercel AI SDK (`streamText`) + provider `@ai-sdk/groq` sebagai default, support `@ai-sdk/openai` dan `@ai-sdk/openrouter`. Implementasi: (a) system prompt builder dari `persona + default`, (b) fallback chain antar provider, (c) auto-save pesan assistant setelah stream selesai + update token usage, (d) rate limit Upstash, (e) cek kuota harian dari `usage_logs`. Frontend: `useChat` hook dari `@ai-sdk/react`, cursor berkedip, handle error & abort.
- [ ] **Task 2.5 (Frontend Data Binding & Mutations)**: Hubungkan seluruh halaman dari Tahap 1 ke Server Actions — sidebar load conversation real, klik chat load `/chat/[id]` dengan messages dari DB, kirim pesan streaming real, rename/pin/delete/move folder berfungsi, search full-text via Postgres `tsvector` berfungsi, settings save ke `user_settings`, API keys save terenkripsi. Hapus semua dummy data.

### Tahap 3: Fitur Lanjutan (Multimodal, Tools, & Ekspor)
*Tujuan: Menambahkan kapabilitas multimodal dan fitur pembeda AetherChat.*
- [ ] **Task 3.1 (File & Image Upload ke Chat)**: Buat Route Handler `/api/upload/route.ts` (upload ke Supabase Storage bucket `chat-attachments` dengan path `{user_id}/{conversation_id}/{uuid}`), simpan metadata ke tabel `attachments`, ekstraksi teks PDF via `pdf-parse` & DOCX via `mammoth`, preview thumbnail di ChatInput, inject extracted text ke prompt AI, dan signed URL refresh otomatis.
- [ ] **Task 3.2 (Voice Input Speech-to-Text)**: Buat hook `useSpeechRecognition.ts` dengan Web Speech API (`id-ID` default, toggle ke `en-US` di settings), UI tombol mic dengan indikator gelombang suara, live transcript ke textarea, batas 120 detik, dan tombol stop.
- [ ] **Task 3.3 (Image Generation)**: Buat Route Handler `/api/image-gen/route.ts` yang memanggil `generateImage` dari AI SDK (DALL·E 3 / Flux via provider), simpan hasil ke Storage `generated-images` + tabel `generated_images`, render di chat bubble AI dengan tombol Download & Regenerate, dan cek kuota harian.
- [ ] **Task 3.4 (Web Search Tool)**: Buat Route Handler `/api/web-search/route.ts` yang memanggil Tavily API (fallback Serper), integrasikan sebagai tool calling di `lib/ai/tools.ts`, simpan sitasi ke `web_search_results`, cache hasil 10 menit di Upstash Redis, tampilkan sitasi bernomor `[1]` di bawah jawaban AI yang bisa diklik.
- [ ] **Task 3.5 (Ekspor Chat Markdown/PDF/JSON)**: Buat Route Handler `/api/export/route.ts` yang menghasilkan file Markdown (raw), JSON (full struktur), PDF (via `@react-pdf/renderer` dengan styling AetherChat dark theme), dukung ekspor single chat & bulk ZIP (folder/multi pilih), download otomatis dengan nama `aetherchat-export-{timestamp}.{ext}`.
- [ ] **Task 3.6 (Realtime Sync antar Device)**: Aktifkan Supabase Realtime pada tabel `conversations` & `messages`, subscribe di sidebar & chat window, sehingga perubahan (rename, pesan baru, pin) sinkron instan di semua tab/device yang logged in.

### Tahap 4: Keamanan, SEO, Testing, & Deployment
*Tujuan: Menyempurnakan keamanan, performa, dan rilis ke production.*
- [ ] **Task 4.1 (Security Hardening & SEO)**: Pasang header keamanan di `next.config.ts` (CSP, X-Frame-Options, dsb), sanitasi Markdown output DOM (verifikasi `rehype-sanitize` + DOMPurify), validasi Zod di semua endpoint, dynamic metadata `<title>`/`og:image`/JSON-LD di halaman publik, `noindex` di halaman privat, generate `sitemap.xml` + `robots.txt` via `next-sitemap`, aktifkan Supabase Auth rate limiting, tambahkan audit log ke `admin_logs`.
- [ ] **Task 4.2 (Performance & Optimization)**: Lazy load komponen berat (`MarkdownRenderer`, `CodeBlock`, `ImageGallery`) via `next/dynamic`, virtualisasi daftar pesan panjang dengan `@tanstack/react-virtual`, optimasi gambar landing dengan `next/image`, aktifkan HTTP caching untuk data statis, review query Postgres dengan `EXPLAIN ANALYZE` dan tambah index jika perlu, hasil Lighthouse target Performance ≥ 90 dan Accessibility ≥ 90.
- [ ] **Task 4.3 (End-to-End Testing & Bugfix)**: Tulis test E2E Playwright untuk alur: (a) daftar akun baru → chat → dapat respons AI, (b) rename + pin + hapus + pindah folder, (c) upload gambar & dokumen, (d) image generation, (e) web search, (f) ganti model & system prompt di settings, (g) ekspor chat, (h) cek kuota habis → banner BYOK. Uji responsif mobile (drawer sidebar) & perbaiki semua bug, error konsol, dan edge case (streaming putus, upload gagal, auth expired).
- [ ] **Task 4.4 (Production Build & Deployment)**: Konfigurasi `.env.production` dengan semua secret di Vercel Environment Variables, verifikasi `npm run build` sukses tanpa warning, aktifkan Edge Runtime pada `/api/chat`, deploy ke Vercel (recommended) atau Docker + VPS, setup Supabase production project terpisah, aktifkan Supabase backups & pg_cron di production, uji smoke test di URL produksi, dan generate dokumentasi `README.md` berisi 4 poin (stack, cara jalan, cara atur API key, fitur aktif).

---

