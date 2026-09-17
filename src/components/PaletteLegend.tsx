import { tileClassName } from "../lib/wordGameTileState";

const ROWS: { state: "correct" | "present" | "absent"; label: string }[] = [
  { state: "correct", label: "Correct spot" },
  { state: "present", label: "In the word, wrong spot" },
  { state: "absent", label: "Not in the word" },
];

/**
 * Live example tiles for the "How to play" modal - built from the same
 * semantic tile classes the real board uses, so it always matches
 * whichever result palette (Fimla or Classic) is currently selected,
 * instead of a static image baked to one fixed color scheme.
 */
const PaletteLegend = () => (
  <div className="flex flex-col gap-2">
    {ROWS.map(({ state, label }) => (
      <div key={state} className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-lg font-bold uppercase ${tileClassName(
            state
          )}`}
        >
          {state === "correct" ? "h" : state === "present" ? "o" : "x"}
        </div>
        <p className="text-sm">{label}</p>
      </div>
    ))}
  </div>
);

export default PaletteLegend;
