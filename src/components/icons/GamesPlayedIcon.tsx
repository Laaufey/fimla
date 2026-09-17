import IconSvg, { StatGraphicProps } from "./IconSvg";

const POSITIONS = [14, 32, 50];

/** 3x3 field of circles at varied lavender opacity, with one accent dot. */
export default function GamesPlayedIcon({ className, title }: StatGraphicProps) {
  const dots = [
    { x: POSITIONS[0], y: POSITIONS[0], opacity: 0.35 },
    { x: POSITIONS[1], y: POSITIONS[0], opacity: 0.55 },
    { x: POSITIONS[2], y: POSITIONS[0], accent: true },
    { x: POSITIONS[0], y: POSITIONS[1], opacity: 0.55 },
    { x: POSITIONS[1], y: POSITIONS[1], opacity: 0.75 },
    { x: POSITIONS[2], y: POSITIONS[1], opacity: 0.55 },
    { x: POSITIONS[0], y: POSITIONS[2], opacity: 0.35 },
    { x: POSITIONS[1], y: POSITIONS[2], opacity: 0.55 },
    { x: POSITIONS[2], y: POSITIONS[2], opacity: 0.35 },
  ];

  return (
    <IconSvg className={className} title={title}>
      {dots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={dot.y}
          r="5"
          fill={dot.accent ? "var(--stat-icon-contrast)" : "var(--stat-icon-soft)"}
          opacity={dot.accent ? 1 : dot.opacity}
        />
      ))}
    </IconSvg>
  );
}
