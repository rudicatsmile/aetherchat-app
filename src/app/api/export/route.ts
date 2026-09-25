import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || "md").toLowerCase();
    const conversationId = searchParams.get("conversationId");

    const supabase = (await createClient()) as any;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Fetch conversations and their messages from Supabase
    let convList: any[] = [];
    if (user) {
      let query = supabase
        .from("conversations")
        .select("*, messages(*)")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (conversationId) {
        query = query.eq("id", conversationId);
      }
      const { data } = await query;
      if (data && data.length > 0) {
        convList = data.map((c: any) => ({
          ...c,
          messages: Array.isArray(c.messages)
            ? c.messages.sort(
                (a: any, b: any) =>
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              )
            : [],
        }));
      }
    }

    if (convList.length === 0) {
      return NextResponse.json(
        {
          error:
            "Tidak ada data percakapan nyata yang ditemukan untuk diekspor. Silakan mulai chat terlebih dahulu.",
        },
        { status: 404 }
      );
    }

    const timestamp = Date.now();

    // Format 1: Markdown (.md)
    if (format === "md") {
      let mdContent = `# AetherChat Export - ${new Date().toLocaleDateString("id-ID")}\n\n`;

      for (const conv of convList) {
        const lastUpdated = conv.updated_at
          ? new Date(conv.updated_at).toLocaleString("id-ID")
          : "Baru saja";
        mdContent += `## ${conv.title || "Percakapan"}\n`;
        mdContent += `*Model: ${conv.model} | Terakhir Diperbarui: ${lastUpdated}*\n\n---\n\n`;

        const messages = conv.messages || [];
        if (messages.length === 0) {
          mdContent += `*(Belum ada pesan dalam percakapan ini)*\n\n`;
        } else {
          for (const m of messages) {
            const roleLabel = m.role === "user" ? "Pengguna" : "AetherChat AI";
            const timeStr = m.created_at
              ? new Date(m.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }) + " WIB"
              : "";
            mdContent += `### [${timeStr}] ${roleLabel}:\n${m.content}\n\n`;
          }
        }
        mdContent += `\n=========================================\n\n`;
      }

      return new Response(mdContent, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="aetherchat-export-${timestamp}.md"`,
        },
      });
    }

    // Format 2: JSON (.json)
    if (format === "json") {
      const exportData = {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        totalConversations: convList.length,
        conversations: convList.map((c: any) => ({
          id: c.id,
          title: c.title,
          model: c.model,
          provider: c.provider,
          createdAt: c.created_at,
          updatedAt: c.updated_at,
          messages: (c.messages || []).map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            model: m.model,
            createdAt: m.created_at,
            totalTokens: m.total_tokens,
          })),
        })),
      };

      return new Response(JSON.stringify(exportData, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="aetherchat-export-${timestamp}.json"`,
        },
      });
    }

    // Format 3: PDF / Printable Styled HTML (.pdf / .html)
    if (format === "pdf" || format === "html") {
      const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>AetherChat Export - ${timestamp}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #09090b; color: #ededed; margin: 40px; line-height: 1.6; }
    h1 { color: #a78bfa; border-bottom: 2px solid #27272a; padding-bottom: 12px; }
    h2 { color: #ffffff; margin-top: 32px; }
    .badge { background: #27272a; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-family: monospace; }
    .bubble-user { background: #18181b; border: 1px solid #27272a; padding: 16px; border-radius: 16px; margin: 16px 0; border-left: 4px solid #a78bfa; }
    .bubble-ai { background: #09090b; padding: 16px; margin: 16px 0; border-left: 4px solid #06b6d4; }
    .timestamp { font-size: 11px; color: #a1a1aa; font-family: monospace; }
    pre { background: #121214; padding: 16px; border-radius: 12px; overflow-x: auto; color: #f4f4f5; font-family: monospace; }
    @media print { body { background: white; color: black; margin: 20px; } .bubble-user { border-color: #ddd; } }
  </style>
</head>
<body>
  <h1>AetherChat — Arsip Percakapan Resmi</h1>
  <p>Diekspor pada: <strong>${new Date().toLocaleString("id-ID")}</strong></p>
  ${convList
    .map(
      (c: any) => `
    <h2>${c.title || "Percakapan"}</h2>
    <span class="badge">Model: ${c.model || "AI"}</span>
    ${(c.messages || [])
      .map(
        (m: any) => `
      <div class="${m.role === "user" ? "bubble-user" : "bubble-ai"}">
        <div class="timestamp">${m.role === "user" ? "👤 Pengguna" : "✨ AetherChat AI"} • ${
          m.created_at ? new Date(m.created_at).toLocaleString("id-ID") : ""
        }</div>
        <div style="margin-top: 8px;">${String(m.content || "").replace(/\n/g, "<br>")}</div>
      </div>
    `
      )
      .join("")}
    <hr style="border: 1px solid #27272a; margin: 32px 0;">
  `
    )
    .join("")}
</body>
</html>`;

      return new Response(htmlContent, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="aetherchat-export-${timestamp}.html"`,
        },
      });
    }

    // Format 4: Bulk ZIP Archive (.zip)
    if (format === "zip") {
      const zip = new JSZip();

      zip.file(
        "README.txt",
        `Arsip Percakapan AetherChat\nDiekspor: ${new Date().toISOString()}\nTotal Percakapan: ${convList.length}`
      );

      for (const conv of convList) {
        const safeTitle = (conv.title || "percakapan")
          .replace(/[^a-zA-Z0-9_\-]/g, "_")
          .substring(0, 40);
        let convMd = `# ${conv.title || "Percakapan"}\n\nModel: ${conv.model}\n\n---\n\n`;

        for (const m of conv.messages || []) {
          const timeStr = m.created_at
            ? new Date(m.created_at).toLocaleString("id-ID")
            : "";
          convMd += `### ${m.role === "user" ? "Pengguna" : "AetherChat AI"} (${timeStr}):\n${m.content}\n\n`;
        }

        zip.file(`${safeTitle}.md`, convMd);
      }

      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

      return new Response(zipBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="aetherchat-export-${timestamp}.zip"`,
        },
      });
    }

    return NextResponse.json(
      { error: "Format ekspor tidak didukung (gunakan md, json, html, atau zip)." },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengekspor data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
