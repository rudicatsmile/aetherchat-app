"use server";

import { createClient } from "@/lib/supabase/server";
import { CreateFolderSchema } from "@/lib/validators";
import { MOCK_FOLDERS, MockFolder } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

export async function getFoldersAction(): Promise<MockFolder[]> {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_FOLDERS;
    }

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_FOLDERS;
    }

    return data.map((f: any) => ({
      id: f.id,
      name: f.name,
      color: f.color || "violet",
      icon: f.icon || "folder",
      parentId: f.parent_id,
    }));
  } catch {
    return MOCK_FOLDERS;
  }
}

export async function createFolderAction(input: unknown) {
  const parsed = CreateFolderSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input folder tidak valid" };
  }

  const { name, color, icon, parentId } = parsed.data;

  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, folderId: `f-${Date.now()}` };
    }

    const { data, error } = await supabase
      .from("folders")
      .insert({
        user_id: user.id,
        name,
        color,
        icon,
        parent_id: parentId || null,
      })
      .select("id")
      .single();

    if (error) {
      return { success: true, folderId: `f-${Date.now()}` };
    }

    revalidatePath("/chat");
    return { success: true, folderId: data.id };
  } catch {
    return { success: true, folderId: `f-${Date.now()}` };
  }
}

export async function deleteFolderAction(id: string) {
  try {
    const supabase = (await createClient()) as any;
    await supabase.from("folders").delete().eq("id", id);
    revalidatePath("/chat");
    return { success: true };
  } catch {
    return { success: true };
  }
}
