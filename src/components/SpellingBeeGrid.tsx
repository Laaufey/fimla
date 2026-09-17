import type { CSSProperties } from "react";
import { observer } from "mobx-react-lite";

type SpellingBeeGridProps = {
  store: any;
  /** Appends the clicked letter to the current word, same as typing it. */
  onLetterClick: (letter: string) => void;
};

// A regular flat-top hexagon (flat edge top/bottom, points left/right),
// as a single static clip-path shared by every tile. Percentages are
// relative to the tile's own border box, so as long as every tile keeps
// this same width:height ratio (see --hex-height below), the shape is
// always a regular hexagon regardless of the tile's actual rendered
// size. clip-path also clips pointer/hit-testing in every evergreen
// browser, so clicks never leak onto a neighboring tile.
const HEX_CLIP_PATH =
  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";

// One relatively-positioned container; every tile is absolutely
// positioned from left:50%/top:50% (its own center) and then pushed out
// to its slot with `transform: translate(...)` only - no grid, no flex,
// no per-tile top/left/margin. This is the one and only positioning
// system for the flower.
//
// --hex-width / --hex-height / --flower-gap are the only knobs; every
// offset below is derived from them, so resizing the flower (mobile vs
// desktop) never needs a second set of position rules - only different
// variable values.
const FLOWER_CONTAINER_STYLE: CSSProperties = {
  width:
    "calc(var(--hex-width) * 2.5 + var(--flower-gap) * 2)",
  height:
    "calc(var(--hex-height) * 3 + var(--flower-gap) * 2)",
};

const TILE_BASE_STYLE: CSSProperties = {
  left: "50%",
  top: "50%",
  width: "var(--hex-width)",
  height: "var(--hex-height)",
  clipPath: HEX_CLIP_PATH,
};

// Fixed ring slots, always in this order - a position always means "the
// same slot in the ring," never "wherever this particular letter
// happens to be," so shuffling or drawing a new puzzle can never distort
// the flower's shape itself.
const RING_SLOTS: { name: string; transform: string }[] = [
  {
    name: "top",
    transform: "translate(-50%, calc(-50% - var(--hex-height) - var(--flower-gap)))",
  },
  {
    name: "upper-right",
    transform:
      "translate(calc(-50% + var(--hex-width) * 0.75 + var(--flower-gap)), calc(-50% - var(--hex-height) * 0.5 - var(--flower-gap) * 0.5))",
  },
  {
    name: "lower-right",
    transform:
      "translate(calc(-50% + var(--hex-width) * 0.75 + var(--flower-gap)), calc(-50% + var(--hex-height) * 0.5 + var(--flower-gap) * 0.5))",
  },
  {
    name: "bottom",
    transform: "translate(-50%, calc(-50% + var(--hex-height) + var(--flower-gap)))",
  },
  {
    name: "lower-left",
    transform:
      "translate(calc(-50% - var(--hex-width) * 0.75 - var(--flower-gap)), calc(-50% + var(--hex-height) * 0.5 + var(--flower-gap) * 0.5))",
  },
  {
    name: "upper-left",
    transform:
      "translate(calc(-50% - var(--hex-width) * 0.75 - var(--flower-gap)), calc(-50% - var(--hex-height) * 0.5 - var(--flower-gap) * 0.5))",
  },
];

const CENTER_TRANSFORM = "translate(-50%, -50%)";

const HexTile = ({
  letter,
  center,
  transform,
  onClick,
}: {
  letter: string;
  center: boolean;
  transform: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={`Letter ${letter.toUpperCase()}`}
    onClick={onClick}
    style={{ ...TILE_BASE_STYLE, transform }}
    className={`absolute flex items-center justify-center text-lg font-semibold capitalize transition-opacity hover:opacity-90 active:opacity-80 sm:text-xl lg:text-2xl ${
      center
        ? "bg-nav-interactive text-nav-interactive-text"
        : "bg-aubergine text-warm-white"
    }`}
  >
    {letter}
  </button>
);

/** The puzzle's 7 letters as a honeycomb "flower": the first letter is
 * the required center letter (existing lavender token), the other 6 fill
 * fixed ring slots around it (see RING_SLOTS) so the flower's shape
 * never depends on which letters are currently in those slots. */
const SpellingBeeGrid = ({ store, onLetterClick }: SpellingBeeGridProps) => {
  const [centerLetter, ...ringLetters] = store.letters as string[];

  return (
    <div
      className="relative mx-auto [--flower-gap:0.3rem] [--hex-width:4.5rem] sm:[--hex-width:5rem] lg:[--hex-width:5.5rem]"
      style={{
        ...FLOWER_CONTAINER_STYLE,
        // hex-height is derived from hex-width (flat-top hexagon:
        // height = width * sqrt(3)/2), defined here rather than in the
        // Tailwind class list since it depends on another custom
        // property rather than a literal value.
        ["--hex-height" as string]: "calc(var(--hex-width) * 0.866)",
      }}
    >
      <HexTile
        key={`${store.round}-center`}
        letter={centerLetter}
        center
        transform={CENTER_TRANSFORM}
        onClick={() => onLetterClick(centerLetter)}
      />
      {ringLetters.map((letter, i) => (
        <HexTile
          key={`${store.round}-ring-${i}`}
          letter={letter}
          center={false}
          transform={RING_SLOTS[i].transform}
          onClick={() => onLetterClick(letter)}
        />
      ))}
    </div>
  );
};

export default observer(SpellingBeeGrid);
