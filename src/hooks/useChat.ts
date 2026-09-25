"use client";

import { useState, useRef, useEffect } from "react";
import { MockMessage } from "@/types/chat";
import { saveMessageAction, getMessagesAction } from "@/actions/messages";
import { createConversationAction } from "@/actions/conversations";
import { createClient } from "@/lib/supabase/client";

export interface UploadedAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  extractedText?: string | null;
  isImage?: boolean;
}

export interface UseChatOptions {
  initialMessages?: MockMessage[];
  conversationId?: string;
  model?: string;
  provider?: string;
}

export function useChat(options: UseChatOptions = {}) {
  const [messages, setMessages] = useState<MockMessage[]>(options.initialMessages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(
    options.conversationId
  );
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setActiveConversationId(options.conversationId);
  }, [options.conversationId]);

  // Load existing real messages from Supabase on mount
  useEffect(() => {
    if (!activeConversationId) return;
    const convId = activeConversationId;

    let isMounted = true;
    async function loadHistory() {
      try {
        const history = await getMessagesAction(convId);
        if (isMounted && history && history.length > 0) {
          setMessages(history);
        }
      } catch {
        // ignore
      }
    }
    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  // Subscribe to Supabase Realtime messages channel for this conversation
  useEffect(() => {
    const targetId = activeConversationId;
    if (!targetId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`realtime-messages-${targetId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${targetId}`,
        },
        (payload: any) => {
          const newMsg: MockMessage = {
            id: payload.new.id,
            conversationId: payload.new.conversation_id,
            role: payload.new.role,
            content: payload.new.content,
            model: payload.new.model,
            provider: payload.new.provider,
            createdAt:
              new Date(payload.new.created_at).toLocaleTimeString("id-ID", {
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
  }, [activeConversationId]);

  const sendMessage = async (
    content: string,
    chatOptions?: {
      webSearch?: boolean;
      isImageGen?: boolean;
      attachments?: UploadedAttachment[];
      model?: string;
      provider?: string;
    }
  ) => {
    if (!content.trim() && (!chatOptions?.attachments || chatOptions.attachments.length === 0)) {
      return;
    }
    if (isLoading) return;

    const effectiveModel =
      chatOptions?.model || options.model || "llama-3.3-70b-versatile";
    const effectiveProvider =
      chatOptions?.provider || options.provider || "groq";

    let displayContent = content;
    if (chatOptions?.attachments && chatOptions.attachments.length > 0) {
      const attsText = chatOptions.attachments
        .map((a) =>
          a.isImage ? `![${a.fileName}](${a.url})` : `📄 **Lampiran Dokumen:** ${a.fileName}`
        )
        .join("\n\n");
      displayContent = attsText + (content ? `\n\n${content}` : "");
    }

    // Auto-create conversation if starting from /chat without an existing ID
    let currentConversationId = activeConversationId;
    if (!currentConversationId) {
      try {
        const titleSnippet = content.trim().slice(0, 35) || "Percakapan Baru";
        const convRes = await createConversationAction({
          title: titleSnippet,
          model: effectiveModel,
          provider: effectiveProvider as any,
        });
        if (convRes?.conversationId) {
          currentConversationId = convRes.conversationId;
          setActiveConversationId(currentConversationId);
          window.history.replaceState(null, "", `/chat/${currentConversationId}`);
        }
      } catch {
        // continue even if conversation persistence fails
      }
    }

    const userMessage: MockMessage = {
      id: `msg-${Date.now()}`,
      conversationId: currentConversationId || "new-chat",
      role: "user",
      content: displayContent,
      createdAt:
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Persist user message to Supabase
    if (currentConversationId) {
      saveMessageAction({
        conversationId: currentConversationId,
        role: "user",
        content: displayContent,
      });
    }

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantPlaceholder: MockMessage = {
      id: assistantMessageId,
      conversationId: currentConversationId || "new-chat",
      role: "assistant",
      content: "",
      model: chatOptions?.isImageGen ? "dall-e-3" : effectiveModel,
      provider: chatOptions?.isImageGen ? "openai" : effectiveProvider,
      createdAt:
        new Date().toLocaleTimeString("id-ID", {
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
            conversationId: currentConversationId,
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
                ? {
                    ...msg,
                    content: `⚠️ **Gagal membuat gambar:** ${data.error || "Terjadi kesalahan."}`,
                  }
                : msg
            )
          );
        }
      } catch {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "⚠️ Terjadi kesalahan saat memproses pembuatan gambar AI.",
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle Standard Real LLM Streaming
    abortControllerRef.current = new AbortController();

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

    // Retrieve any BYOK API key saved in browser localStorage
    let clientByokKey: string | undefined = undefined;
    if (typeof window !== "undefined") {
      const byokEnabled = localStorage.getItem("aether_byok_enabled") !== "false";
      if (byokEnabled) {
        const stored = localStorage.getItem(`aether_byok_${effectiveProvider}`);
        if (stored && stored.trim()) {
          clientByokKey = stored.trim();
        }
      }
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: payloadMessages,
          conversationId: currentConversationId,
          model: effectiveModel,
          provider: effectiveProvider,
          webSearch: chatOptions?.webSearch || false,
          byokApiKey: clientByokKey,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Gagal mengambil respons streaming dari model AI.";
        try {
          const errData = await response.json();
          if (errData.error) errorMsg = errData.error;
        } catch {
          // not json
        }
        throw new Error(errorMsg);
      }

      if (!response.body) {
        throw new Error("Respons streaming kosong dari server.");
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
          } else if (line.startsWith("3:")) {
            try {
              const errPiece = JSON.parse(line.slice(2));
              accumulatedText +=
                (accumulatedText ? "\n\n" : "") + `⚠️ **Error Model AI:** ${errPiece}`;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: accumulatedText }
                    : msg
                )
              );
            } catch {
              // ignore
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error(
          "Model AI tidak mengembalikan teks respons. Silakan periksa konfigurasi API Key Anda."
        );
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        const errorContent =
          err instanceof Error
            ? err.message
            : "Mohon maaf, terjadi kendala saat streaming respons dari model AI.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: msg.content ? `${msg.content}\n\n${errorContent}` : errorContent,
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
    activeConversationId,
  };
}
