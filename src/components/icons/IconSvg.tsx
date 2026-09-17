import { ReactNode, useId } from "react";

type IconSvgProps = {
  viewBox?: string;
  className?: string;
  title?: string;
  children: ReactNode;
};

/** Props shared by every individual stat graphic (WinsIcon, LossesIcon, ...). */
export type StatGraphicProps = {
  className?: string;
  title?: string;
};

/**
 * Shared <svg> shell for the stat icons: fixed viewBox + fill-parent sizing,
 * and the decorative-by-default / accessible-title-on-request contract used
 * by StatIcon (see StatIcon.tsx).
 */
export default function IconSvg({
  viewBox = "0 0 64 64",
  className,
  title,
  children,
}: IconSvgProps) {
  const titleId = useId();
  const hasTitle = Boolean(title);

  return (
    <svg
      viewBox={viewBox}
      width="100%"
      height="100%"
      className={className}
      focusable="false"
      aria-hidden={hasTitle ? undefined : true}
      role={hasTitle ? "img" : undefined}
      aria-labelledby={hasTitle ? titleId : undefined}
    >
      {hasTitle ? <title id={titleId}>{title}</title> : null}
      {children}
    </svg>
  );
}
