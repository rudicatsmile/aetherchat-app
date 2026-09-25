"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language?: string;
  value: string;
}

export function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="relative my-4 overflow-hidden rounded-xl border border-border/80 bg-black/70 shadow-md">
      {/* Code Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-secondary/50 px-4 py-2 text-xs font-mono text-muted-foreground">
        <span className="uppercase tracking-wider font-semibold text-foreground/80">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className="h-7 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Kode</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 text-[13.5px] font-mono leading-relaxed text-zinc-100 selection:bg-primary/30">
        <pre className="m-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
