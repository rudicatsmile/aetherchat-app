import type { Metadata } from "next";
import { ChatShell } from "@/components/chat/ChatShell";

export const metadata: Metadata = {
  title: "Workspace Chat",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatShell>{children}</ChatShell>;
}
