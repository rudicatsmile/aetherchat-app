"use client";

import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SUGGESTED_PROMPTS } from "@/config/prompts";
import { Sparkles, ArrowRight, Zap, Shield, Globe2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useChat } from "@/hooks/useChat";

interface ChatWindowProps {
  conversationId?: string;
  initialTitle?: string;
}

export function ChatWindow({ conversationId, initialTitle }: ChatWindowProps) {
  const isWelcome = !conversationId;

  const { messages, isLoading, sendMessage, stop } = useChat({
    conversationId,
    initialMessages: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden bg-background">
      {/* Scrollable chat messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="mx-auto max-w-3xl">
          {/* Welcome Screen when no messages */}
          {messages.length === 0 ? (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
              {/* Glowing Hero Icon */}
              <div className="relative mb-6">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary to-cyan-500 opacity-60 blur-xl animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-card shadow-2xl">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Ada yang bisa <span className="text-gradient">AetherChat</span> bantu hari ini?
              </h1>
              <p className="mt-3 max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
                Asisten AI cerdas multi-model bergaya Grok. Tanyakan konsep, debug kode, riset pasar, atau hasilkan ide kreatif dengan respons streaming ultra-cepat.
              </p>

              {/* Key Highlights */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 border border-border/50">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Latency Rendah (&lt;1.5s TTFT)
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 border border-border/50">
                  <Globe2 className="h-3.5 w-3.5 text-cyan-400" />
                  Web Search Realtime
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-secondary/80 px-3 py-1 border border-border/50">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  Privasi & BYOK Encrypted
                </span>
              </div>

              {/* Suggested Prompts Cards */}
              <div className="mt-10 grid w-full grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <Card
                    key={idx}
                    onClick={() => sendMessage(item.prompt)}
                    className="cursor-pointer border-border/60 bg-card/60 p-4 transition-all duration-200 hover:border-primary/50 hover:bg-secondary/40 hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-primary">{item.category}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.prompt}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === "assistant"}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Persistent Bottom Chat Input */}
      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent pt-3">
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          onStop={stop}
        />
      </div>
    </div>
  );
}
