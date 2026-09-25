"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Search, MessageSquare, ArrowRight, X, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchConversationsAction, SearchResultItem } from "@/actions/conversations";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Load conversations on mount and whenever search query changes (debounced)
  useEffect(() => {
    let isCancelled = false;

    const handler = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await searchConversationsAction(query);
          if (!isCancelled) {
            setResults(data);
          }
        } catch (err) {
          console.error("Gagal melakukan pencarian:", err);
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      });
    }, query ? 250 : 0);

    return () => {
      isCancelled = true;
      clearTimeout(handler);
    };
  }, [query]);

  const filteredResults = results.filter((conv) => {
    if (selectedProvider === "all") return true;
    return conv.provider === selectedProvider;
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
            Cari cepat di seluruh riwayat percakapan Anda berdasarkan judul atau konten pesan (didukung Supabase Database Search).
          </p>
        </div>

        {/* Search Bar & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kata kunci percakapan atau riwayat pesan..."
              className="pl-10 pr-9 h-11 bg-card/70 border-border/80 text-sm rounded-xl focus-visible:ring-primary/60"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Hapus kata kunci"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <Badge
              variant={selectedProvider === "all" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs transition-colors shrink-0"
              onClick={() => setSelectedProvider("all")}
            >
              Semua Model
            </Badge>
            <Badge
              variant={selectedProvider === "groq" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs transition-colors shrink-0"
              onClick={() => setSelectedProvider("groq")}
            >
              Groq Llama
            </Badge>
            <Badge
              variant={selectedProvider === "openai" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs transition-colors shrink-0"
              onClick={() => setSelectedProvider("openai")}
            >
              OpenAI
            </Badge>
            <Badge
              variant={selectedProvider === "openrouter" ? "default" : "secondary"}
              className="cursor-pointer py-1.5 px-3 rounded-lg text-xs transition-colors shrink-0"
              onClick={() => setSelectedProvider("openrouter")}
            >
              OpenRouter
            </Badge>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/40 pb-2">
          <div className="flex items-center gap-2">
            <span>Menemukan {filteredResults.length} percakapan</span>
            {(isLoading || isPending) && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            )}
          </div>
          {query && (
            <span>
              Kata kunci: <strong className="text-foreground">"{query}"</strong>
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
              <p className="text-xs">Mencari percakapan di database...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border/70 p-8">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {query ? "Tidak ada hasil yang cocok" : "Belum ada riwayat percakapan"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {query
                  ? "Coba gunakan kata kunci pencarian yang lebih umum atau periksa filter provider."
                  : "Mulai percakapan baru dengan AI untuk mengisi riwayat obrolan Anda."}
              </p>
              {!query && (
                <div className="mt-4">
                  <Button asChild size="sm" variant="glow" className="text-xs text-white">
                    <Link href="/chat">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                      Mulai Percakapan Baru
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            filteredResults.map((conv) => (
              <Link key={conv.id} href={`/chat/${conv.id}`}>
                <Card className="p-4 bg-card/60 border-border/70 hover:border-primary/50 hover:bg-secondary/30 transition-all rounded-xl group mb-3 shadow-sm">
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
                          <span className="text-primary font-medium">{conv.model}</span>
                          <span>•</span>
                          <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground">
                            {conv.provider}
                          </span>
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
