"use client";

import React, { useState } from "react";
import { Sparkles, User, Copy, Check, Clock, Cpu } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { StreamingCursor } from "./StreamingCursor";
import { MockMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const MarkdownRenderer = dynamic(
  () => import("./MarkdownRenderer").then((mod) => mod.MarkdownRenderer),
  {
    loading: () => (
      <div className="space-y-2 py-2">
        <div className="h-4 bg-secondary/50 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-secondary/30 rounded animate-pulse w-1/2" />
      </div>
    ),
  }
);

interface MessageBubbleProps {
  message: MockMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!message.content) return;
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (isUser) {
    return (
      <div className="flex w-full justify-end py-3">
        <div className="flex max-w-[85%] sm:max-w-[75%] md:max-w-[70%] items-start gap-3 flex-row-reverse">
          <Avatar className="h-8 w-8 shrink-0 bg-primary/20 border border-primary/40 mt-1">
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>

          <div className="group relative rounded-2xl bg-secondary/80 px-4 py-3 text-[15px] leading-relaxed text-foreground shadow-sm border border-white/5">
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className="mt-1 flex items-center justify-end text-[11px] text-muted-foreground/70">
              <span>{message.createdAt}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant / AI Message - Grok / ChatGPT full-width style
  return (
    <div className="group relative w-full py-5 border-b border-border/20 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Grok/Aether AI Logo Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet-600 to-cyan-500 shadow-md shadow-primary/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Header with Model badge & action */}
          <div className="flex items-center justify-between pb-2 mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground tracking-wide">
                AetherChat
              </span>
              {message.model && (
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground border border-border/40">
                  <Cpu className="h-3 w-3 text-primary" />
                  {message.model}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                title="Salin Respons"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Render Markdown */}
          <div className="text-foreground">
            <MarkdownRenderer content={message.content} />
            {isStreaming && <StreamingCursor />}
          </div>

          {/* Footer Metadata */}
          {(message.totalTokens || message.durationMs) && !isStreaming && (
            <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground/60 font-mono">
              {message.durationMs && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {(message.durationMs / 1000).toFixed(2)} detik
                </span>
              )}
              {message.totalTokens && (
                <span>• {message.totalTokens} tokens</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
