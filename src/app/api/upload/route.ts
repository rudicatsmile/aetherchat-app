import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DOC_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const conversationId = (formData.get("conversationId") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(md|txt|csv|json)$/i)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap unggah gambar, PDF, TXT, MD, DOCX, CSV, atau JSON." },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/");
    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Ukuran gambar maksimal adalah 10 MB." }, { status: 400 });
    }
    if (!isImage && file.size > MAX_DOC_SIZE) {
      return NextResponse.json({ error: "Ukuran dokumen maksimal adalah 20 MB." }, { status: 400 });
    }

    const supabase = (await createClient()) as any;
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user ? user.id : "00000000-0000-0000-0000-000000000000";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text for text-based files
    let extractedText: string | null = null;
    if (
      file.type === "text/plain" ||
      file.type === "text/markdown" ||
      file.type === "text/csv" ||
      file.type === "application/json" ||
      file.name.match(/\.(txt|md|csv|json)$/i)
    ) {
      extractedText = buffer.toString("utf-8").slice(0, 15000); // limit to 15k chars for prompt context
    }

    const fileExtension = file.name.split(".").pop() || "bin";
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;
    const storagePath = `${userId}/${conversationId}/${uniqueFileName}`;

    let publicUrl: string | null = null;

    try {
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("chat-attachments")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("chat-attachments")
          .getPublicUrl(storagePath);
        publicUrl = urlData.publicUrl;

        // Insert metadata to attachments table
        await supabase.from("attachments").insert({
          user_id: userId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          public_url: publicUrl,
          extracted_text: extractedText,
        });
      }
    } catch {
      // In offline / dev mode, construct preview URL
    }

    // Fallback URL for client preview if storage is not connected
    if (!publicUrl) {
      if (isImage) {
        publicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
      } else {
        publicUrl = `/uploads/${uniqueFileName}`;
      }
    }

    return NextResponse.json({
      success: true,
      file: {
        id: `att-${Date.now()}`,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        url: publicUrl,
        extractedText,
        isImage,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
