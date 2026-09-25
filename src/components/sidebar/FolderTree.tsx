"use client";

import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Plus,
  Briefcase,
  GraduationCap,
  Activity,
  Lightbulb,
} from "lucide-react";
import { MockFolder } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FolderTreeProps {
  folders: MockFolder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
}

const getFolderIcon = (iconName: string) => {
  switch (iconName) {
    case "briefcase":
      return <Briefcase className="h-3.5 w-3.5 text-violet-400" />;
    case "graduation-cap":
      return <GraduationCap className="h-3.5 w-3.5 text-blue-400" />;
    case "activity":
      return <Activity className="h-3.5 w-3.5 text-emerald-400" />;
    case "lightbulb":
      return <Lightbulb className="h-3.5 w-3.5 text-amber-400" />;
    default:
      return <Folder className="h-3.5 w-3.5 text-primary" />;
  }
};

export function FolderTree({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderTreeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName("");
    setShowNewFolderModal(false);
  };

  return (
    <div className="w-full">
      {/* Folder Section Header */}
      <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold tracking-wider uppercase text-muted-foreground/70">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
          <span>Folder & Kategori</span>
        </button>

        <button
          onClick={() => setShowNewFolderModal(true)}
          className="rounded p-0.5 hover:bg-secondary hover:text-foreground transition-colors"
          title="Buat Folder Baru"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Collapsible List */}
      {isOpen && (
        <div className="mt-1 space-y-0.5 pl-1">
          {/* All Chats Option */}
          <button
            onClick={() => onSelectFolder(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
              selectedFolderId === null
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Semua Percakapan</span>
            </div>
          </button>

          {/* Individual Folders */}
          {folders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            return (
              <button
                key={folder.id}
                onClick={() => onSelectFolder(isSelected ? null : folder.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                  isSelected
                    ? "bg-primary/15 text-primary border border-primary/20 font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {getFolderIcon(folder.icon)}
                  <span className="truncate">{folder.name}</span>
                </div>
                {folder.count !== undefined && (
                  <span className="rounded-full bg-secondary px-1.5 py-0.2 text-[10px] text-muted-foreground font-mono">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* New Folder Modal */}
      <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Buat Folder Baru</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="text-xs text-muted-foreground block mb-2">
                Nama Folder (maks 60 karakter)
              </label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Contoh: Riset Pasar 2025"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewFolderModal(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={!newFolderName.trim()}>
                Simpan Folder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
