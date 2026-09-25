"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Pin,
  MoreVertical,
  Pencil,
  Trash2,
  FolderInput,
  Check,
  X,
} from "lucide-react";
import { MockConversation, MockFolder } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  conversations: MockConversation[];
  folders: MockFolder[];
  onRename: (id: string, newTitle: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveFolder: (id: string, folderId: string | null) => void;
}

export function ConversationList({
  conversations,
  folders,
  onRename,
  onTogglePin,
  onDelete,
  onMoveFolder,
}: ConversationListProps) {
  const pathname = usePathname();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const startRename = (conv: MockConversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const pinnedConversations = conversations.filter((c) => c.isPinned);
  const unpinnedConversations = conversations.filter((c) => !c.isPinned);

  const renderItem = (conv: MockConversation) => {
    const isActive = pathname === `/chat/${conv.id}`;
    const isEditing = editingId === conv.id;

    if (isEditing) {
      return (
        <div
          key={conv.id}
          className="flex items-center gap-1.5 rounded-xl bg-secondary/80 px-2.5 py-1.5 border border-primary/40"
        >
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename(conv.id);
              if (e.key === "Escape") setEditingId(null);
            }}
            className="h-7 text-xs bg-transparent border-none p-0 focus-visible:ring-0"
            autoFocus
          />
          <button
            onClick={() => saveRename(conv.id)}
            className="p-1 text-emerald-400 hover:text-emerald-300"
            title="Simpan"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setEditingId(null)}
            className="p-1 text-muted-foreground hover:text-foreground"
            title="Batal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      );
    }

    return (
      <div
        key={conv.id}
        className={cn(
          "group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all duration-150",
          isActive
            ? "bg-secondary text-foreground font-medium shadow-sm border border-border/70"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
        )}
      >
        <Link
          href={`/chat/${conv.id}`}
          className="flex flex-1 items-center gap-2.5 min-w-0"
        >
          {conv.isPinned ? (
            <Pin className="h-3.5 w-3.5 shrink-0 text-primary fill-primary/20 rotate-45" />
          ) : (
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80 group-hover:text-foreground" />
          )}
          <span className="truncate pr-1">{conv.title}</span>
        </Link>

        {/* Hover Actions Menu */}
        <div className="shrink-0 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => startRename(conv)}>
                <Pencil className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Ganti Judul</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onTogglePin(conv.id)}>
                <Pin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>{conv.isPinned ? "Lepas Sematan (Unpin)" : "Sematkan di Atas (Pin)"}</span>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderInput className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>Pindahkan ke Folder</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuItem onClick={() => onMoveFolder(conv.id, null)}>
                    <span>Tanpa Folder</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {folders.map((f) => (
                    <DropdownMenuItem
                      key={f.id}
                      onClick={() => onMoveFolder(conv.id, f.id)}
                    >
                      <span className="truncate">{f.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeleteTargetId(conv.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                <span>Hapus Percakapan</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Pinned Section */}
      {pinnedConversations.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">
            <Pin className="h-3 w-3 text-primary" />
            <span>Disematkan</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {pinnedConversations.map(renderItem)}
          </div>
        </div>
      )}

      {/* Recent / Unpinned Section */}
      <div>
        <div className="px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">
          <span>Percakapan Terbaru</span>
        </div>
        <div className="mt-1 space-y-0.5">
          {unpinnedConversations.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground/60 italic text-center">
              Tidak ada percakapan yang cocok.
            </p>
          ) : (
            unpinnedConversations.map(renderItem)
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTargetId)}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Percakapan Ini?</DialogTitle>
            <DialogDescription>
              Tindakan ini akan memindahkan percakapan ke tempat sampah selama 30 hari sebelum dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTargetId(null)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
