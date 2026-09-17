import { observer } from "mobx-react-lite";
import { HiOutlineBackspace } from "react-icons/hi";
import {
  getKeyState,
  keyAccessibleLabel,
  keyClassName,
  KeyState,
} from "../lib/wordGameTileState";

const LETTER_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const KEY_BASE =
  "flex shrink-0 items-center justify-center rounded-md text-[clamp(0.7rem,2.6vw,0.95rem)] font-medium capitalize transition-opacity duration-150 hover:opacity-90 active:opacity-75 disabled:cursor-not-allowed disabled:opacity-40";
// Combines a width-vw term with a height-vh term so the keyboard shrinks
// on short-but-wide viewports (laptops) as well as narrow-but-tall ones
// (phones) - a pure vw clamp only responds to one of those.
const KEY_HEIGHT = "h-[clamp(1.9rem,min(7.5vw,6vh),2.6rem)]";
const LETTER_KEY_WIDTH = "w-[clamp(1.6rem,min(6vw,4.6vh),2.15rem)]";
// Slightly wider than a letter key, per the "Enter"/"Backspace" keys
// needing to stand out and be easy to hit on touch devices.
const ACTION_KEY_WIDTH = "w-[clamp(2.2rem,min(8vw,6vh),3rem)]";

const QUADRANT_CORNER_CLASS = [
  "rounded-tl-md",
  "rounded-tr-md",
  "rounded-bl-md",
  "rounded-br-md",
];

type BoardKeyState = {
  correctLetters: string[];
  presentLetters: string[];
};

type KeyboardProps = {
  store: any;
  /**
   * Quordle passes one entry per board so a single key can show all four
   * boards' state at once (as four quadrants). Omit for a single-board
   * game (Wordle, and the legacy tournament pages), which renders one
   * flat color per key instead.
   */
  boards?: BoardKeyState[];
};

const STATE_PRIORITY: KeyState[] = ["correct", "present", "used"];

/** Shared on-screen keyboard for every word-game store that exposes the
 * handleKeyClick(key)/canSubmit/allGuessedLetters contract (WordleStore,
 * QuordleStore). Backspace sits at the end of the top row (next to "p"),
 * Enter at the end of the bottom row. */
const Keyboard = ({ store, boards }: KeyboardProps) => {
  const letterKeyState = (letter: string): KeyState =>
    getKeyState(letter, store.greenLetters, store.yellowLetters, store.allGuessedLetters);

  const letterKeyLabel = (letter: string) => {
    if (!boards) return keyAccessibleLabel(letter, letterKeyState(letter));
    const states = boards.map((board) =>
      getKeyState(letter, board.correctLetters, board.presentLetters, store.allGuessedLetters)
    );
    const bestState =
      STATE_PRIORITY.find((candidate) => states.includes(candidate)) ?? "default";
    return keyAccessibleLabel(letter, bestState);
  };

  const renderKeyFace = (letter: string) => {
    if (!boards) {
      return (
        <span
          className={`flex h-full w-full items-center justify-center rounded-md ${keyClassName(
            letterKeyState(letter)
          )}`}
        >
          {letter}
        </span>
      );
    }

    return (
      <span className="relative grid h-full w-full grid-cols-2 grid-rows-2">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(0.55rem,2.2vw,0.8rem)]"
        >
          {letter}
        </span>
        {boards.map((board, i) => {
          const state = getKeyState(
            letter,
            board.correctLetters,
            board.presentLetters,
            store.allGuessedLetters
          );
          return (
            <span
              key={i}
              className={`h-full w-full ${keyClassName(state)} ${QUADRANT_CORNER_CLASS[i]}`}
            />
          );
        })}
      </span>
    );
  };

  const letterKey = (letter: string, key: string | number) => (
    <button
      type="button"
      key={key}
      aria-label={letterKeyLabel(letter)}
      onClick={() => store.handleKeyClick(letter)}
      className={`${KEY_BASE} ${LETTER_KEY_WIDTH} ${KEY_HEIGHT} cursor-pointer`}
    >
      {renderKeyFace(letter)}
    </button>
  );

  return (
    <div className="flex flex-col gap-1">
      {LETTER_ROWS.map((row, rowIndex) => {
        const isFirstRow = rowIndex === 0;
        const isLastRow = rowIndex === LETTER_ROWS.length - 1;
        return (
          <div key={rowIndex} className="flex gap-1 center">
            {row.split("").map((letter, i) => letterKey(letter, i))}

            {isFirstRow && (
              <button
                type="button"
                aria-label="Backspace"
                onClick={() => store.handleKeyClick("delete")}
                className={`${KEY_BASE} ${ACTION_KEY_WIDTH} ${KEY_HEIGHT} cursor-pointer bg-key-bg text-key-text`}
              >
                <HiOutlineBackspace aria-hidden="true" className="text-[clamp(0.85rem,3vw,1.15rem)]" />
              </button>
            )}

            {isLastRow && (
              <button
                type="button"
                aria-label="Enter"
                disabled={!store.canSubmit}
                onClick={() => store.handleKeyClick("enter")}
                className={`${KEY_BASE} ${ACTION_KEY_WIDTH} ${KEY_HEIGHT} cursor-pointer bg-key-bg text-key-text ${
                  store.canSubmit ? "" : "cursor-not-allowed"
                }`}
              >
                Enter
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default observer(Keyboard);
