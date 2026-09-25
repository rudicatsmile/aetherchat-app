import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const envKey = process.env.APP_ENCRYPTION_KEY;
  if (!envKey) {
    // Fallback safe 32-byte hash if not yet set in dev
    return crypto.createHash("sha256").update("aetherchat-dev-secret-key-32b").digest();
  }

  // If base64 encoded
  try {
    const buf = Buffer.from(envKey, "base64");
    if (buf.length === 32) return buf;
  } catch {
    // fallback
  }

  // Ensure 32 bytes via sha256
  return crypto.createHash("sha256").update(envKey).digest();
}

/**
 * Enkripsi API Key menggunakan AES-256-GCM
 * Output format: iv:authTag:encryptedData (hex)
 */
export function encryptApiKey(plainText: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Dekripsi API Key menggunakan AES-256-GCM
 */
export function decryptApiKey(encryptedPayload: string): string {
  try {
    const parts = encryptedPayload.split(":");
    if (parts.length !== 3) {
      throw new Error("Format payload ciphertext tidak valid.");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Gagal mendekripsi API key:", err);
    throw new Error("Gagal mendekripsi API key. Kunci enkripsi server mungkin berbeda.");
  }
}
