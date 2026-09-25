"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Menu,
  Share2,
  Download,
  Sparkles,
  FileCode,
  Database,
  FileText,
  Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export function ChatShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleExport = (format: string) => {
    window.open(`/api/export?format=${format}`, "_blank");
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Persistent Left Sidebar (280px) */}
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-card border-r border-border">
          <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* Top Mini Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-card/40 px-4 backdrop-blur-md">
          {/* Left: Mobile hamburger & title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Buka Sidebar</span>
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground truncate max-w-[220px] sm:max-w-md">
                AetherChat Workspace
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Sparkles className="h-3 w-3" />
                Live Grok Mode
              </span>
            </div>
          </div>

          {/* Right: Share & Export quick actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Tautan percakapan berhasil disalin ke clipboard!");
                }
              }}
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Bagikan</span>
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 px-2.5 text-xs border-border/70 hover:bg-secondary"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Ekspor</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs">Format Ekspor Arsip</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("md")} className="cursor-pointer">
                  <FileCode className="h-4 w-4 mr-2 text-primary" />
                  <span>Markdown (.md)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("json")} className="cursor-pointer">
                  <Database className="h-4 w-4 mr-2 text-cyan-400" />
                  <span>JSON (.json)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")} className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2 text-red-400" />
                  <span>PDF / HTML Cetak</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("zip")} className="cursor-pointer">
                  <Archive className="h-4 w-4 mr-2 text-amber-400" />
                  <span>Bulk ZIP (Semua Chat)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Page Content with Smooth Transition */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="flex-1 h-[calc(100vh-3.5rem)] overflow-hidden"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
