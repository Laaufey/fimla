import { useEffect, useState } from "react";

type StaggeredRevealOptions = {
  /** Time between each subsequent tile starting to reveal. */
  stepMs?: number;
  /** Extra delay before the first tile reveals (e.g. half a flip's
   * duration, so the color swaps while the tile is "face down"). */
  offsetMs?: number;
};

/**
 * Drives a one-at-a-time reveal: while `isActive` is false, nothing is
 * revealed; the instant it becomes true, tiles reveal in order, each
 * `stepMs` after the previous one (plus a one-time `offsetMs` head start).
 * Used so a guess's result becomes visible tile-by-tile instead of all at
 * once - the flip *motion* being staggered isn't enough on its own, since
 * the underlying color would otherwise already be correct from the very
 * first frame, spoiling the result before any tile finishes flipping.
 */
export default function useStaggeredReveal(
  isActive: boolean,
  count: number,
  { stepMs = 300, offsetMs = 250 }: StaggeredRevealOptions = {}
) {
  const [revealedCount, setRevealedCount] = useState(isActive ? count : 0);

  useEffect(() => {
    if (!isActive) {
      setRevealedCount(0);
      return;
    }
    setRevealedCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setRevealedCount((current) => Math.max(current, i + 1));
        }, i * stepMs + offsetMs)
      );
    }
    return () => {
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return revealedCount;
}
