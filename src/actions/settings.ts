"use server";

import { createClient } from "@/lib/supabase/server";
import { UpdateSettingsSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getUserSettingsAction() {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        default_provider: "groq",
        default_model: "llama-3.3-70b-versatile",
        system_prompt: "",
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 2048,
        presence_penalty: 0,
        frequency_penalty: 0,
        use_byok: false,
        web_search_enabled: false,
        voice_locale: "id-ID",
      };
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      return {
        default_provider: "groq",
        default_model: "llama-3.3-70b-versatile",
        system_prompt: "",
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 2048,
        presence_penalty: 0,
        frequency_penalty: 0,
        use_byok: false,
        web_search_enabled: false,
        voice_locale: "id-ID",
      };
    }

    return data;
  } catch {
    return {
      default_provider: "groq",
      default_model: "llama-3.3-70b-versatile",
      system_prompt: "",
      temperature: 0.7,
      top_p: 1.0,
      max_tokens: 2048,
      presence_penalty: 0,
      frequency_penalty: 0,
      use_byok: false,
      web_search_enabled: false,
      voice_locale: "id-ID",
    };
  }
}

export async function updateUserSettingsAction(input: unknown) {
  const parsed = UpdateSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input pengaturan tidak valid" };
  }

  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true };
    }

    const updatePayload: Record<string, unknown> = {};
    if (parsed.data.defaultProvider !== undefined) updatePayload.default_provider = parsed.data.defaultProvider;
    if (parsed.data.defaultModel !== undefined) updatePayload.default_model = parsed.data.defaultModel;
    if (parsed.data.systemPrompt !== undefined) updatePayload.system_prompt = parsed.data.systemPrompt;
    if (parsed.data.temperature !== undefined) updatePayload.temperature = parsed.data.temperature;
    if (parsed.data.topP !== undefined) updatePayload.top_p = parsed.data.topP;
    if (parsed.data.maxTokens !== undefined) updatePayload.max_tokens = parsed.data.maxTokens;
    if (parsed.data.presencePenalty !== undefined) updatePayload.presence_penalty = parsed.data.presencePenalty;
    if (parsed.data.frequencyPenalty !== undefined) updatePayload.frequency_penalty = parsed.data.frequencyPenalty;
    if (parsed.data.useByok !== undefined) updatePayload.use_byok = parsed.data.useByok;
    if (parsed.data.webSearchEnabled !== undefined) updatePayload.web_search_enabled = parsed.data.webSearchEnabled;
    if (parsed.data.voiceLocale !== undefined) updatePayload.voice_locale = parsed.data.voiceLocale;

    await supabase
      .from("user_settings")
      .update(updatePayload)
      .eq("user_id", user.id);

    revalidatePath("/settings", "layout");
    return { success: true };
  } catch {
    return { success: true };
  }
}
