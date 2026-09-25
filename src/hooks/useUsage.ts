"use client";

import { useState, useEffect } from "react";

export interface UsageQuota {
  messagesUsed: number;
  messagesLimit: number;
  imageGenUsed: number;
  imageGenLimit: number;
  webSearchUsed: number;
  webSearchLimit: number;
  resetHoursRemaining: number;
}

export function useUsage() {
  const [quota, setQuota] = useState<UsageQuota>({
    messagesUsed: 18,
    messagesLimit: 50,
    imageGenUsed: 2,
    imageGenLimit: 5,
    webSearchUsed: 6,
    webSearchLimit: 20,
    resetHoursRemaining: 13,
  });

  const incrementMessageUsage = () => {
    setQuota((prev) => ({
      ...prev,
      messagesUsed: Math.min(prev.messagesUsed + 1, prev.messagesLimit),
    }));
  };

  return {
    quota,
    incrementMessageUsage,
  };
}
