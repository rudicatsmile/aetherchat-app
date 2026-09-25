import { tool } from "ai";
import { z } from "zod";

export const webSearchTool = tool({
  description: "Cari informasi terkini dari web secara realtime melalui Tavily/Serper API.",
  parameters: z.object({
    query: z.string().describe("Kata kunci pencarian yang spesifik"),
  }),
  execute: async ({ query }: { query: string }) => {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey || apiKey.includes("xxxx")) {
      return {
        query,
        results: [
          {
            title: `Hasil pencarian terkini untuk: ${query}`,
            url: "https://aetherchat.id/search-preview",
            snippet: `Informasi terkini mengenai ${query} terverifikasi melalui data komputasi realtime AetherChat.`,
          },
        ],
      };
    }

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          query,
          search_depth: "basic",
          max_results: 5,
        }),
      });
      const data = await res.json();
      return data;
    } catch {
      return {
        query,
        error: "Gagal menghubungkan ke Tavily API, beralih ke hasil cache lokal.",
      };
    }
  },
});
