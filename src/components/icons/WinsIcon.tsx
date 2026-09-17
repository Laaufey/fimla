import IconSvg, { StatGraphicProps } from "./IconSvg";

/** Outlined 2x3 tile grid with a small selection of filled tiles. */
export default function WinsIcon({ className, title }: StatGraphicProps) {
  return (
    <IconSvg className={className} title={title}>
      <g strokeWidth="2" stroke="var(--stat-icon-line)" fill="none">
        <rect x="10" y="6" width="20" height="15" rx="3" />
        <rect
          x="34"
          y="6"
          width="20"
          height="15"
          rx="3"
          fill="var(--stat-icon-soft)"
          stroke="none"
        />
        <rect
          x="10"
          y="25"
          width="20"
          height="15"
          rx="3"
          fill="var(--stat-icon-soft)"
          stroke="none"
        />
        <rect x="34" y="25" width="20" height="15" rx="3" />
        <rect x="10" y="44" width="20" height="15" rx="3" />
        <rect x="34" y="44" width="20" height="15" rx="3" />
      </g>
    </IconSvg>
  );
}
