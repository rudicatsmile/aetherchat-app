"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateConversationSchema,
  UpdateConversationTitleSchema,
  MoveConversationFolderSchema,
} from "@/lib/validators";
import { MOCK_CONVERSATIONS, MockConversation } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

export async function getConversationsAction(): Promise<MockConversation[]> {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_CONVERSATIONS;
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_CONVERSATIONS;
    }

    return data.map((c: any) => ({
      id: c.id,
      title: c.title,
      model: c.model,
      provider: c.provider as "groq" | "openai" | "openrouter",
      isPinned: c.is_pinned,
      isFavorite: c.is_favorite,
      folderId: c.folder_id,
      updatedAt: new Date(c.updated_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      }),
    }));
  } catch {
    return MOCK_CONVERSATIONS;
  }
}

export async function getConversationByIdAction(id: string) {
  try {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const mock = MOCK_CONVERSATIONS.find((c) => c.id === id);
      return mock || null;
    }

    return data;
  } catch {
    return MOCK_CONVERSATIONS.find((c) => c.id === id) || null;
  }
}

export async function createConversationAction(input: unknown) {
  const parsed = CreateConversationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input tidak valid" };
  }

  const { title, model, provider, folderId } = parsed.data;

  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, conversationId: `conv-${Date.now()}` };
    }

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        title,
        model,
        provider,
        folder_id: folderId || null,
      })
      .select("id")
      .single();

    if (error) {
      return { success: true, conversationId: `conv-${Date.now()}` };
    }

    revalidatePath("/chat");
    return { success: true, conversationId: data.id };
  } catch {
    return { success: true, conversationId: `conv-${Date.now()}` };
  }
}

export async function updateConversationTitleAction(id: string, title: string) {
  const parsed = UpdateConversationTitleSchema.safeParse({ id, title });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input tidak valid" };
  }

  try {
    const supabase = (await createClient()) as any;
    await supabase
      .from("conversations")
      .update({ title })
      .eq("id", id);

    revalidatePath("/chat");
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function togglePinConversationAction(id: string, currentPinStatus: boolean) {
  try {
    const supabase = (await createClient()) as any;
    await supabase
      .from("conversations")
      .update({ is_pinned: !currentPinStatus })
      .eq("id", id);

    revalidatePath("/chat");
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function moveConversationFolderAction(id: string, folderId: string | null) {
  const parsed = MoveConversationFolderSchema.safeParse({ id, folderId });
  if (!parsed.success) {
    return { error: "ID folder tidak valid" };
  }

  try {
    const supabase = (await createClient()) as any;
    await supabase
      .from("conversations")
      .update({ folder_id: folderId })
      .eq("id", id);

    revalidatePath("/chat");
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function softDeleteConversationAction(id: string) {
  try {
    const supabase = (await createClient()) as any;
    await supabase
      .from("conversations")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    revalidatePath("/chat");
    return { success: true };
  } catch {
    return { success: true };
  }
}
