import { useId } from "react";
import IconSvg, { StatGraphicProps } from "./IconSvg";

/** Two stacked domes: a strong upper half over a pale lower half. */
export default function LossesIcon({ className, title }: StatGraphicProps) {
  const upperClipId = useId();
  const lowerClipId = useId();

  return (
    <IconSvg className={className} title={title}>
      <defs>
        <clipPath id={upperClipId}>
          <rect x="0" y="0" width="64" height="30" />
        </clipPath>
        <clipPath id={lowerClipId}>
          <rect x="0" y="34" width="64" height="30" />
        </clipPath>
      </defs>
      <circle
        cx="32"
        cy="26"
        r="19"
        fill="var(--stat-icon-strong)"
        clipPath={`url(#${upperClipId})`}
      />
      <circle
        cx="32"
        cy="38"
        r="19"
        fill="var(--stat-icon-soft)"
        clipPath={`url(#${lowerClipId})`}
      />
    </IconSvg>
  );
}
