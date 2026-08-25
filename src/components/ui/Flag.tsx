const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface FlagProps {
  /** ISO 3166-1 alpha-2 country code, e.g. "us", "gb". Case-insensitive. */
  code?: string | null;
  /** Tailwind sizing/styling classes (e.g. "w-8 rounded-sm shadow"). */
  className?: string;
  /** Accessible label. If omitted the flag is treated as decorative. */
  alt?: string;
}

/**
 * Renders a real SVG flag bundled in /public/images/flags/<code>.svg
 * (offline — no external CDN). Replaces emoji flags that fail to render
 * on some platforms (e.g. Windows shows 🇺🇸 as "US").
 */
export default function Flag({ code, className = "", alt }: FlagProps) {
  if (!code) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${BASE}/images/flags/${code.toLowerCase()}.svg`}
      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      className={`inline-block object-contain align-middle ${className}`}
      loading="lazy"
    />
  );
}
