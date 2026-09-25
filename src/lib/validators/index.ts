import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi minimal 8 karakter")
    .regex(/[a-zA-Z]/, "Harus mengandung setidaknya 1 huruf")
    .regex(/[0-9]/, "Harus mengandung setidaknya 1 angka"),
});

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

export const MagicLinkSchema = z.object({
  email: z.string().email("Format email tidak valid"),
});

export const CreateConversationSchema = z.object({
  title: z.string().min(1).max(120).default("Percakapan Baru"),
  model: z.string().default("llama-3.3-70b-versatile"),
  provider: z.enum(["groq", "openai", "openrouter", "image"]).default("groq"),
  folderId: z.string().uuid().nullable().optional(),
});

export const UpdateConversationTitleSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Judul tidak boleh kosong").max(80),
});

export const MoveConversationFolderSchema = z.object({
  id: z.string(),
  folderId: z.string().nullable(),
});

export const CreateMessageSchema = z.object({
  conversationId: z.string(),
  role: z.enum(["user", "assistant", "system", "tool"]),
  content: z.string().min(1, "Konten pesan tidak boleh kosong"),
  model: z.string().optional(),
  provider: z.string().optional(),
});

export const CreateFolderSchema = z.object({
  name: z.string().min(1, "Nama folder wajib diisi").max(60),
  color: z.string().default("violet"),
  icon: z.string().default("folder"),
  parentId: z.string().uuid().nullable().optional(),
});

export const SaveApiKeySchema = z.object({
  provider: z.enum(["groq", "openai", "openrouter"]),
  apiKey: z.string().min(10, "Kunci API tidak valid"),
});

export const UpdateSettingsSchema = z.object({
  defaultProvider: z.enum(["groq", "openai", "openrouter"]).optional(),
  defaultModel: z.string().optional(),
  systemPrompt: z.string().max(2000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0.01).max(1).optional(),
  maxTokens: z.number().min(256).max(8192).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  useByok: z.boolean().optional(),
  webSearchEnabled: z.boolean().optional(),
  voiceLocale: z.string().optional(),
});
