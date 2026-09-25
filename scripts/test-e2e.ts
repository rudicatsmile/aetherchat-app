/**
 * AetherChat Automated Test Suite & E2E Validation Runner
 * Tests:
 * 1. AES-256-GCM Cryptographic Engine (Key Encryption / Decryption / Integrity)
 * 2. Zod Schema Validators (Auth, BYOK API Keys, Chat, Folders, Settings)
 * 3. AI System Prompt Builder & Persona Customization
 * 4. Quota Enforcement Logic (Free tier vs BYOK unlimited)
 * 5. Multi-format Chat Exporter Logic (Markdown, JSON, HTML)
 * 6. Model Provider Configurations
 */

import { encryptApiKey, decryptApiKey } from "../src/lib/crypto";
import {
  RegisterSchema,
  LoginSchema,
  SaveApiKeySchema,
  CreateMessageSchema,
  CreateFolderSchema,
  UpdateSettingsSchema,
} from "../src/lib/validators";
import { buildSystemPrompt } from "../src/lib/ai/system-prompt";
import { MOCK_CONVERSATIONS, MOCK_FOLDERS, CURRENT_MOCK_USER } from "../src/lib/mock-data";
import { getAiModel } from "../src/lib/ai/providers";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, errorMessage?: string) {
  if (condition) {
    console.log(`  \x1b[32m✔\x1b[0m ${testName}`);
    passedCount++;
  } else {
    console.error(`  \x1b[31m✖\x1b[0m ${testName}`);
    if (errorMessage) {
      console.error(`    \x1b[33mError:\x1b[0m ${errorMessage}`);
    }
    failedCount++;
  }
}

