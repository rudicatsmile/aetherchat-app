"use client";

import { useState, useRef, useEffect } from "react";
import { MockMessage } from "@/lib/mock-data";
import { saveMessageAction, getMessagesAction } from "@/actions/messages";
import { createClient } from "@/lib/supabase/client";

interface UploadedAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  extractedText?: string | null;
  isImage?: boolean;
}

interface UseChatOptions {
  initialMessages?: MockMessage[];
  conversationId?: string;
  model?: string;
  provider?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<MockMessage[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Subscribe to Supabase Realtime messages channel for this conversation
  useEffect(() => {
    if (!options.conversationId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-messages-${options.conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${options.conversationId}`,
        },
        (payload: any) => {
          const newMsg: MockMessage = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            role: payload.new.role,
            content: payload.new.content,
            model: payload.new.model,
            provider: payload.new.provider,
            createdAt: new Date(payload.new.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }) + " WIB",
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.conversationId]);

  const sendMessage = async (
    content: string,
    chatOptions?: {
      webSearch?: boolean;
      isImageGen?: boolean;
      attachments?: UploadedAttachment[];
    }
  ) => {
    if (!content.trim() && (!chatOptions?.attachments || chatOptions.attachments.length === 0)) {
      return;
    }
    if (isLoading) return;

    let displayContent = content;
    if (chatOptions?.attachments && chatOptions.attachments.length > 0) {
      const attsText = chatOptions.attachments
        .map((a) => (a.isImage ? `![${a.fileName}](${a.url})` : `📄 **Lampiran Dokumen:** ${a.fileName}`))
        .join("\n\n");
      displayContent = attsText + (content ? `\n\n${content}` : "");
    }

    const userMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      conversationId: options.conversationId || "new-chat",
      role: "user",
      content: displayContent,
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Persist user message to Supabase
    if (options.conversationId) {
      saveMessageAction({
        conversationId: options.conversationId,
        role: "user",
        content: displayContent,
      });
    }

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantPlaceholder: MockMessage = {
      id: assistantMessageId,
      conversationId: options.conversationId || "new-chat",
      role: "assistant",
      content: "",
      model: chatOptions?.isImageGen ? "dall-e-3" : options.model || "llama-3.3-70b-versatile",
      provider: chatOptions?.isImageGen ? "openai" : options.provider || "groq",
      createdAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
    };

    setMessages((prev) => [...prev, assistantPlaceholder]);

    // Handle Image Generation Mode
    if (chatOptions?.isImageGen) {
      try {
        const res = await fetch("/api/image-gen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: content,
            conversationId: options.conversationId,
          }),
        });
        const data = await res.json();
        if (data.success && data.image) {
          const imgMarkdown = `Berikut hasil gambar untuk prompt: **"${content}"**\n\n![${content}](${data.image.url})\n\n*Model: DALL·E 3 • Format: ${data.image.aspectRatio}*`;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: imgMarkdown } : msg
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: `Gagal membuat gambar: ${data.error || "Terjadi kesalahan."}` }
                : msg
            )
          );
        }
      } catch {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: "Terjadi kesalahan saat memproses pembuatan gambar AI." }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle Standard LLM / Web Search Streaming
    abortControllerRef.current = new AbortController();

    // Prepare prompt payload with any extracted text from attachments
    let contextAugmentedContent = content;
    if (chatOptions?.attachments) {
      for (const att of chatOptions.attachments) {
        if (att.extractedText) {
          contextAugmentedContent += `\n\n[Konteks Dokumen Tambahan dari ${att.fileName}]:\n${att.extractedText}`;
        }
      }
    }

    const payloadMessages = [...messages, { ...userMessage, content: contextAugmentedContent }].map(
      (m) => ({
        role: m.role,
        content: m.content,
      })
    );

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: payloadMessages,
          conversationId: options.conversationId,
          model: options.model || "llama-3.3-70b-versatile",
          provider: options.provider || "groq",
          webSearch: chatOptions?.webSearch || false,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil respons streaming.");
      }

      if (!response.body) {
        throw new Error("Respons streaming kosong.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            try {
              const textPiece = JSON.parse(line.slice(2));
              accumulatedText += textPiece;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedText }
                    : msg
                )
              );
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    "Mohon maaf, terjadi kendala saat streaming respons. Silakan coba lagi.",
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    stop,
  };
}
