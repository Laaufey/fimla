import IconSvg, { StatGraphicProps } from "./IconSvg";

const BAR_COLORS = [
  "var(--stat-icon-soft)",
  "var(--stat-icon-medium)",
  "var(--stat-icon-vivid)",
  "var(--stat-icon-strong)",
];
const BAR_HEIGHTS = [16, 27, 38, 49];
const BAR_X = [9, 23, 37, 51];
const BASELINE = 56;

/** Four ascending bars in progressively stronger lavender/purple tones. */
export default function AverageScoreIcon({ className, title }: StatGraphicProps) {
  return (
    <IconSvg className={className} title={title}>
      {BAR_HEIGHTS.map((height, index) => (
        <rect
          key={index}
          x={BAR_X[index]}
          y={BASELINE - height}
          width="9"
          height={height}
          rx="2"
          fill={BAR_COLORS[index]}
        />
      ))}
    </IconSvg>
  );
}
