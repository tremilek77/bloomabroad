export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <a href="#top" className="flex items-center gap-2.5">
        <BloomMark className="h-7 w-7" />
        <span className="font-serif text-2xl leading-none tracking-tight text-heading">
          BloomAbroad
        </span>
      </a>
    </div>
  )
}

/**
 * The bloom mark — a rose/coral gradient petal-spiral.
 * The gradient is the one warm brand element and stays constant across
 * palettes (it is the logo, not a themed surface).
 */
export function BloomMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="bloom-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0568c" />
          <stop offset="50%" stopColor="#d6336c" />
          <stop offset="100%" stopColor="#b3204e" />
        </linearGradient>
      </defs>
      {/* four overlapping petals rotating around the centre */}
      <g fill="url(#bloom-grad)">
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(0 16 16)" opacity="0.95" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(90 16 16)" opacity="0.9" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(180 16 16)" opacity="0.85" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(270 16 16)" opacity="0.9" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(45 16 16)" opacity="0.7" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(135 16 16)" opacity="0.7" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(225 16 16)" opacity="0.7" />
        <path d="M16 16C16 9 19 3 16 3s0 6 0 13Z" transform="rotate(315 16 16)" opacity="0.7" />
      </g>
      <circle cx="16" cy="16" r="2.6" fill="#fff" opacity="0.9" />
    </svg>
  )
}
