import React from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <ChatWindow
      conversationId={resolvedParams.id}
      initialTitle="Percakapan Aktif"
    />
  );
}
