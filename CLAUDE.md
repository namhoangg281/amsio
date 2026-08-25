# AMSIO Website — Standalone

## Stack
- Next.js 15 (server deployment, NOT static export)
- Supabase Auth + RLS
- Tailwind CSS 4
- i18n: 5 locales (en/vi/zh/fr/ar)

## Supabase
- Project: `nnqwjreinqiohdxtqzkk.supabase.co`
- Schemas: `cms` (articles, collections, translations, media), `core` (users, institutions), `exam` (competitions, results, certificates)

## Environment Variables (Vercel)
| Variable | Required |
|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (CMS writes) |
| `AMSIO_TENANT_ID` | Yes (`00000000-0000-0000-0000-000000000002`) |
| `ANTHROPIC_API_KEY` | Yes (chatbot) |
| `GEMINI_API_KEY` | Yes (chatbot fallback) |
| `NEXT_PUBLIC_GA_ID` | Optional (`G-95XZMVC7DH`) |
| `UPSTASH_REDIS_REST_URL` | Yes (rate limiting) |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (rate limiting) |

## CMS Auth
- Login at `/cms/login`
- Role: `marketing_staff` in Supabase JWT claims
- Auth uses `@supabase/ssr` directly (no external auth packages)

## Key Directories
- `src/app/` — Next.js pages (public site + CMS)
- `src/lib/cms/` — CMS queries, auth, i18n
- `src/lib/gpu/` — WebGPU/WebGL renderer (3D chatbox fox)
- `src/components/` — Shared React components
- `supabase/migrations/` — Database migrations

## Known Debt
- No article approval workflow: `articles_status_check` is draft|published only
- `/api/v1/cms/health` is a diagnostic route — remove before production
