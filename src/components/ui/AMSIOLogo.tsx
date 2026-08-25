interface AMSIOLogoProps {
  size?: number;
  variant?: "icon" | "horizontal" | "vertical";
  className?: string;
}

export default function AMSIOLogo({
  size = 40,
  variant = "icon",
  className = "",
}: AMSIOLogoProps) {
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={variant === "icon" ? className : ""}
    >
      {/*
        Logo: ONE letter A (single mark) — matches the official AMSIO app icon.
        Left face white, right face orange, split at the vertical centerline,
        joined by a crossbar. Gold star above the apex, gold arc below.
      */}

      {/* Left face of the A — white (visible on dark backgrounds) */}
      <path d="M50,18 L10,96 L33,96 L45,34 Z" fill="#ffffff" />

      {/* Right face of the A — orange */}
      <path d="M50,18 L90,96 L67,96 L55,34 Z" fill="#E8590C" />

      {/* Crossbar — left half white, right half orange */}
      <path d="M37,71 L50,71 L50,80 L36,80 Z" fill="#ffffff" />
      <path d="M50,71 L63,71 L64,80 L50,80 Z" fill="#E8590C" />

      {/* Gold arc at base spanning both A's */}
      <path
        d="M 5,103 Q 50,116 95,103"
        stroke="#E8A817"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Gold 8-point star above/between the two apexes */}
      <g transform="translate(50,10)">
        <polygon
          points="0,-10 1.5,-3.7 7.1,-7.1 3.7,-1.5 10,0 3.7,1.5 7.1,7.1 1.5,3.7 0,10 -1.5,3.7 -7.1,7.1 -3.7,1.5 -10,0 -3.7,-1.5 -7.1,-7.1 -1.5,-3.7"
          fill="#E8A817"
        />
      </g>
    </svg>
  );

  if (variant === "icon") return icon;

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {icon}
        <div>
          <div className="text-white font-bold text-xl font-[family-name:var(--font-display)] leading-none tracking-wide">
            AMSIO
          </div>
          <div className="text-white/55 text-[10px] tracking-[0.2em] uppercase leading-none mt-0.5">
            International
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {icon}
      <div className="text-center">
        <div className="text-white font-bold text-xl font-[family-name:var(--font-display)] leading-none tracking-wide">
          AMSIO
        </div>
        <div className="text-white/55 text-[10px] tracking-[0.2em] uppercase leading-none mt-1">
          International
        </div>
      </div>
    </div>
  );
}
