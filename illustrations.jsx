/* Hand-drawn-style illustration glyphs.
   All use currentColor — color them via the parent's CSS (default var(--accent-ink)). */

function Squiggle({ className = "", size = 56 }) {
  return (
    <svg className={"illus illus-squiggle " + className} width={size} height={size * 0.5}
      viewBox="0 0 80 40" fill="none" aria-hidden="true">
      <path d="M4 24 Q14 6 22 22 T40 22 T58 22 T76 22"
        stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkles({ className = "", size = 64 }) {
  return (
    <svg className={"illus illus-sparkles " + className} width={size} height={size}
      viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 6 C24 16 27 19 36 22 C27 25 24 28 22 38 C20 28 17 25 8 22 C17 19 20 16 22 6 Z"
        fill="currentColor" />
      <path d="M48 32 C49 38 51 40 56 41.5 C51 43 49 45 48 51 C47 45 45 43 40 41.5 C45 40 47 38 48 32 Z"
        fill="currentColor" />
    </svg>
  );
}

function Burst({ className = "", size = 56 }) {
  return (
    <svg className={"illus illus-burst " + className} width={size} height={size}
      viewBox="0 0 60 60" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <path d="M30 8 L30 52" />
        <path d="M8 30 L52 30" />
        <path d="M14 14 L46 46" />
        <path d="M46 14 L14 46" />
      </g>
    </svg>
  );
}

function Target({ className = "", size = 56 }) {
  return (
    <svg className={"illus illus-target " + className} width={size} height={size}
      viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="4" fill="none" />
      <circle cx="32" cy="32" r="5" fill="currentColor" />
    </svg>
  );
}

function Loop({ className = "", size = 64 }) {
  return (
    <svg className={"illus illus-loop " + className} width={size} height={size * 0.7}
      viewBox="0 0 80 56" fill="none" aria-hidden="true">
      <path
        d="M8 40 C 14 18, 36 8, 50 22 C 60 32, 48 44, 38 38 C 30 33, 36 22, 50 24 C 60 25, 68 30, 74 38"
        stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

Object.assign(window, { Squiggle, Sparkles, Burst, Target, Loop });
