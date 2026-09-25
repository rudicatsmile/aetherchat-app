export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "user" | "admin";
  locale: string;
  theme: "dark" | "light" | "system";
}

export interface FolderItem {
  id: string;
  name: string;
  color: string;
  icon: string;
  parentId?: string | null;
  count?: number;
}

export interface ConversationItem {
  id: string;
  title: string;
  model: string;
  provider: "groq" | "openai" | "openrouter";
  isPinned: boolean;
  isFavorite: boolean;
  folderId?: string | null;
  updatedAt: string;
  lastMessageSnippet?: string;
}

export interface ChatMessageItem {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  provider?: string;
  createdAt: string;
  totalTokens?: number;
  durationMs?: number;
}

// Aliases for compatibility
export type MockUser = UserProfile;
export type MockFolder = FolderItem;
export type MockConversation = ConversationItem;
export type MockMessage = ChatMessageItem;
