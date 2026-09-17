import { ReactNode } from "react";

type GameToolbarProps = {
  title: string;
  children?: ReactNode;
};

/** Compact heading + controls row shared by Wordle, Quordle, and Spelling
 * Bee. Callers compose whatever controls belong on the right (palette
 * switch, icon buttons, ...) as children. */
const GameToolbar = ({ title, children }: GameToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-border-subtle pb-1.5">
    <h1 className="font-display text-xl font-extrabold tracking-tight-brand sm:text-2xl">
      {title}
    </h1>
    <div className="flex items-center gap-1.5">{children}</div>
  </div>
);

export default GameToolbar;
