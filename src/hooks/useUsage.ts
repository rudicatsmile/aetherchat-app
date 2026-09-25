"use client";

import { useState, useEffect } from "react";
import { getUserUsageAction } from "@/actions/settings";

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
    messagesUsed: 0,
    messagesLimit: 50,
    imageGenUsed: 0,
    imageGenLimit: 5,
    webSearchUsed: 0,
    webSearchLimit: 20,
    resetHoursRemaining: 12,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const realUsage = await getUserUsageAction();
      setQuota({
        messagesUsed: realUsage.messagesUsed,
        messagesLimit: realUsage.messagesLimit,
        imageGenUsed: realUsage.imageGenUsed,
        imageGenLimit: realUsage.imageGenLimit,
        webSearchUsed: realUsage.webSearchUsed,
        webSearchLimit: realUsage.webSearchLimit,
        resetHoursRemaining: realUsage.resetHoursRemaining,
      });
    } catch {
      // keep current state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const incrementMessageUsage = () => {
    setQuota((prev) => ({
      ...prev,
      messagesUsed: Math.min(prev.messagesUsed + 1, prev.messagesLimit),
    }));
  };

  return {
    quota,
    isLoading,
    refreshUsage: fetchUsage,
    incrementMessageUsage,
  };
}
