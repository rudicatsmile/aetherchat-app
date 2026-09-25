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
    } = await req.json();

    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    let customApiKey: string | undefined = undefined;
    let customPersona: string | undefined = undefined;

    // Check if user has BYOK and persona enabled
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
            // fallback
          }
        }
      }
    }

    const system = buildSystemPrompt(customPersona);

    // Check if real provider API key is present
    const envKey =
      provider === "groq"
        ? process.env.GROQ_API_KEY
        : provider === "openai"
        ? process.env.OPENAI_API_KEY
        : process.env.OPENROUTER_API_KEY;

    const hasRealApiKey = Boolean(
      customApiKey || (envKey && !envKey.includes("xxxx") && !envKey.includes("dummy"))
    );

    if (hasRealApiKey) {
      const selectedModel = getAiModel({
        provider: provider as "groq" | "openai" | "openrouter",
        modelId: model,
        customApiKey,
      });

      const result = streamText({
        model: selectedModel,
        system,
        messages,
        tools: webSearch ? { webSearch: webSearchTool } : undefined,
        async onFinish({ text, usage }: any) {
          // Save assistant message to Supabase
          if (user && conversationId) {
            try {
              await supabase.from("messages").insert({
                conversation_id: conversationId,
                user_id: user.id,
                role: "assistant",
                content: text,
                model,
                provider,
                prompt_tokens: usage?.promptTokens || usage?.inputTokens || 0,
                completion_tokens: usage?.completionTokens || usage?.outputTokens || 0,
                total_tokens: usage?.totalTokens || 0,
              });
            } catch {
              // ignore
            }
          }
        },
      });

      return result.toDataStreamResponse();
    }

    // High quality simulated stream for development when API keys are not yet configured in .env.local
    const latestUserMessage = messages[messages.length - 1]?.content || "";
    const simulatedResponse = `Terima kasih atas pertanyaanmu mengenai **"${latestUserMessage}"**!

Berikut penjelasan komprehensif dari AetherChat:
1. **Analisis Kebutuhan**: Model AI memproses query Anda dengan konteks terisolasi dan aman.
2. **Efisiensi Streaming**: Token di-stream secara bertahap untuk menjaga responsivitas antarmuka tanpa buffering.
3. **Kesiapan Ekosistem**: Konfigurasi database Supabase PostgreSQL, enkripsi BYOK, dan streaming Vercel AI SDK telah aktif.

\`\`\`typescript
// Contoh simulasi pipeline AetherChat
export async function processAetherStream(input: string) {
  const stream = await streamText({
    model: getAiModel({ provider: '${provider}', modelId: '${model}' }),
    prompt: input,
  });
  return stream;
}
\`\`\`

Apakah ada poin teknis atau topik lain yang ingin Anda eksplorasi lebih lanjut?`;

    // Stream the text via SSE
    const encoder = new TextEncoder();
    const customReadableStream = new ReadableStream({
      async start(controller) {
        // AI SDK data stream protocol format: 0:"token"
        const chunks = simulatedResponse.split(" ");
        for (const word of chunks) {
          const formatted = `0:${JSON.stringify(word + " ")}\n`;
          controller.enqueue(encoder.encode(formatted));
          await new Promise((r) => setTimeout(r, 25));
        }
        controller.enqueue(
          encoder.encode(
            `d:{"finishReason":"stop","usage":{"promptTokens":20,"completionTokens":120}}\n`
          )
        );
        controller.close();
      },
    });

    return new Response(customReadableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan pada server AI";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
