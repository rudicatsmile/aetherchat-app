import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

export function getAiModel(options: {
  provider: "groq" | "openai" | "openrouter";
  modelId: string;
  customApiKey?: string;
}) {
  const { provider, modelId, customApiKey } = options;

  if (provider === "groq") {
    const apiKey = customApiKey || process.env.GROQ_API_KEY || "dummy_key";
    const groq = createGroq({ apiKey });
    return groq(modelId || "llama-3.3-70b-versatile");
  }

  if (provider === "openai") {
    const apiKey = customApiKey || process.env.OPENAI_API_KEY || "dummy_key";
    const openai = createOpenAI({ apiKey });
    return openai(modelId || "gpt-4o-mini");
  }

  if (provider === "openrouter") {
    const apiKey = customApiKey || process.env.OPENROUTER_API_KEY || "dummy_key";
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
    });
    return openrouter(modelId || "mistralai/mistral-large-2407");
  }

  // Fallback to Groq
  const groq = createGroq({ apiKey: process.env.GROQ_API_KEY || "dummy_key" });
  return groq("llama-3.3-70b-versatile");
}
