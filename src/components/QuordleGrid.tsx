import { motion } from "framer-motion";
import useStaggeredReveal from "../hooks/useStaggeredReveal";
import {
  getTileState,
  tileAccessibleLabel,
  tileClassName,
} from "../lib/wordGameTileState";

const FLIP_DURATION_S = 0.4;
const STEP_MS = 220;
const TILE_COUNT = 5;
// How long the last tile's flip takes to finish revealing, from the
// moment a guess is submitted - the round-result modal waits for this
// before appearing, so it never covers the reveal animation.
export const REVEAL_DURATION_MS =
  (TILE_COUNT - 1) * STEP_MS + FLIP_DURATION_S * 1000;
// Width slightly greater than height (a compact horizontal rectangle,
// not a square) - combines a width-vw term with a height-vh term so
// tiles shrink on short-but-wide viewports (laptops) as well as
// narrow-but-tall ones (phones), never just one or the other.
// At lg+ (single-row desktop layout) there's plenty of unused vertical
// margin, so tiles get a separate, larger clamp - tuned to still fit
// 4 boards side by side within GameShell's lg:max-w-5xl container.
const TILE_WIDTH =
  "w-[clamp(1.6rem,min(7.5vw,4.5vh),2.7rem)] lg:w-[clamp(2rem,min(4.5vw,6vh),2.85rem)]";
// On mobile, rows sit flatter than they're wide so more of the 9-row
// board fits on screen at once - except the row currently being typed,
// which stays at the full aspect-[6/5] size for legibility. From sm+
// there's enough vertical room that every row stays full size.
const TILE_HEIGHT_ACTIVE = "aspect-[6/5]";
const TILE_HEIGHT_COMPACT =
  "h-[clamp(0.8rem,min(3.75vw,2.25vh),1.35rem)] sm:aspect-[6/5] sm:h-auto";

const QuordleGrid = ({
  word1,
  guess,
  isGuessed,
}: {
  word1: string;
  guess: string;
  isGuessed: boolean;
}) => {
  const revealedCount = useStaggeredReveal(isGuessed, TILE_COUNT, {
    stepMs: STEP_MS,
    offsetMs: (FLIP_DURATION_S * 1000) / 2,
  });
  // The row currently being typed - the only mobile row exempt from the
  // compact height, since it's the one the player needs to read clearly.
  const isActive = !isGuessed && guess.length > 0;

  return (
    <div className="grid w-auto grid-cols-5 gap-1">
      {new Array(5).fill(0).map((_, i) => {
        const letter = guess[i] || "";
        const revealed = i < revealedCount;
        const state = getTileState(letter, word1, i, revealed);

        return (
          <motion.div
            animate={{ scaleY: isGuessed ? [1, 0, 1] : 1 }}
            transition={{
              type: "tween",
              duration: FLIP_DURATION_S,
              delay: isGuessed ? (i * STEP_MS) / 1000 : 0,
            }}
            key={i}
          >
            <div
              aria-label={tileAccessibleLabel(letter, state)}
              className={`flex ${TILE_WIDTH} ${
                isActive ? TILE_HEIGHT_ACTIVE : TILE_HEIGHT_COMPACT
              } items-center justify-center rounded-sm uppercase text-[clamp(0.55rem,1.8vw,0.9rem)] transition-colors duration-200 ${tileClassName(
                state
              )}`}
            >
              {letter}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuordleGrid;
