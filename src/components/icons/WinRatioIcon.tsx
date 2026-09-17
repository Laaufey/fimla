import { useId } from "react";
import IconSvg, { StatGraphicProps } from "./IconSvg";

/** Large circle split vertically into a pale half and a vivid purple half. */
export default function WinRatioIcon({ className, title }: StatGraphicProps) {
  const leftClipId = useId();
  const rightClipId = useId();

  return (
    <IconSvg className={className} title={title}>
      <defs>
        <clipPath id={leftClipId}>
          <rect x="0" y="0" width="32" height="64" />
        </clipPath>
        <clipPath id={rightClipId}>
          <rect x="32" y="0" width="32" height="64" />
        </clipPath>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="var(--stat-icon-pale)"
        clipPath={`url(#${leftClipId})`}
      />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="var(--stat-icon-vivid)"
        clipPath={`url(#${rightClipId})`}
      />
    </IconSvg>
  );
}
