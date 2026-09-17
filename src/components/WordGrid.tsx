import { motion } from "framer-motion";
import useStaggeredReveal from "../hooks/useStaggeredReveal";
import {
  getTileState,
  tileAccessibleLabel,
  tileClassName,
} from "../lib/wordGameTileState";

const FLIP_DURATION_S = 0.4;
const STEP_MS = 300;
const TILE_COUNT = 5;
// How long the last tile's flip takes to finish revealing, from the
// moment a guess is submitted - the round-result modal waits for this
// before appearing, so it never covers the reveal animation.
export const REVEAL_DURATION_MS =
  (TILE_COUNT - 1) * STEP_MS + FLIP_DURATION_S * 1000;

const WordGrid = ({
  word,
  guess,
  isGuessed,
}: {
  word: string;
  guess: string;
  isGuessed: boolean;
}) => {
  // Each tile's *color* only reveals once its own flip reaches the
  // midpoint - otherwise the result would be visible from the first
  // frame regardless of the flip motion, spoiling the guess instantly.
  const revealedCount = useStaggeredReveal(isGuessed, TILE_COUNT, {
    stepMs: STEP_MS,
    offsetMs: (FLIP_DURATION_S * 1000) / 2,
  });

  return (
    <div className="grid w-auto grid-cols-5 gap-1">
      {new Array(5).fill(0).map((_, i) => {
        const letter = guess[i] || "";
        const revealed = i < revealedCount;
        const state = getTileState(letter, word, i, revealed);
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
              className={`flex w-[clamp(2.2rem,7.5vw,3.5rem)] text-[clamp(1.25rem,4.5vw,2.25rem)] capitalize rounded-md aspect-square transition-colors duration-200 ${tileClassName(
                state
              )} center`}
            >
              {letter}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WordGrid;
