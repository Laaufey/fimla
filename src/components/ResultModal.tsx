import { ReactNode, useEffect, useId, useRef } from "react";
import { HiX } from "react-icons/hi";

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Four small lavender squares in a 2x2 grid - the Quordle completion mark. */
export const QuordleCompletionIcon = () => (
  <div
    aria-hidden="true"
    className="grid shrink-0 grid-cols-2 grid-rows-2 gap-0.5"
  >
    <span className="h-1.5 w-1.5 rounded-[2px] bg-lavender" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-lavender" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-lavender" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-lavender" />
  </div>
);

/** One small five-tile row, colored with the existing tile-state tokens -
 * the Wordle completion mark. */
export const WordleCompletionIcon = () => (
  <div aria-hidden="true" className="flex shrink-0 gap-0.5">
    <span className="h-1.5 w-1.5 rounded-[2px] bg-tile-correct" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-tile-present" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-tile-correct" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-tile-present" />
    <span className="h-1.5 w-1.5 rounded-[2px] bg-tile-correct" />
  </div>
);

/** A single small hexagon, echoing the honeycomb grid - the Spelling Bee
 * completion mark. */
export const SpellingBeeCompletionIcon = () => (
  <span
    aria-hidden="true"
    className="h-3 w-3 shrink-0 bg-nav-interactive"
    style={{
      clipPath:
        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    }}
  />
);

type ResultModalProps = {
  /** e.g. "Wordle" / "Quordle" - shown in the small completion label. */
  gameName: string;
  /** Small game-specific mark shown beside the completion label. */
  icon: ReactNode;
  /** Large result heading, e.g. "You won!" / "Almost!". */
  title: string;
  /** Short supporting line under the heading. */
  message: ReactNode;
  score: number;
  guesses: number;
  /** Label for the second stat tile - defaults to "Guesses". Override
   * for games where "guesses" doesn't apply, e.g. Spelling Bee's "Words
   * found". */
  secondaryLabel?: string;
  /** Short result sentence shown under the score/guesses summary. */
  footerNote?: ReactNode;
  onPlayAgain: () => void;
  onClose: () => void;
  playAgainLabel?: string;
};

/**
 * Shared "round over" modal for Wordle/Quordle - shown automatically when a
 * round ends (won or lost). Pair with ModalBackdrop, same as every other
 * modal in the app.
 *
 * Focus opens on the close button rather than Play Again: the Enter
 * keypress that just submitted the final guess is still in flight when
 * this mounts, and Enter activates whatever button already has focus - if
 * that were Play Again, the same keystroke that finished the round could
 * immediately start a new one.
 */
const ResultModal = ({
  gameName,
  icon,
  title,
  message,
  score,
  guesses,
  secondaryLabel = "Guesses",
  footerNote,
  onPlayAgain,
  onClose,
  playAgainLabel = "Play again",
}: ResultModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const messageId = useId();

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        FOCUSABLE_SELECTOR
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      aria-describedby={messageId}
      className="flex w-[90vw] max-w-sm flex-col gap-5 rounded-2xl bg-surface p-5 shadow-xl sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
          {icon}
          <span>{gameName} complete</span>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-m-2.5 shrink-0 rounded-full p-2.5 text-xl text-text-secondary transition-colors hover:text-text-primary"
        >
          <HiX aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <h2 id={headingId} className="heading-1">
          {title}
        </h2>
        <p id={messageId} className="text-text-secondary">
          {message}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border-subtle rounded-xl bg-surface-secondary py-3 sm:py-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            Score
          </span>
          <span className="text-3xl font-bold text-text-primary">{score}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
            {secondaryLabel}
          </span>
          <span className="text-3xl font-bold text-text-primary">
            {guesses}
          </span>
        </div>
      </div>

      {footerNote && (
        <p className="text-center text-sm text-text-secondary">
          {footerNote}
        </p>
      )}

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full rounded-full bg-nav-interactive px-4 py-3 text-base font-semibold text-nav-interactive-text transition-opacity hover:opacity-90 active:opacity-80"
        >
          {playAgainLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResultModal;
