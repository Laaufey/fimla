import { ReactNode } from "react";

/**
 * Shared compact, responsive shell for the word/letter game pages
 * (Wordle, Quordle, Spelling Bee). Keeps vertical spacing tight and
 * clamp()-based so the playable area fits the viewport without the large
 * fixed gaps the pages used to have, while still allowing the page to
 * scroll naturally as a fallback (no overflow:hidden here).
 */
const GameShell = ({
  children,
  className = "",
  maxWidthClassName = "max-w-lg",
}: {
  children: ReactNode;
  className?: string;
  /** Override the shell's max width - e.g. Quordle needs more horizontal
   * room at larger breakpoints once its four boards sit in one row. */
  maxWidthClassName?: string;
}) => (
  <div
    className={`mx-auto flex w-full ${maxWidthClassName} flex-col gap-[clamp(0.4rem,1.5vh,0.9rem)] py-2 short:gap-1 ${className}`}
  >
    {children}
  </div>
);

export default GameShell;
