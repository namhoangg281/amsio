# AMSIO International Website

Marketing website and CMS for AMSIO International (amsio.org).

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in Supabase keys and other env vars
npm run dev
```

## Deploy

Connected to Vercel. Push to `main` triggers production deploy.

## CMS Access

Navigate to `/cms/login` to access the content management system.
Requires a Supabase account with `marketing_staff` role.
