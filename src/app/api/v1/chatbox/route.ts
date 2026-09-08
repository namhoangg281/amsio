// Public endpoint — no auth required.
// SEC-18/chatbox fix: rate limiting is now Upstash Redis-backed (falls back to
// in-memory if UPSTASH_REDIS_REST_URL/TOKEN not configured) — the previous
// in-memory-only Map did not survive serverless cold-start/multi-instance,
// so the "20 req/min" limit was weaker in practice than the code implied.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GEMINI_SYSTEM_PROMPT_PREFIX } from "@/data/chatbox/index";
import fs from "fs";
import path from "path";
import { checkRateLimitAsync } from "@/lib/rate-limit";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

const HistoryItemSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const ChatboxRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z.array(HistoryItemSchema).max(20).optional(),
});

// ---------------------------------------------------------------------------
// POST /api/v1/chatbox
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-000: Content-Type must be application/json" },
      { status: 415 }
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-001: Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = ChatboxRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { type: "validation_error", error: "ITRAN-CHATBOX-002: Request validation failed", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { message, history } = parsed.data;

  // Rate limit: 20 requests per minute per IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimitAsync(`chat:${clientIp}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // Detect language and force it into the message
  function detectLang(text: string): { code: string; label: string } {
    // Vietnamese — diacritics unique to Vietnamese
    if (/[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i.test(text))
      return { code: "vi", label: "Vietnamese" };
    // Japanese — hiragana or katakana
    if (/[぀-ゟ゠-ヿ]/.test(text))
      return { code: "ja", label: "Japanese" };
    // Korean — hangul syllables
    if (/[가-힯ᄀ-ᇿ]/.test(text))
      return { code: "ko", label: "Korean" };
    // Thai — Thai script
    if (/[฀-๿]/.test(text))
      return { code: "th", label: "Thai" };
    // Chinese — CJK unified ideographs (after JP/KR to avoid false positives)
    if (/[一-鿿㐀-䶿]/.test(text))
      return { code: "zh", label: "Chinese" };
    // Arabic
    if (/[؀-ۿ]/.test(text))
      return { code: "ar", label: "Arabic" };
    // Burmese
    if (/[က-႟]/.test(text))
      return { code: "my", label: "Burmese" };
    // Khmer
    if (/[ក-៿]/.test(text))
      return { code: "km", label: "Khmer" };
    // French — accent chars + common words
    if (/[éèêëàâùûüçœîïôÿ]/i.test(text) || /\b(bonjour|merci|je|tu|nous|vous|est|une|les|des|du|pour|avec|comment|qu[' ]est)\b/i.test(text))
      return { code: "fr", label: "French" };
    // Indonesian / Malay — common words (Latin script, no unique chars)
    if (/\b(halo|apa|adalah|saya|tolong|jelaskan|terima|kasih|bagaimana|selamat|anda|ini|itu|dengan|untuk|dari)\b/i.test(text))
      return { code: "id", label: "Indonesian" };
    // Filipino / Tagalog
    if (/\b(ano|kumusta|kamusta|salamat|po|opo|mga|ng|sa|at|ay|ito|yan|hindi|oo|magandang)\b/i.test(text))
      return { code: "fil", label: "Filipino" };
    return { code: "en", label: "English" };
  }

  const detectedLang = detectLang(message);
  const langInstruction = `[SYSTEM LANGUAGE LOCK: You MUST respond ENTIRELY in ${detectedLang.label}. Every single word of your response must be ${detectedLang.label}. Do NOT use any other language.]\n\n`;

  // Read compiled knowledge base
  const kbPath = path.join(process.cwd(), "src/data/chatbox/kb_compiled.md");
  let kb = "";
  try {
    kb = fs.readFileSync(kbPath, "utf-8");
  } catch {
    kb = "(Knowledge base unavailable — answer from general knowledge about AMSIO if possible.)";
  }

  const systemPrompt = GEMINI_SYSTEM_PROMPT_PREFIX + kb;

  // ---------------------------------------------------------------------------
  // Try Claude (Anthropic) first, fallback to Gemini
  // ---------------------------------------------------------------------------

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!anthropicKey && !geminiKey) {
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-003: AI not configured" },
      { status: 503 }
    );
  }

  // --- Claude path ---
  if (anthropicKey) {
    interface AnthropicMessage {
      role: "user" | "assistant";
      content: string;
    }

    const messages: AnthropicMessage[] = [
      ...(history ?? []).map((h) => ({
        role: h.role === "user" ? ("user" as const) : ("assistant" as const),
        content: h.content,
      })),
      { role: "user" as const, content: langInstruction + message },
    ];

    let claudeRes: Response;
    try {
      claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: systemPrompt,
          messages,
        }),
      });
    } catch {
      return NextResponse.json(
        { error: "ITRAN-CHATBOX-004: Failed to reach AI provider" },
        { status: 502 }
      );
    }

    if (claudeRes.ok) {
      interface ClaudeResponse {
        content?: Array<{ type: string; text: string }>;
      }
      const data = (await claudeRes.json()) as ClaudeResponse;
      const text = data.content?.find((b) => b.type === "text")?.text ?? "Sorry, I couldn't generate a response.";
      return NextResponse.json({ reply: text });
    }

    if (claudeRes.status === 429) {
      return NextResponse.json({ error: "QUOTA_EXCEEDED" }, { status: 200 });
    }
    // fallthrough to Gemini if Claude fails for other reasons
  }

  // --- Gemini path ---
  if (!geminiKey) {
    return NextResponse.json({ error: "QUOTA_EXCEEDED" }, { status: 200 });
  }

  interface GeminiContent {
    role: "user" | "model";
    parts: Array<{ text: string }>;
  }

  const contents: GeminiContent[] = [
    ...(history ?? []).map((h) => ({
      role: h.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: h.content }],
    })),
    { role: "user" as const, parts: [{ text: langInstruction + message }] },
  ];

  let geminiRes: Response;
  try {
    geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 1024, temperature: 0.65 },
        }),
      }
    );
  } catch {
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-004: Failed to reach AI provider" },
      { status: 502 }
    );
  }

  if (!geminiRes.ok) {
    if (geminiRes.status === 429) {
      return NextResponse.json({ error: "QUOTA_EXCEEDED" }, { status: 200 });
    }
    const errBody = await geminiRes.text().catch(() => "");
    console.error("[chatbox] Gemini error", geminiRes.status, errBody.slice(0, 300));
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-005: AI provider returned an error", detail: errBody.slice(0, 200) },
      { status: 500 }
    );
  }

  interface GeminiResponse {
    candidates?: Array<{ content: { parts: Array<{ text: string }> } }>;
  }

  let data: GeminiResponse;
  try {
    data = (await geminiRes.json()) as GeminiResponse;
  } catch {
    return NextResponse.json(
      { error: "ITRAN-CHATBOX-006: Failed to parse AI response" },
      { status: 500 }
    );
  }

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I couldn't generate a response.";

  return NextResponse.json({ reply: text });
}
