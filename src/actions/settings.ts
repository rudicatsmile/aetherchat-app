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

export async function getUserProfileAction() {
  try {
    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        id: "",
        email: "",
        fullName: "",
        avatarUrl: "",
        locale: "id-ID",
        theme: "dark",
        role: "user",
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email || "",
      fullName:
        profile?.full_name ||
        user.user_metadata?.full_name ||
        (user.email ? user.email.split("@")[0] : "Pengguna"),
      avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || "",
      locale: profile?.locale || "id-ID",
      theme: profile?.theme || "dark",
      role: profile?.role || "user",
    };
  } catch {
    return {
      id: "",
      email: "",
      fullName: "",
      avatarUrl: "",
      locale: "id-ID",
      theme: "dark",
      role: "user",
    };
  }
}

export async function updateUserProfileAction(data: {
  fullName?: string;
  locale?: string;
  theme?: string;
  avatarUrl?: string;
}) {
  try {
    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Anda belum login." };
    }

    const updateData: Record<string, unknown> = {};
    if (data.fullName !== undefined) updateData.full_name = data.fullName;
    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.theme !== undefined) updateData.theme = data.theme;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl;

    const { error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id);

    if (error) {
      return { error: error.message };
    }

    // Also sync user metadata in Supabase Auth
    await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
        avatar_url: data.avatarUrl,
      },
    });

    revalidatePath("/", "layout");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui profil";
    return { error: msg };
  }
}

export async function getUserUsageAction() {
  try {
    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Calculate hours remaining until midnight WIB (UTC+7)
    const now = new Date();
    const utcHours = now.getUTCHours();
    const wibHours = (utcHours + 7) % 24;
    const resetHoursRemaining = Math.max(1, 24 - wibHours);

    const defaultLimits = {
      messagesLimit: 50,
      imageGenLimit: 5,
      webSearchLimit: 20,
      resetHoursRemaining,
    };

    if (!user) {
      return {
        messagesUsed: 0,
        imageGenUsed: 0,
        webSearchUsed: 0,
        ...defaultLimits,
        weeklyStats: [
          { day: "Sen", messages: 0 },
          { day: "Sel", messages: 0 },
          { day: "Rab", messages: 0 },
          { day: "Kam", messages: 0 },
          { day: "Jum", messages: 0 },
          { day: "Sab", messages: 0 },
          { day: "Min", messages: 0 },
        ],
      };
    }

    const todayStr = new Date().toISOString().split("T")[0];

    // Today's usage
    const { data: todayUsage } = await supabase
      .from("usage_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("usage_date", todayStr)
      .single();

    // Last 7 days usage for weekly trend
    const { data: weeklyLogs } = await supabase
      .from("usage_logs")
      .select("usage_date, message_count")
      .eq("user_id", user.id)
      .order("usage_date", { ascending: true })
      .limit(7);

    // Build last 7 days array
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const weeklyStats = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const found = (weeklyLogs || []).find((log: any) => log.usage_date === dateKey);
      weeklyStats.push({
        day: dayNames[d.getDay()],
        messages: found ? found.message_count : 0,
      });
    }

    return {
      messagesUsed: todayUsage?.message_count || 0,
      imageGenUsed: todayUsage?.image_gen_count || 0,
      webSearchUsed: todayUsage?.web_search_count || 0,
      ...defaultLimits,
      weeklyStats,
    };
  } catch {
    return {
      messagesUsed: 0,
      messagesLimit: 50,
      imageGenUsed: 0,
      imageGenLimit: 5,
      webSearchUsed: 0,
      webSearchLimit: 20,
      resetHoursRemaining: 12,
      weeklyStats: [
        { day: "Sen", messages: 0 },
        { day: "Sel", messages: 0 },
        { day: "Rab", messages: 0 },
        { day: "Kam", messages: 0 },
        { day: "Jum", messages: 0 },
        { day: "Sab", messages: 0 },
        { day: "Min", messages: 0 },
      ],
    };
  }
}

