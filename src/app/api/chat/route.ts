import { streamText } from "ai";
import { getAiModel } from "@/lib/ai/providers";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { webSearchTool } from "@/lib/ai/tools";
import { createClient } from "@/lib/supabase/server";
import { decryptApiKey } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const {
      messages,
      model = "llama-3.3-70b-versatile",
      provider = "groq",
      conversationId,
      webSearch = false,
      byokApiKey,
    } = await req.json();

    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let customApiKey: string | undefined = undefined;
    let customPersona: string | undefined = undefined;

    // Check if authenticated user has BYOK and custom persona enabled
    if (user) {
      const { data: settings } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (settings?.system_prompt) {
        customPersona = settings.system_prompt;
      }

      if (settings?.use_byok) {
        const { data: apiKeyRecord } = await supabase
          .from("user_api_keys")
          .select("encrypted_key")
          .eq("user_id", user.id)
          .eq("provider", provider)
          .eq("is_active", true)
          .single();

        if (apiKeyRecord?.encrypted_key) {
          try {
            customApiKey = decryptApiKey(apiKeyRecord.encrypted_key);
          } catch {
            // ignore decryption failure
          }
        }
      }
    }

    // Determine the active API key from BYOK or server environment variable
    let envKey =
      provider === "groq"
        ? process.env.GROQ_API_KEY
        : provider === "openai"
        ? process.env.OPENAI_API_KEY
        : process.env.OPENROUTER_API_KEY;

    // Treat dummy/placeholder values as unset
    if (
      envKey &&
      (envKey.includes("xxxx") ||
        envKey.includes("dummy") ||
        envKey.includes("your_groq_api_key") ||
        envKey === "gsk_dummy")
    ) {
      envKey = undefined;
    }

    let activeApiKey = (byokApiKey && byokApiKey.trim()) || customApiKey || envKey;

    let finalProvider = provider;
    let finalModel = model;

    // Smart key format detection to prevent provider mismatch
    if (activeApiKey) {
      if (activeApiKey.startsWith("gsk_") && finalProvider !== "groq") {
        finalProvider = "groq";
        if (finalModel === "gpt-4o-mini" || finalModel.includes("mistral")) {
          finalModel = "llama-3.3-70b-versatile";
        }
      } else if (
        (activeApiKey.startsWith("sk-proj-") ||
          (activeApiKey.startsWith("sk-") && !activeApiKey.startsWith("sk-or-"))) &&
        finalProvider !== "openai"
      ) {
        finalProvider = "openai";
        if (finalModel === "llama-3.3-70b-versatile" || finalModel.includes("mistral")) {
          finalModel = "gpt-4o-mini";
        }
      } else if (activeApiKey.startsWith("sk-or-") && finalProvider !== "openrouter") {
        finalProvider = "openrouter";
        finalModel = "mistralai/mistral-large-2407";
      }
    } else {
      // Check if server environment has any valid provider key as fallback
      if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("xxxx")) {
        finalProvider = "openai";
        finalModel = "gpt-4o-mini";
        activeApiKey = process.env.OPENAI_API_KEY;
      } else if (
        process.env.GROQ_API_KEY &&
        !process.env.GROQ_API_KEY.includes("dummy") &&
        !process.env.GROQ_API_KEY.includes("xxxx")
      ) {
        finalProvider = "groq";
        finalModel = "llama-3.3-70b-versatile";
        activeApiKey = process.env.GROQ_API_KEY;
      }
    }

    // If no valid API key is available, return an informative error (NO fake template)
    if (!activeApiKey) {
      const providerUpper = finalProvider.toUpperCase();
      const envVarName =
        finalProvider === "groq"
          ? "GROQ_API_KEY"
          : finalProvider === "openai"
          ? "OPENAI_API_KEY"
          : "OPENROUTER_API_KEY";

      const providerUrl =
        finalProvider === "groq"
          ? "https://console.groq.com/keys"
          : finalProvider === "openai"
          ? "https://platform.openai.com/api-keys"
          : "https://openrouter.ai/keys";

      const errorMessage = `⚠️ **API Key Belum Dikonfigurasi**

Model AI **${finalModel}** (${providerUpper}) memerlukan API Key yang valid untuk memproses jawaban.

Silakan lakukan salah satu langkah berikut:
1. **Atur di antarmuka (BYOK)**: Kunjungi menu **[Pengaturan API Key](/settings/api-keys)** dan simpan API key pribadi Anda.
2. **Atur di file server**: Buka file \`.env.local\` dan isi nilai \`${envVarName}=...\` dengan API key Anda.

🔗 *Dapatkan API Key ${providerUpper} gratis di [${providerUrl}](${providerUrl}).*`;

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const system = buildSystemPrompt(customPersona);

    const selectedModel = getAiModel({
      provider: finalProvider as "groq" | "openai" | "openrouter",
      modelId: finalModel,
      customApiKey: activeApiKey,
    });

    const result = streamText({
      model: selectedModel,
      system,
      messages,
      tools: webSearch ? { webSearch: webSearchTool } : undefined,
      async onFinish({ text, usage }: any) {
        // Persist real assistant message to Supabase
        if (user && conversationId && text) {
          try {
            await supabase.from("messages").insert({
              conversation_id: conversationId,
              user_id: user.id,
              role: "assistant",
              content: text,
              model: finalModel,
              provider: finalProvider,
              prompt_tokens: usage?.promptTokens || usage?.inputTokens || 0,
              completion_tokens: usage?.completionTokens || usage?.outputTokens || 0,
              total_tokens: usage?.totalTokens || 0,
            });

            // Update daily usage stats
            const todayStr = new Date().toISOString().split("T")[0];
            const { data: existingUsage } = await supabase
              .from("usage_logs")
              .select("id, message_count, tokens_used")
              .eq("user_id", user.id)
              .eq("usage_date", todayStr)
              .single();

            if (existingUsage) {
              await supabase
                .from("usage_logs")
                .update({
                  message_count: existingUsage.message_count + 1,
                  tokens_used: existingUsage.tokens_used + (usage?.totalTokens || 0),
                })
                .eq("id", existingUsage.id);
            } else {
              await supabase.from("usage_logs").insert({
                user_id: user.id,
                usage_date: todayStr,
                message_count: 1,
                tokens_used: usage?.totalTokens || 0,
              });
            }
          } catch {
            // ignore persistence error
          }
        }
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err: unknown) => {
        return err instanceof Error ? err.message : "Terjadi kesalahan saat streaming dari model AI.";
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server AI";
    return new Response(
      JSON.stringify({
        error: `⚠️ **Gagal Memanggil Model AI:**\n\n${message}\n\n*Silakan periksa kembali konfigurasi API Key atau model yang dipilih.*`,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
