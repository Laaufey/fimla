import IconSvg, { StatGraphicProps } from "./IconSvg";

const TILES = [
  { x: 8, y: 8, fill: "var(--stat-icon-strong)" },
  { x: 34, y: 8, fill: "var(--stat-icon-pale)" },
  { x: 8, y: 34, fill: "var(--stat-icon-pale)" },
  { x: 34, y: 34, fill: "var(--stat-icon-strong)" },
];

/** 2x2 grid alternating pale and deep purple tiles (checkerboard). */
export default function TotalScoreIcon({ className, title }: StatGraphicProps) {
  return (
    <IconSvg className={className} title={title}>
      {TILES.map((tile, index) => (
        <rect
          key={index}
          x={tile.x}
          y={tile.y}
          width="22"
          height="22"
          rx="3"
          fill={tile.fill}
        />
      ))}
    </IconSvg>
  );
}
