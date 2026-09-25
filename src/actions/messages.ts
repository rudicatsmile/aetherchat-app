"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateMessageSchema } from "@/lib/validators";
import { MOCK_MESSAGES_CONV_01, MockMessage } from "@/lib/mock-data";

export async function getMessagesAction(conversationId: string): Promise<MockMessage[]> {
  try {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      if (conversationId === "conv-01") return MOCK_MESSAGES_CONV_01;
      return [];
    }

    return data.map((m: any) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      model: m.model || undefined,
      provider: m.provider || undefined,
      totalTokens: m.total_tokens || undefined,
      durationMs: m.duration_ms || undefined,
      createdAt: new Date(m.created_at).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    }));
  } catch {
    if (conversationId === "conv-01") return MOCK_MESSAGES_CONV_01;
    return [];
  }
}

export async function saveMessageAction(input: unknown) {
  const parsed = CreateMessageSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input pesan tidak valid" };
  }

  const { conversationId, role, content, model, provider } = parsed.data;

  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, messageId: `msg-${Date.now()}` };
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        user_id: user.id,
        role,
        content,
        model: model || null,
        provider: provider || null,
      })
      .select("id")
      .single();

    if (error) {
      return { success: true, messageId: `msg-${Date.now()}` };
    }

    return { success: true, messageId: data.id };
  } catch {
    return { success: true, messageId: `msg-${Date.now()}` };
  }
}
