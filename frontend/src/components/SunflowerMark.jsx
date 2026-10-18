import { useId } from "react";

/**
 * Hand-drawn sunflower mark (SVG). The petal ring slowly spins via the
 * `.petal-ring` CSS animation; wrapping it in `.sunflower-trigger` adds a
 * gentle sway. Decorative — hidden from assistive tech; any accessible
 * name belongs on the surrounding button/link.
 */
export default function SunflowerMark({ className = "" }) {
  const gid = `sf-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  const seeds = [
    [-4, -3],
    [0, -5],
    [4, -3],
    [-5, 1.5],
    [0, 0],
    [5, 1.5],
    [-3, 4.5],
    [3, 4.5],
  ];

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe37a" />
          <stop offset="100%" stopColor="#ffab2e" />
        </linearGradient>
      </defs>
      {/* stem + leaf */}
      <path
        d="M31 42c-5.5 2.5-9 7-10 13h5.5c1-2.8 2.6-5 4.5-6.7 1.9 1.7 3.5 3.9 4.5 6.7H41c-1-6-4.5-10.5-10-13z"
        fill="#447849"
      />
      <g transform="translate(32 27)">
        <g className="petal-ring" fill={`url(#${gid})`} stroke="#dd8a00" strokeWidth="0.6">
          {petals.map((deg) => (
            <ellipse key={deg} rx="4.6" ry="9.5" transform={`rotate(${deg}) translate(0 -12.5)`} />
          ))}
        </g>
        <circle r="9.6" fill="#653913" />
        <circle r="9.6" fill="none" stroke="#472a0d" strokeWidth="1.3" />
        {seeds.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.05" fill="#3d220b" />
        ))}
        <circle r="3.8" fill="#7d4a1c" opacity="0.55" />
      </g>
    </svg>
  );
}
