"use client";

import { useState, useEffect } from "react";
import {
  getConversationsAction,
  createConversationAction,
  updateConversationTitleAction,
  togglePinConversationAction,
  moveConversationFolderAction,
  softDeleteConversationAction,
} from "@/actions/conversations";
import { getFoldersAction, createFolderAction } from "@/actions/folders";
import { MockConversation, MockFolder, MOCK_CONVERSATIONS, MOCK_FOLDERS } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/client";

export function useConversations() {
  const [conversations, setConversations] = useState<MockConversation[]>(MOCK_CONVERSATIONS);
  const [folders, setFolders] = useState<MockFolder[]>(MOCK_FOLDERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedConvs, loadedFolders] = await Promise.all([
          getConversationsAction(),
          getFoldersAction(),
        ]);
        if (loadedConvs && loadedConvs.length > 0) setConversations(loadedConvs);
        if (loadedFolders && loadedFolders.length > 0) setFolders(loadedFolders);
      } catch {
        // use fallback mock data
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    // Supabase Realtime Sync Channel
    const supabase = createClient();
    const channel = supabase
      .channel("realtime-conversations-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const newConv: MockConversation = {
              id: payload.new.id,
              title: payload.new.title,
              model: payload.new.model,
              provider: payload.new.provider,
              isPinned: payload.new.is_pinned,
              isFavorite: payload.new.is_favorite,
              folderId: payload.new.folder_id,
              updatedAt: "Baru saja",
            };
            setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newConv.id)]);
          } else if (payload.eventType === "UPDATE") {
            setConversations((prev) =>
              prev.map((c) =>
                c.id === payload.new.id
                  ? {
                      ...c,
                      title: payload.new.title,
                      isPinned: payload.new.is_pinned,
                      folderId: payload.new.folder_id,
                    }
                  : c
              )
            );
          } else if (payload.eventType === "DELETE") {
            setConversations((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createConversation = async (title: string, model: string, provider: string, folderId?: string | null) => {
    const res = await createConversationAction({
      title,
      model,
      provider: provider as "groq" | "openai" | "openrouter",
      folderId,
    });

    const newId = res.conversationId || `conv-${Date.now()}`;
    const newConv: MockConversation = {
      id: newId,
      title,
      model,
      provider: provider as "groq" | "openai" | "openrouter",
      isPinned: false,
      isFavorite: false,
      folderId: folderId || null,
      updatedAt: "Baru saja",
    };

    setConversations((prev) => [newConv, ...prev.filter((c) => c.id !== newId)]);
    return newId;
  };

  const renameConversation = async (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    await updateConversationTitleAction(id, newTitle);
  };

  const togglePin = async (id: string) => {
    const target = conversations.find((c) => c.id === id);
    if (!target) return;

    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
    await togglePinConversationAction(id, target.isPinned);
  };

  const moveFolder = async (id: string, folderId: string | null) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, folderId } : c))
    );
    await moveConversationFolderAction(id, folderId);
  };

  const deleteConversation = async (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    await softDeleteConversationAction(id);
  };

  const createFolder = async (name: string) => {
    const res = await createFolderAction({ name, color: "violet", icon: "folder" });
    const newFolder: MockFolder = {
      id: res.folderId || `f-${Date.now()}`,
      name,
      color: "violet",
      icon: "folder",
      count: 0,
    };
    setFolders((prev) => [...prev, newFolder]);
  };

  return {
    conversations,
    folders,
    isLoading,
    createConversation,
    renameConversation,
    togglePin,
    moveFolder,
    deleteConversation,
    createFolder,
  };
}
