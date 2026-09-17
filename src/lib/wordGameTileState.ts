// Shared Wordle/Quordle tile + keyboard-key semantics. Stores only ever
// deal with letters/words (see WordleStore, QuordleStore) - this module is
// the single place that turns a guess into a semantic result state, and a
// semantic state into the (palette-driven) Tailwind classes that render it.
// Never hardcode a color here - only class names that resolve through the
// centralized tokens in src/styles/brand.css.

export type TileState = "empty" | "entered" | "correct" | "present" | "absent";

export function getTileState(
  letter: string,
  answer: string,
  position: number,
  isGuessed: boolean
): TileState {
  if (!isGuessed) {
    return letter ? "entered" : "empty";
  }
  if (letter === answer[position]) return "correct";
  if (letter && answer.includes(letter)) return "present";
  return "absent";
}

const TILE_BG_CLASS: Record<TileState, string> = {
  empty: "bg-tile-empty",
  entered: "bg-tile-entered",
  correct: "bg-tile-correct",
  present: "bg-tile-present",
  absent: "bg-tile-absent",
};

const TILE_TEXT_CLASS: Record<TileState, string> = {
  empty: "text-tile-text-empty",
  entered: "text-tile-text-entered",
  correct: "text-tile-text-correct",
  present: "text-tile-text-present",
  absent: "text-tile-text-absent",
};

export function tileClassName(state: TileState): string {
  return `${TILE_BG_CLASS[state]} ${TILE_TEXT_CLASS[state]}`;
}

export function tileAccessibleLabel(letter: string, state: TileState): string {
  if (state === "empty") return "Empty tile";
  if (state === "entered") return `${letter.toUpperCase()}, not yet submitted`;
  return `${letter.toUpperCase()}, ${state}`;
}

export type KeyState = "correct" | "present" | "used" | "default";

export function getKeyState(
  key: string,
  correctLetters: string[],
  presentLetters: string[],
  allGuessedLetters: string[]
): KeyState {
  if (correctLetters.includes(key)) return "correct";
  if (presentLetters.includes(key)) return "present";
  if (allGuessedLetters.includes(key)) return "used";
  return "default";
}

const KEY_BG_CLASS: Record<KeyState, string> = {
  correct: "bg-tile-correct",
  present: "bg-tile-present",
  used: "bg-key-used",
  default: "bg-key-bg",
};

const KEY_TEXT_CLASS: Record<KeyState, string> = {
  correct: "text-tile-text-correct",
  present: "text-tile-text-present",
  used: "text-key-text",
  default: "text-key-text",
};

export function keyClassName(state: KeyState): string {
  return `${KEY_BG_CLASS[state]} ${KEY_TEXT_CLASS[state]}`;
}

export function keyAccessibleLabel(key: string, state: KeyState): string {
  if (state === "default") return `${key.toUpperCase()} key`;
  return `${key.toUpperCase()} key, ${state}`;
}
