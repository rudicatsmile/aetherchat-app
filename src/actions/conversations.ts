"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateConversationSchema,
  UpdateConversationTitleSchema,
  MoveConversationFolderSchema,
} from "@/lib/validators";
import { MockConversation } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

export async function getConversationsAction(): Promise<MockConversation[]> {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
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
    return [];
  }
}

export async function getConversationByIdAction(id: string) {
  try {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
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

export interface SearchResultItem {
  id: string;
  title: string;
  model: string;
  provider: "groq" | "openai" | "openrouter";
  lastMessageSnippet?: string;
  updatedAt: string;
}

export async function searchConversationsAction(
  query: string = ""
): Promise<SearchResultItem[]> {
  try {
    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const trimmed = query.trim().toLowerCase();

    // 1. Fetch user's active conversations
    const { data: convs, error } = await supabase
      .from("conversations")
      .select("id, title, model, provider, updated_at")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false });

    if (error || !convs) {
      return [];
    }

    // 2. If query is empty, get last message snippet for top 30
    if (!trimmed) {
      const topConvs = convs.slice(0, 30);
      const convIds = topConvs.map((c: any) => c.id);

      const lastMessageMap: Record<string, string> = {};
      if (convIds.length > 0) {
        const { data: msgs } = await supabase
          .from("messages")
          .select("conversation_id, content, created_at")
          .in("conversation_id", convIds)
          .order("created_at", { ascending: false });

        if (msgs) {
          for (const m of msgs) {
            if (!lastMessageMap[m.conversation_id]) {
              lastMessageMap[m.conversation_id] = m.content;
            }
          }
        }
      }

      return topConvs.map((c: any) => ({
        id: c.id,
        title: c.title,
        model: c.model,
        provider: c.provider,
        lastMessageSnippet: lastMessageMap[c.id]
          ? lastMessageMap[c.id].length > 130
            ? lastMessageMap[c.id].slice(0, 130) + "..."
            : lastMessageMap[c.id]
          : undefined,
        updatedAt: new Date(c.updated_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
      }));
    }

    // 3. If query is provided, search messages for matching content
    const { data: matchedMsgs } = await supabase
      .from("messages")
      .select("conversation_id, content")
      .eq("user_id", user.id)
      .ilike("content", `%${trimmed}%`)
      .limit(60);

    const msgSnippetMap: Record<string, string> = {};
    if (matchedMsgs) {
      for (const m of matchedMsgs) {
        if (!msgSnippetMap[m.conversation_id]) {
          msgSnippetMap[m.conversation_id] = m.content;
        }
      }
    }

    // Filter conversations: either title matches query OR conversation has matching messages
    const matchedConvs = convs.filter((c: any) => {
      const titleMatch = c.title.toLowerCase().includes(trimmed);
      const msgMatch = !!msgSnippetMap[c.id];
      return titleMatch || msgMatch;
    });

    return matchedConvs.map((c: any) => {
      const snippet = msgSnippetMap[c.id];
      return {
        id: c.id,
        title: c.title,
        model: c.model,
        provider: c.provider,
        lastMessageSnippet: snippet
          ? snippet.length > 130
            ? snippet.slice(0, 130) + "..."
            : snippet
          : undefined,
        updatedAt: new Date(c.updated_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
      };
    });
  } catch {
    return [];
  }
}

