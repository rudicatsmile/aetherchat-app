"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Paperclip,
  Globe,
  Mic,
  MicOff,
  ImageIcon,
  ChevronDown,
  Sparkles,
  StopCircle,
  X,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface UploadedAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  extractedText?: string | null;
  isImage?: boolean;
}

interface ChatInputProps {
  onSendMessage: (
    content: string,
    options?: {
      webSearch?: boolean;
      isImageGen?: boolean;
      attachments?: UploadedAttachment[];
      model?: string;
      provider?: string;
    }
  ) => void;
  isLoading?: boolean;
  onStop?: () => void;
  placeholder?: string;
  conversationId?: string;
}

export function ChatInput({
  onSendMessage,
  isLoading = false,
  onStop,
  placeholder = "Tanya apa saja ke AetherChat — coba \"Buatkan pitch deck startup fintech\"...",
  conversationId,
}: ChatInputProps) {
  const [content, setContent] = useState("");
  const [webSearchActive, setWebSearchActive] = useState(false);
  const [imageGenActive, setImageGenActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
  const [selectedModel, setSelectedModel] = useState({
    name: "Llama 3.3 70B",
    id: "llama-3.3-70b-versatile",
    provider: "groq",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Speech Recognition hook
  const {
    isListening,
    transcript,
    secondsRemaining,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: "id-ID",
    onResult: (text) => {
      setContent((prev) => (prev ? prev + " " : "") + text);
    },
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!content.trim() && attachments.length === 0) || isLoading) return;

    if (isListening) {
      stopListening();
    }

    onSendMessage(content.trim(), {
      webSearch: webSearchActive,
      isImageGen: imageGenActive,
      attachments,
      model: selectedModel.id,
      provider: selectedModel.provider,
    });

    setContent("");
    setAttachments([]);
    resetTranscript();

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("conversationId", conversationId || "new-chat");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.file) {
        setAttachments((prev) => [...prev, data.file]);
      } else {
        alert(data.error || "Gagal mengunggah file.");
      }
    } catch {
      alert("Terjadi kesalahan saat mengunggah file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-full max-w-4xl mx-auto px-4 pb-4">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf,.txt,.md,.docx,.csv,.json"
          className="hidden"
        />

        {/* Input Card Container */}
        <div className="relative rounded-3xl border border-border/80 bg-card/90 shadow-lg backdrop-blur-md transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
          
          {/* Active Feature Badges & Recording indicator */}
          {(webSearchActive || imageGenActive || isListening || isUploading) && (
            <div className="flex items-center gap-2 px-4 pt-3 text-xs flex-wrap">
              {webSearchActive && (
                <Badge variant="violet" className="gap-1 animate-in fade-in">
                  <Globe className="h-3 w-3" />
                  Web Search Aktif (Tavily)
                </Badge>
              )}
              {imageGenActive && (
                <Badge variant="secondary" className="gap-1 text-cyan-400 border-cyan-500/30 bg-cyan-950/40">
                  <ImageIcon className="h-3 w-3" />
                  Mode Image Gen (DALL-E 3)
                </Badge>
              )}
              {isListening && (
                <Badge variant="destructive" className="gap-1 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Mendengarkan ({secondsRemaining}s) - id-ID
                </Badge>
              )}
              {isUploading && (
                <Badge variant="outline" className="gap-1 text-muted-foreground animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Mengunggah lampiran...
                </Badge>
              )}
            </div>
          )}

          {/* Attachments Preview Thumbnails */}
          {attachments.length > 0 && (
            <div className="flex items-center gap-2 px-4 pt-3 flex-wrap">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group flex items-center gap-2 rounded-xl bg-secondary/80 border border-border/70 px-3 py-1.5 text-xs text-foreground"
                >
                  {att.isImage ? (
                    <img
                      src={att.url}
                      alt={att.fileName}
                      className="h-7 w-7 rounded-md object-cover border border-border/60"
                    />
                  ) : (
                    <FileText className="h-4 w-4 text-primary" />
                  )}
                  <span className="max-w-[140px] truncate font-medium">{att.fileName}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={imageGenActive ? "Deskripsikan visual gambar yang ingin dibuat..." : placeholder}
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-5 pt-3.5 pb-2 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            {/* Left Controls */}
            <div className="flex items-center gap-1">
              
              {/* Attach File Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Unggah Gambar / Dokumen (PDF, DOCX, TXT, MD)</TooltipContent>
              </Tooltip>

              {/* Web Search Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={webSearchActive ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setWebSearchActive(!webSearchActive)}
                    className={cn(
                      "transition-colors",
                      webSearchActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pencarian Web Realtime (Tavily)</TooltipContent>
              </Tooltip>

              {/* Voice Input Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={isListening ? "destructive" : "ghost"}
                    size="icon-sm"
                    onClick={isListening ? stopListening : startListening}
                    className={cn(
                      "transition-colors",
                      isListening
                        ? "animate-pulse"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? "Hentikan Perekaman Suara" : "Input Suara (Speech-to-Text id-ID)"}
                </TooltipContent>
              </Tooltip>

              {/* Image Gen Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant={imageGenActive ? "default" : "ghost"}
                    size="icon-sm"
                    onClick={() => setImageGenActive(!imageGenActive)}
                    className={cn(
                      "transition-colors",
                      imageGenActive
                        ? "bg-cyan-600 text-white"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mode Pembuatan Gambar AI</TooltipContent>
              </Tooltip>

              <div className="h-4 w-[1px] bg-border/60 mx-1" />

              {/* Model Picker */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/70 rounded-lg"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-foreground">{selectedModel.name}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel className="text-xs">Pilih Model AI</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      setSelectedModel({
                        name: "Llama 3.3 70B",
                        id: "llama-3.3-70b-versatile",
                        provider: "groq",
                      })
                    }
                  >
                    <div className="flex flex-col">
                       <span className="font-semibold text-xs">Llama 3.3 70B Versatile</span>
                       <span className="text-[10px] text-muted-foreground">Groq • Super Cepat • Gratis</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setSelectedModel({
                        name: "GPT-4o Mini",
                        id: "gpt-4o-mini",
                        provider: "openai",
                      })
                    }
                  >
                    <div className="flex flex-col">
                       <span className="font-semibold text-xs">GPT-4o Mini</span>
                       <span className="text-[10px] text-muted-foreground">OpenAI • Cerdas & Ringkas</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setSelectedModel({
                        name: "Mistral Large",
                        id: "mistral-large-2407",
                        provider: "openrouter",
                      })
                    }
                  >
                    <div className="flex flex-col">
                       <span className="font-semibold text-xs">Mistral Large</span>
                       <span className="text-[10px] text-muted-foreground">OpenRouter • Penalaran Kuat</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>

            {/* Right Controls: Send Button or Stop Button */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[11px] text-muted-foreground/60 select-none mr-1">
                Enter untuk kirim, Shift+Enter untuk baris baru
              </span>

              {isLoading ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={onStop}
                  className="rounded-full shadow-md"
                  title="Hentikan Streaming"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="glow"
                  size="icon-sm"
                  onClick={() => handleSubmit()}
                  disabled={(!content.trim() && attachments.length === 0) || isUploading}
                  className="rounded-full h-8 w-8 transition-transform active:scale-90"
                >
                  <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
          AetherChat dapat membuat kesalahan. Harap verifikasi informasi penting secara berkala.
        </p>
      </div>
    </TooltipProvider>
  );
}
