"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, MessageSquare, ArrowRight, Sparkles, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");

  const results = MOCK_CONVERSATIONS.filter((conv) => {
    const matchesQuery =
      !query.trim() ||
      conv.title.toLowerCase().includes(query.toLowerCase()) ||
      (conv.lastMessageSnippet &&
        conv.lastMessageSnippet.toLowerCase().includes(query.toLowerCase()));

    const matchesProvider =
      selectedProvider === "all" || conv.provider === selectedProvider;

    return matchesQuery && matchesProvider;
  });

  return (
    <div className="h-full overflow-y-auto px-4 md:px-8 py-8 bg-background">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Pencarian Global Percakapan
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Cari cepat di seluruh riwayat percakapan Anda berdasarkan judul atau konten pesan (didukung PostgreSQL Full-Text Search).
          </p>
        </div>

        {/* Search Bar & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kata kunci (contoh: 'Startup', 'TypeError', 'Diet')..."
              className="pl-10 h-11 bg-card/70 border-border/80 text-sm rounded-xl focus-visible:ring-primary/60"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Badge
              variant={selectedProvider === "all" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs"
              onClick={() => setSelectedProvider("all")}
            >
              Semua Model
            </Badge>
            <Badge
              variant={selectedProvider === "groq" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs"
              onClick={() => setSelectedProvider("groq")}
            >
              Groq Llama
            </Badge>
            <Badge
              variant={selectedProvider === "openai" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs"
              onClick={() => setSelectedProvider("openai")}
            >
              OpenAI
            </Badge>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
          <span>Menemukan {results.length} percakapan</span>
          {query && (
            <span>
              Kata kunci: <strong className="text-foreground">"{query}"</strong>
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {results.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Tidak ada hasil yang cocok</p>
              <p className="text-xs text-muted-foreground/80 mt-1">
                Coba gunakan kata kunci pencarian yang lebih umum.
              </p>
            </div>
          ) : (
            results.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <Card className="p-4 bg-card/60 border-border/70 hover:border-primary/50 hover:bg-secondary/30 transition-all rounded-xl group mb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary mt-0.5">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {conv.title}
                        </h3>
                        {conv.lastMessageSnippet && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {conv.lastMessageSnippet}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                          <span className="text-primary">{conv.model}</span>
                          <span>•</span>
                          <span>{conv.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
