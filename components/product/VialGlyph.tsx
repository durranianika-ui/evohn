import { site } from "@/data/site";

/**
 * Vector rendering of the EVOHN vial, drawn to the proportions in Brand
 * Identity Kit §05 and §09: matte cap, borosilicate body, textured label
 * with a torn bottom edge, and the wordmark set small and centred.
 *
 * Used as the product plate wherever a photograph is not yet available, and
 * as the loading state beneath one that is. It is decorative — the product
 * name is always adjacent in real text.
 */
export function VialGlyph({
  labelColor = "var(--color-carbon)",
  labelIsLight = false,
  caption,
  className,
  seed = 0,
}: {
  labelColor?: string;
  labelIsLight?: boolean;
  /** Small line above the wordmark, e.g. the compound name. */
  caption?: string;
  className?: string;
  /** Varies the torn edge so a grid of vials is not visibly repetitive. */
  seed?: number;
}) {
  const id = `vial-${seed}`;
  const ink = labelIsLight ? "#111111" : "#F6F5F2";

  // Torn bottom edge — deterministic jitter derived from `seed`.
  const tear = Array.from({ length: 13 }, (_, i) => {
    const x = 78 + (i * 144) / 12;
    const wobble = Math.sin((i + 1) * (1.7 + seed * 0.31)) * 5.5;
    return `${x},${500 + wobble}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 300 640"
      className={className}
      role="presentation"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="18%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="82%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.10" />
        </linearGradient>

        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="22%" stopColor="#3a3a38" />
          <stop offset="55%" stopColor="#141413" />
          <stop offset="88%" stopColor="#2b2b29" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>

        <linearGradient id={`${id}-label`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="24%" stopColor="#ffffff" stopOpacity="0.10" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.26" />
        </linearGradient>

        <radialGradient id={`${id}-shadow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b5049" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5b5049" stopOpacity="0" />
        </radialGradient>

        <clipPath id={`${id}-body`}>
          <rect x="78" y="118" width="144" height="470" rx="12" />
        </clipPath>
      </defs>

      {/* Contact shadow on the plinth */}
      <ellipse cx="150" cy="596" rx="104" ry="20" fill={`url(#${id}-shadow)`} />

      {/* Glass body */}
      <rect
        x="78"
        y="118"
        width="144"
        height="470"
        rx="12"
        fill={`url(#${id}-glass)`}
      />

      {/* Liquid meniscus, visible below the label */}
      <g clipPath={`url(#${id}-body)`}>
        <rect x="78" y="512" width="144" height="76" fill="#ffffff" opacity="0.16" />
        <ellipse cx="150" cy="512" rx="72" ry="7" fill="#ffffff" opacity="0.2" />
      </g>

      {/* Label with torn bottom edge (kit §09) */}
      <g clipPath={`url(#${id}-body)`}>
        <path
          d={`M78,170 L222,170 L222,500 L${tear.split(" ").reverse().join(" L")} Z`}
          fill={labelColor}
        />
        <path
          d={`M78,170 L222,170 L222,500 L${tear.split(" ").reverse().join(" L")} Z`}
          fill={`url(#${id}-label)`}
        />
      </g>

      {/* Label typography — minimal, precise hierarchy (kit §09) */}
      {caption ? (
        <text
          x="96"
          y="204"
          fill={ink}
          opacity="0.85"
          fontSize="15"
          fontFamily="var(--font-sans)"
          letterSpacing="0.5"
        >
          {caption}
        </text>
      ) : null}

      <text
        x="150"
        y="330"
        fill={ink}
        textAnchor="middle"
        fontSize="34"
        fontFamily="var(--font-display)"
        fontWeight="300"
        letterSpacing="9"
        // Wide tracking pushes the optical centre right; nudge it back.
        dx="-4.5"
      >
        {site.name}
      </text>

      <line
        x1="96"
        y1="366"
        x2="204"
        y2="366"
        stroke={ink}
        strokeOpacity="0.28"
        strokeWidth="1"
      />

      {/* Neck and shoulder */}
      <path
        d="M112 118 L112 96 Q112 90 118 90 L182 90 Q188 90 188 96 L188 118 Z"
        fill={`url(#${id}-glass)`}
      />

      {/* Crimp collar */}
      <rect x="106" y="78" width="88" height="16" rx="3" fill="#8e8a85" opacity="0.55" />

      {/* Matte cap */}
      <rect x="100" y="18" width="100" height="66" rx="7" fill={`url(#${id}-cap)`} />
      {Array.from({ length: 7 }, (_, i) => (
        <line
          key={i}
          x1={110 + i * 13}
          y1="26"
          x2={110 + i * 13}
          y2="76"
          stroke="#ffffff"
          strokeOpacity="0.07"
          strokeWidth="2"
        />
      ))}
      <rect x="100" y="18" width="100" height="9" rx="4" fill="#ffffff" opacity="0.09" />

      {/* Specular highlight down the glass */}
      <rect
        x="94"
        y="132"
        width="9"
        height="440"
        rx="4"
        fill="#ffffff"
        opacity="0.2"
      />
    </svg>
  );
}
