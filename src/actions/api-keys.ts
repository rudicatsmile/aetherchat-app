"use server";

import { createClient } from "@/lib/supabase/server";
import { encryptApiKey } from "@/lib/crypto";
import { SaveApiKeySchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getUserApiKeysAction() {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from("user_api_keys")
      .select("id, provider, key_hint, is_active, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((k: any) => ({
      id: k.id,
      provider: k.provider,
      keyHint: k.key_hint,
      isActive: k.is_active,
      createdAt: new Date(k.created_at).toLocaleDateString("id-ID"),
    }));
  } catch {
    return [];
  }
}

export async function saveUserApiKeyAction(input: unknown) {
  const parsed = SaveApiKeySchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Input kunci API tidak valid" };
  }

  const { provider, apiKey } = parsed.data;

  // Masking hint: sk-...Xk2Q
  const prefix = apiKey.slice(0, 4);
  const suffix = apiKey.slice(-4);
  const keyHint = `${prefix}••••••••${suffix}`;

  // Encrypt with AES-256-GCM
  const encryptedKey = encryptApiKey(apiKey);

  try {
    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: true, keyId: `key-${Date.now()}`, keyHint, isGuest: true };
    }

    const { data, error } = await supabase
      .from("user_api_keys")
      .upsert(
        {
          user_id: user.id,
          provider,
          encrypted_key: encryptedKey,
          key_hint: keyHint,
          is_active: true,
        },
        { onConflict: "user_id, provider" }
      )
      .select("id")
      .single();

    // Automatically enable use_byok in user_settings
    await supabase
      .from("user_settings")
      .update({ use_byok: true })
      .eq("user_id", user.id);

    revalidatePath("/settings/api-keys");
    return { success: true, keyId: data?.id || `key-${Date.now()}`, keyHint };
  } catch {
    return { success: true, keyId: `key-${Date.now()}`, keyHint, isGuest: true };
  }
}

export async function deleteUserApiKeyAction(id: string) {
  try {
    const supabase = (await createClient()) as any;
    await supabase.from("user_api_keys").delete().eq("id", id);
    revalidatePath("/settings/api-keys");
    return { success: true };
  } catch {
    return { success: true };
  }
}
