"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { COUNTRIES } from "@/lib/constants";

const GEO_URL = "/data/countries-110m.json";

// world-atlas uses ISO 3166-1 numeric codes as geo.id
const ALPHA2_TO_NUMERIC: Record<string, string> = {
  AU: "036", KH: "116", CN: "156", IN: "356", ID: "360",
  JP: "392", MY: "458", PH: "608", SG: "702", KR: "410", TH: "764", VN: "704",
  US: "840", BR: "076", CA: "124",
  GB: "826", DE: "276", PL: "616", ES: "724",
};

const ACTIVE_NUMERIC_CODES: Set<string> = new Set(
  COUNTRIES.map((c) => ALPHA2_TO_NUMERIC[c.code as string]).filter(Boolean)
);

// Per-country label offset [dx, dy] — tuned to avoid overlap in dense SE Asia cluster
// Positive dx = right, positive dy = down (SVG coords)
const LABEL_OFFSET: Record<string, [number, number]> = {
  // Asia-Pacific
  australia:       [  0,  14],
  cambodia:        [-22, -12],
  china:           [ -6, -14],
  india:           [ -4, -14],
  indonesia:       [  0,  14],
  japan:           [ 10,  -8],
  malaysia:        [-26,   6],
  philippines:     [ 12,   0],
  singapore:       [  8,  12],
  "south-korea":   [ 10, -12],
  thailand:        [-26,  -2],
  // Americas
  "united-states": [  0, -14],
  brazil:          [ 14,   0],
  canada:          [  0, -14],
  // Europe
  "united-kingdom":[ -2, -14],
  germany:         [  0,  14],
  poland:          [ 14,   0],
  spain:           [  0,  14],
};

type CountryEntry = (typeof COUNTRIES)[number];

export default function WorldPartnerMap() {
  const router = useRouter();
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ aspectRatio: "2/1", border: "1px solid #1B3A5C" }}
    >
      <ComposableMap
        width={800}
        height={400}
        projection="geoEqualEarth"
        projectionConfig={{ center: [20, 10], scale: 140 }}
        className="w-full h-full"
        style={{ background: "#050f1e" } as React.CSSProperties}
      >
        <defs>
          {/* Gold gradient fill for partner countries */}
          <radialGradient id="partnerFill" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f5cc4a" />
            <stop offset="100%" stopColor="#c8880e" />
          </radialGradient>

          {/* Subtle glow filter for active countries */}
          <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Drop shadow for label pills */}
          <filter id="pillShadow" x="-30%" y="-60%" width="160%" height="220%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>

          {/* Glow ring for hovered marker */}
          <filter id="markerGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Countries ── */}
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const isActive = ACTIVE_NUMERIC_CODES.has(String(geo.id));
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isActive ? "url(#partnerFill)" : "#162236"}
                  stroke="#050f1e"
                  strokeWidth={0.4}
                  filter={isActive ? "url(#countryGlow)" : undefined}
                  style={{
                    default: {
                      fill: isActive ? "url(#partnerFill)" : "#162236",
                      outline: "none",
                    },
                    hover: {
                      fill: isActive ? "#f5cc4a" : "#1e3050",
                      outline: "none",
                    },
                    pressed: {
                      fill: isActive ? "#d4a017" : "#162236",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* ── Markers (flag + label) ── */}
        {COUNTRIES.map((country: CountryEntry) => {
          const isHovered = hoveredSlug === country.slug;
          const [dx, dy] = LABEL_OFFSET[country.slug] ?? [0, -17];
          const labelWidth = country.name.length * 6.2 + 14;

          return (
            <Marker
              key={country.slug}
              coordinates={[country.lng, country.lat]}
              onMouseEnter={() => setHoveredSlug(country.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onClick={() => router.push(`/countries/${country.slug}`)}
              style={{
                default: { cursor: "pointer" },
                hover:   { cursor: "pointer" },
                pressed: { cursor: "pointer" },
              }}
            >
              {/* Outer glow ring — hover only */}
              {isHovered && (
                <circle
                  r={13}
                  fill="rgba(232,168,23,0.18)"
                  stroke="#E8A817"
                  strokeWidth={1}
                  filter="url(#markerGlow)"
                />
              )}

              {/* Inner dot */}
              <circle
                r={isHovered ? 5.5 : 3.5}
                fill={isHovered ? "#f5cc4a" : "#E8A817"}
                stroke="#050f1e"
                strokeWidth={1.2}
                style={{ transition: "r 0.15s ease" }}
              />

              {/* Real flag (SVG image) */}
              <image
                href={`/images/flags/${country.code.toLowerCase()}.svg`}
                width={isHovered ? 18 : 14}
                height={isHovered ? 12 : 9.3}
                x={isHovered ? -9 : -7}
                y={isHovered ? -14 : -12.65}
                preserveAspectRatio="xMidYMid meet"
                style={{ pointerEvents: "none" }}
              />

              {/* Country name pill — always visible */}
              <g
                transform={`translate(${dx}, ${dy})`}
                filter="url(#pillShadow)"
              >
                <rect
                  x={-labelWidth / 2}
                  y={-8}
                  width={labelWidth}
                  height={15}
                  rx={3}
                  fill={isHovered ? "#E8A817" : "rgba(5,15,30,0.82)"}
                  stroke={isHovered ? "#f5cc4a" : "#E8A817"}
                  strokeWidth={0.7}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={7}
                  fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
                  fontWeight={isHovered ? "700" : "600"}
                  fill={isHovered ? "#050f1e" : "#E8A817"}
                  letterSpacing={0.4}
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {country.name.toUpperCase()}
                </text>
              </g>
            </Marker>
          );
        })}
      </ComposableMap>
    </div>
  );
}