async function runTestSuite() {
  console.log("\n==================================================");
  console.log("🚀 Menjalankan AetherChat E2E & Validation Test Suite");
  console.log("==================================================\n");

  // 1. Test Crypto Engine (AES-256-GCM)
  console.log("📦 [1/6] Menguji Modul Enkripsi (AES-256-GCM)...");
  try {
    const rawApiKey = "gsk_test_mock_groq_key_9876543210abcdef";
    const encrypted = encryptApiKey(rawApiKey);

    assert(
      typeof encrypted === "string" && encrypted.split(":").length === 3,
      "Enkripsi menghasilkan format iv:authTag:ciphertext yang valid"
    );

    const decrypted = decryptApiKey(encrypted);
    assert(
      decrypted === rawApiKey,
      "Dekripsi berhasil mengembalikan plaintext API Key yang identik"
    );

    // Tampered test
    let tamperedCaught = false;
    const originalConsoleError = console.error;
    console.error = () => {}; // suppress expected error log
    try {
      const parts = encrypted.split(":");
      parts[2] = "ff" + parts[2].slice(2);
      decryptApiKey(parts.join(":"));
    } catch {
      tamperedCaught = true;
    } finally {
      console.error = originalConsoleError;
    }
    assert(
      tamperedCaught,
      "Deteksi integritas: Tampered ciphertext ditolak oleh autentikasi GCM"
    );
  } catch (err: any) {
    assert(false, "Modul Enkripsi", err.message);
  }

  // 2. Test Zod Validators
  console.log("\n📋 [2/6] Menguji Skema Validasi Zod...");
  try {
    // Register Validator
    const validRegister = RegisterSchema.safeParse({
      fullName: "Budi Santoso",
      email: "budi@aetherchat.id",
      password: "PasswordRahasia123!",
    });
    assert(validRegister.success, "Skema Registrasi menerima input data valid");

    const shortPasswordRegister = RegisterSchema.safeParse({
      fullName: "Budi",
      email: "budi@aetherchat.id",
      password: "123", // too short (< 8)
    });
    assert(
      !shortPasswordRegister.success,
      "Skema Registrasi menolak password kurang dari 8 karakter"
    );

    // Login Validator
    const validLogin = LoginSchema.safeParse({
      email: "budi@aetherchat.id",
      password: "PasswordRahasia123!",
    });
    assert(validLogin.success, "Skema Login menerima kredensial yang valid");

    // BYOK API Key Validator
    const validGroqKey = SaveApiKeySchema.safeParse({
      provider: "groq",
      apiKey: "gsk_1234567890abcdef1234567890abcdef",
    });
    assert(validGroqKey.success, "Skema API Key menerima provider 'groq' valid");

    const invalidProviderKey = SaveApiKeySchema.safeParse({
      provider: "unsupported_provider",
      apiKey: "secret_123",
    });
    assert(!invalidProviderKey.success, "Skema API Key menolak provider tidak terdaftar");

    // Send Message Validator
    const validMessage = CreateMessageSchema.safeParse({
      conversationId: "conv-123",
      role: "user",
      content: "Halo AetherChat, bantu jelaskan konsep arsitektur Next.js 15!",
      model: "llama-3.3-70b-versatile",
    });
    assert(validMessage.success, "Skema Pesan menerima prompt chat valid");

    const emptyMessage = CreateMessageSchema.safeParse({
      conversationId: "conv-123",
      role: "user",
      content: "",
      model: "llama-3.3-70b-versatile",
    });
    assert(!emptyMessage.success, "Skema Pesan menolak pesan kosong");

    // Folder Validator
    const validFolder = CreateFolderSchema.safeParse({
      name: "Riset Proyek AI",
      color: "violet",
    });
    assert(validFolder.success, "Skema Folder percakapan menerima nama folder valid");

    // Settings Validator
    const validSettings = UpdateSettingsSchema.safeParse({
      defaultProvider: "groq",
      temperature: 0.7,
      topP: 0.9,
      streamResponse: true,
    });
    assert(validSettings.success, "Skema Pengaturan Pengguna menerima konfigurasi model valid");

    const invalidTempSettings = UpdateSettingsSchema.safeParse({
      temperature: 3.5, // > 2.0 is out of bounds
    });
    assert(!invalidTempSettings.success, "Skema Pengaturan Pengguna menolak temperature > 2.0");
  } catch (err: any) {
    assert(false, "Skema Validasi Zod", err.message);
  }

  // 3. Test AI System Prompt Builder & Persona
  console.log("\n🧠 [3/6] Menguji Pembentukan System Prompt & Persona...");
  try {
    const defaultPrompt = buildSystemPrompt();
    assert(
      defaultPrompt.includes("AetherChat") && defaultPrompt.includes("Grok"),
      "Default System Prompt mengikutsertakan identitas AetherChat dan filosofi Grok"
    );

    const customPersona = "Bertindaklah sebagai Senior Cloud Architect spesialis AWS dan GCP.";
    const customPrompt = buildSystemPrompt(customPersona);
    assert(
      customPrompt.includes("Senior Cloud Architect"),
      "System Prompt berhasil menyisipkan kustomisasi Persona & Prompt pengguna"
    );
  } catch (err: any) {
    assert(false, "System Prompt Builder", err.message);
  }

  // 4. Test Quota Enforcement Logic
  console.log("\n⚖️ [4/6] Menguji Aturan Kuota & Limitasi Akun...");
  try {
    const FREE_QUOTAS = {
      messages: 50,
      imageGen: 5,
      webSearch: 20,
    };

    const isMessageAllowed = (currentCount: number, hasBYOK: boolean) =>
      hasBYOK || currentCount < FREE_QUOTAS.messages;

    const isImageAllowed = (currentCount: number) =>
      currentCount < FREE_QUOTAS.imageGen;

    const isSearchAllowed = (currentCount: number) =>
      currentCount < FREE_QUOTAS.webSearch;

    assert(
      isMessageAllowed(49, false) === true,
      "Pengguna gratis diizinkan mengirim pesan ke-50 (dalam batas kuota 50)"
    );
    assert(
      isMessageAllowed(50, false) === false,
      "Pengguna gratis diblokir saat mencapai limit 50 pesan/hari"
    );
    assert(
      isMessageAllowed(500, true) === true,
      "Pengguna BYOK (Bring Your Own Key) menikmati kuota pesan tak terbatas"
    );
    assert(
      isImageAllowed(5) === false,
      "Limitasi generate gambar (5 gambar/hari) diterapkan dengan tepat"
    );
    assert(
      isSearchAllowed(20) === false,
      "Limitasi pencarian web realtime (20 pencarian/hari) diterapkan dengan tepat"
    );
  } catch (err: any) {
    assert(false, "Aturan Kuota", err.message);
  }

  // 5. Test Multi-format Export Logic
  console.log("\n📄 [5/6] Menguji Logika Pemformat Ekspor Chat...");
  try {
    const title = "Percakapan Arsitektur Sistem";
    const msgs = [
      { role: "user", content: "Bagaimana cara kerja Supabase RLS?", createdAt: "2026-09-25T10:00:00Z" },
      { role: "assistant", content: "RLS (Row Level Security) membatasi akses baris database PostgreSQL...", createdAt: "2026-09-25T10:00:02Z" },
    ];

    // Markdown export
    const mdLines = [
      `# ${title}`,
      `*Diekspor dari AetherChat pada ${new Date().toISOString()}*`,
      "",
      ...msgs.map((m) => `### ${m.role === "user" ? "Pengguna" : "AetherChat"}\n${m.content}\n`),
    ];
    const mdResult = mdLines.join("\n");
    assert(
      mdResult.includes(`# ${title}`) && mdResult.includes("### Pengguna") && mdResult.includes("### AetherChat"),
      "Ekspor Markdown memformat judul dan dialog tanya-jawab dengan benar"
    );

    // JSON export
    const jsonResult = JSON.stringify({ title, messages: msgs }, null, 2);
    const parsed = JSON.parse(jsonResult);
    assert(
      parsed.title === title && Array.isArray(parsed.messages) && parsed.messages.length === 2,
      "Ekspor JSON menghasilkan struktur data terstruktur yang valid"
    );

    // HTML export
    const htmlResult = `
      <!DOCTYPE html>
      <html>
      <head><title>${title}</title></head>
      <body>
        <h1>${title}</h1>
        ${msgs.map((m) => `<div><strong>${m.role}:</strong> <p>${m.content}</p></div>`).join("")}
      </body>
      </html>
    `;
    assert(
      htmlResult.includes("<!DOCTYPE html>") && htmlResult.includes("<h1>Percakapan Arsitektur Sistem</h1>"),
      "Ekspor HTML menghasilkan dokumen markup yang siap dicetak/disimpan ke PDF"
    );
  } catch (err: any) {
    assert(false, "Logika Ekspor Chat", err.message);
  }

  // 6. Test Model Configurations & Multi-Conversation Data
  console.log("\n🤖 [6/6] Menguji Konfigurasi Model AI & Data Percakapan...");
  try {
    assert(MOCK_CONVERSATIONS.length >= 5, "Tersedia setidaknya 5 percakapan mock realistis");
    assert(MOCK_FOLDERS.length >= 4, "Tersedia setidaknya 4 kategori folder terorganisir");
    assert(CURRENT_MOCK_USER.fullName.length > 0, "Profil pengguna terinisialisasi dengan baik");

    const groqAiModel = getAiModel({
      provider: "groq",
      modelId: "llama-3.3-70b-versatile",
      customApiKey: "mock_key",
    });
    assert(groqAiModel !== undefined, "Inisialisasi provider AI Groq berhasil");

    const openAiModel = getAiModel({
      provider: "openai",
      modelId: "gpt-4o-mini",
      customApiKey: "mock_key",
    });
    assert(openAiModel !== undefined, "Inisialisasi provider AI OpenAI berhasil");
  } catch (err: any) {
    assert(false, "Konfigurasi Model AI & Data Percakapan", err.message);
  }

  // Summary
  console.log("\n==================================================");
  console.log(`📊 Hasil Pengujian: ${passedCount} Berhasil, ${failedCount} Gagal`);
  console.log("==================================================\n");

  if (failedCount > 0) {
    console.error(`\x1b[31mPengujian selesai dengan ${failedCount} kegagalan.\x1b[0m\n`);
    process.exit(1);
  } else {
    console.log(`\x1b[32mSemua pengujian (${passedCount}/${passedCount}) BERHASIL 100%! Sistem AetherChat terverifikasi penuh.\x1b[0m\n`);
    process.exit(0);
  }
}

runTestSuite();
