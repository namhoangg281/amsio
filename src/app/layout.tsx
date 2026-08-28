import type { Metadata } from "next";
import { Suspense } from "react";
import { Montserrat, DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { unstable_cache } from "next/cache";
import { I18nProvider } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/types";
import ChatboxWidget from "@/components/chatbox/ChatboxWidget";
import { fetchAllLocalesTranslationMap } from "@/lib/cms/queries";
import "./globals.css";

// W-097: cache DB translation strings per-request, bust on string save.
// cache() in Next.js 15 is per-request by default; unstable_cache wraps it
// with a tags-based ISR layer so PATCH /api/v1/cms/strings can invalidate.
//
// Key is versioned because Vercel's Data Cache survives deployments: entries stored
// while the pipeline was broken (no cms GRANTs, schema unexposed, AMSIO_TENANT_ID
// unset) hold an empty map that no redeploy clears. Bump the suffix after fixing a
// fault that poisoned the cache. The time window is only a backstop for writes that
// bypass the tag — a direct DB edit; CMS saves revalidate instantly via the tag.
const getCachedDbStrings = unstable_cache(
  () => fetchAllLocalesTranslationMap(),
  ['cms-all-locale-strings-v3'],
  { tags: ['cms-strings'], revalidate: 300 },
);

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-tagline",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "AMSIO International — Empowering Global Education Leaders",
    template: "%s | AMSIO International",
  },
  description:
    "The Alliance for International Mathematics, Science and Computational Intelligence Olympiad. An international academic competition for Mathematics, Science, Language & Computational Intelligence across 20+ countries.",
  keywords: [
    "AMSIO",
    "AMSIO International",
    "math olympiad",
    "science olympiad",
    "language olympiad",
    "computational intelligence",
    "international competition",
    "student olympiad",
    "global olympiad",
    "academic competition",
    "Grand Finals",
    "young minds",
  ],
  metadataBase: new URL("https://amsio.org"),
  openGraph: {
    title: "AMSIO International — Empowering Global Education Leaders",
    description:
      "The Alliance for International Mathematics, Science and Computational Intelligence Olympiad. Uniting young minds from 20+ countries.",
    url: "https://amsio.org",
    siteName: "AMSIO International",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/logo/Amsio_no_Background.png",
        width: 1200,
        height: 630,
        alt: "AMSIO International",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AMSIO International — Empowering Global Education Leaders",
    description:
      "The Alliance for International Mathematics, Science and Computational Intelligence Olympiad. Uniting young minds from 20+ countries.",
    images: ["/images/logo/Amsio_no_Background.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://amsio.org",
  },
  icons: {
    icon: [
      { url: '/images/logo/amsio-favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon', sizes: '256x256' },
    ],
    apple: '/images/logo/Amsio_App(round)1.png',
    shortcut: '/images/logo/amsio-favicon.svg',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMSIO International",
  alternateName: "Alliance for International Mathematics, Science and Computational Intelligence Olympiad",
  url: "https://amsio.org",
  logo: "https://amsio.org/images/logo/Amsio_no_Background.png",
  description:
    "An international academic olympiad for Mathematics, Science, Language & Computational Intelligence, uniting young minds from 20+ countries worldwide.",
  foundingDate: "2018",
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@amsio.org",
    contactType: "general inquiry",
  },
  sameAs: [],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // SEC-73 Phase 2: read per-request nonce injected by middleware via x-nonce header.
  // Empty string on pages not covered by middleware (marketing pages) — CSP there
  // is Report-Only from next.config.ts so nonce is not required for those paths.
  const nonce = (await headers()).get('x-nonce') ?? '';

  // W-097: DB i18n cutover — CMS edits reach the public site without a redeploy.
  // Empty table or DB error -> dbStrings undefined -> I18nProvider uses TS files only,
  // so the TS locale files stay the compile-time floor under every key.
  let dbStrings: Partial<Record<Locale, Record<string, string>>> | undefined;
  try {
    dbStrings = await getCachedDbStrings();
  } catch {
    // Non-fatal: fall back to TS locale files.
    dbStrings = undefined;
  }

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${dmSans.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
              nonce={nonce}
            />
            <Script id="google-analytics" strategy="afterInteractive" nonce={nonce}>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-sans)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          nonce={nonce}
        />
        <I18nProvider dbStrings={dbStrings}>
          {children}
        </I18nProvider>
        <Suspense fallback={null}>
          <ChatboxWidget />
        </Suspense>
        <SpeedInsights />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </body>
    </html>
  );
}
