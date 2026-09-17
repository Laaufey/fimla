import type { WordGamePalette } from "../hooks/useWordGamePalette";

type PaletteSwitchProps = {
  palette: WordGamePalette;
  onChange: (value: WordGamePalette) => void;
  className?: string;
};

const OPTIONS: { value: WordGamePalette; label: string }[] = [
  { value: "fimla", label: "Fimla" },
  { value: "classic", label: "Classic" },
];

/**
 * One shared result-color preference control for Wordle and Quordle.
 * Purely a palette switch - it never touches guesses, scores, or stats;
 * see useWordGamePalette for how the choice is stored and applied.
 */
const PaletteSwitch = ({ palette, onChange, className = "" }: PaletteSwitchProps) => (
  <div
    role="radiogroup"
    aria-label="Result color palette"
    className={`inline-flex shrink-0 items-center gap-0.5 rounded-full bg-surface-secondary p-0.5 text-[10px] ${className}`}
  >
    {OPTIONS.map((option) => {
      const active = option.value === palette;
      return (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-2 py-0.5 font-medium transition-colors ${
            active
              ? "bg-action-primary text-on-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {option.label}
        </button>
      );
    })}
  </div>
);

export default PaletteSwitch;
