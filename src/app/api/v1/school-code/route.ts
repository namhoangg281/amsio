// Public endpoint — called during school registration BEFORE user has a session.
// Auth is intentionally omitted: the caller is an unauthenticated registrant.
// Rate limiting prevents brute-force code harvesting.

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { checkRateLimitAsync } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_ATTEMPTS = 5;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;

// ---------------------------------------------------------------------------
// Rate limiting (Upstash Redis, per IP, 10 req/min — falls back to in-memory
// if UPSTASH_REDIS_REST_URL/TOKEN not configured. SEC-18 fix: previous
// in-memory-only Map did not survive serverless cold-start/multi-instance.)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------

const RequestSchema = z.object({
  countryCode: z
    .string()
    .min(2)
    .max(3)
    .regex(/^[A-Z]+$/, "countryCode must be uppercase letters only"),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateCandidate(countryCode: string): string {
  const prefix = countryCode === "XX" ? "INT" : countryCode;
  const bytes = crypto.randomBytes(CODE_LENGTH);
  let suffix = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    suffix += CHARS[bytes[i] % CHARS.length];
  }
  return `${prefix}-${suffix}`;
}

// ---------------------------------------------------------------------------
// POST /api/v1/school-code
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await checkRateLimitAsync(`school-code:${ip}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { type: "rate_limited", message: "ITRAN-REG-003: Too many requests" },
      { status: 429 }
    );
  }

  // Parse + validate
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { type: "parse_error", message: "ITRAN-REG-001: Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = RequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      {
        type: "validation_error",
        message: "ITRAN-REG-002: Request validation failed",
        errors: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { countryCode } = parsed.data;

  // Supabase anon client — read-only uniqueness check against public.schools
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Retry until unique code found (max MAX_ATTEMPTS)
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = generateCandidate(countryCode);

    // SEC-45: public.schools is now a compat VIEW; query core.institutions directly
    const { data, error } = await supabase
      .schema("core")
      .from("institutions")
      .select("id")
      .eq("institution_code", candidate)
      .eq("type", "school")
      .in("source", ["migrated_from_public_schools", "schools_view_insert"])
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      // DB error — return the candidate anyway; signUp uniqueness is a
      // secondary safeguard. Log server-side only.
      console.error("[school-code] DB check error:", error.message);
      return NextResponse.json({ code: candidate });
    }

    if (!data) {
      // No collision — code is unique
      return NextResponse.json({ code: candidate });
    }

    // Collision — retry
  }

  return NextResponse.json(
    {
      type: "server_error",
      message: "ITRAN-REG-004: Could not generate a unique school code",
    },
    { status: 500 }
  );
}
