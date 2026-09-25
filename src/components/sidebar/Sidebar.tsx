"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Settings,
  ShieldAlert,
  LogOut,
  Flame,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchBar } from "./SearchBar";
import { FolderTree } from "./FolderTree";
import { ConversationList } from "./ConversationList";
import { useConversations } from "@/hooks/useConversations";
import { useUsage } from "@/hooks/useUsage";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/actions/auth";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{
    email?: string;
    fullName?: string;
    avatarUrl?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setCurrentUser({
          email: user.email,
          fullName:
            profile?.full_name ||
            user.user_metadata?.full_name ||
            (user.email ? user.email.split("@")[0] : "Pengguna"),
          avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url,
          role: profile?.role || "user",
        });
      } else {
        setCurrentUser(null);
      }
    }
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const {
    conversations,
    folders,
    renameConversation,
    togglePin,
    deleteConversation,
    moveFolder,
    createFolder,
  } = useConversations();

  const { quota } = useUsage();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // New Chat handler
  const handleNewChat = () => {
    router.push("/chat");
    if (onCloseMobile) onCloseMobile();
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolderId === null || c.folderId === selectedFolderId;
    return matchesSearch && matchesFolder;
  });

  return (
    <aside className="flex h-full w-[280px] flex-col border-r border-border/70 bg-card/60 backdrop-blur-xl">
      {/* Top Header & Brand */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-border/50">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold tracking-tight text-base hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-violet-600 to-cyan-500 shadow-md shadow-primary/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-foreground tracking-tight">
            Aether<span className="text-primary">Chat</span>
          </span>
        </Link>
      </div>

      {/* Action: New Chat Button */}
      <div className="p-3">
        <Button
          onClick={handleNewChat}
          variant="glow"
          className="w-full justify-start gap-2 h-10 px-3.5 rounded-xl font-medium text-sm text-white"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Percakapan Baru</span>
        </Button>
      </div>

      {/* Global Search and Search Bar */}
      <div className="px-3 pb-2 space-y-2">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-primary" />
          <span>Pencarian Global Mendalam</span>
        </Link>
      </div>

      {/* Main Scrollable Area */}
      <ScrollArea className="flex-1 px-3 py-1">
        {/* Folder Tree */}
        <div className="mb-4">
          <FolderTree
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={createFolder}
          />
        </div>

        {/* Conversation List */}
        <ConversationList
          conversations={filteredConversations}
          folders={folders}
          onRename={renameConversation}
          onTogglePin={togglePin}
          onDelete={deleteConversation}
          onMoveFolder={moveFolder}
        />
      </ScrollArea>

      {/* Bottom User Profile & Quota Bar */}
      <div className="border-t border-border/60 p-3 bg-secondary/30">
        {/* Daily Quota Mini Indicator */}
        <div className="mb-2.5 rounded-lg bg-card/80 p-2 text-xs border border-border/40">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              Kuota Gratis Hari Ini
            </span>
            <span className="font-mono text-primary font-semibold">
              {quota.messagesUsed}/{quota.messagesLimit}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{
                width: `${(quota.messagesUsed / quota.messagesLimit) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* User Account Dropdown */}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-2.5 rounded-xl p-1.5 hover:bg-secondary/70 transition-colors text-left group">
                <Avatar className="h-8 w-8 border border-border/70">
                  {currentUser.avatarUrl && (
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.fullName || "User"} />
                  )}
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                    {currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {currentUser.fullName}
                  </p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              <DropdownMenuLabel className="text-xs">Akun Anda</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/general" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Pengaturan Akun</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/usage" className="cursor-pointer">
                  <Flame className="h-4 w-4 mr-2 text-amber-400" />
                  <span>Dashboard Kuota</span>
                </Link>
              </DropdownMenuItem>
              {currentUser.role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard" className="cursor-pointer text-violet-400 focus:text-violet-300">
                      <ShieldAlert className="h-4 w-4 mr-2" />
                      <span>Panel Administrator</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOutAction()}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Keluar (Sign Out)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" size="sm" asChild className="w-full text-xs h-9 justify-center">
              <Link href="/login">Masuk ke Akun</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
