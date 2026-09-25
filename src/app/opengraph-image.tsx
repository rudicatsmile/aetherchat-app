import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "AetherChat - Chatbot AI Modern Bergaya Grok";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07070a",
          backgroundImage:
            "radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.25), transparent 70%), radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15), transparent 50%)",
          fontFamily: "sans-serif",
          color: "white",
          padding: "40px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#8b5cf6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
            }}
          >
            Aether<span style={{ color: "#8b5cf6" }}>Chat</span>
          </span>
        </div>

        <div
          style={{
            fontSize: "42px",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          Chatbot AI Modern Bergaya Grok
        </div>

        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            maxWidth: "750px",
            lineHeight: 1.5,
          }}
        >
          Streaming multi-model super cepat, pencarian web realtime, analitik dokumen, dan enkripsi BYOK tingkat tinggi.
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "36px",
          }}
        >
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              borderRadius: "9999px",
              color: "#c4b5fd",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Groq Llama 3.3
          </div>
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "rgba(6, 182, 212, 0.15)",
              border: "1px solid rgba(6, 182, 212, 0.4)",
              borderRadius: "9999px",
              color: "#67e8f9",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            OpenAI GPT-4o
          </div>
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "9999px",
              color: "#cbd5e1",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            Tavily Web Search
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
