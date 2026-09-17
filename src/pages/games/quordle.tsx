import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { MdOutlineKeyboard, MdOutlineKeyboardHide } from "react-icons/md";

import Keyboard from "../../components/Keyboard";
import QuordleGrid, {
  REVEAL_DURATION_MS,
} from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore.jsx";
import OnboardingModal from "../../components/OnboardingModal";
import PaletteLegend from "../../components/PaletteLegend";
import ModalBackdrop from "../../components/ModalBackdrop";
import ResultModal, {
  QuordleCompletionIcon,
} from "../../components/ResultModal";
import GameShell from "../../components/GameShell";
import GameToolbar from "../../components/GameToolbar";
import PaletteSwitch from "../../components/PaletteSwitch";
import IconButton from "../../components/IconButton";
import useWordGamePalette from "../../hooks/useWordGamePalette";
import useOnScreenKeyboardVisibility from "../../hooks/useOnScreenKeyboardVisibility";
import updateData from "../../../lib/updateData";
import getByUserEmail from "../../../lib/getByUserEmail";
import LoadingIcon from "../../components/LoadingIcon";

const Quordle = () => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const userSession = session?.user;
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    totalScore: 0,
    gamesPlayed: 0,
    avgScore: 0,
  });

  const store = useLocalObservable(() => QuordleStore);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [quordleVisited, setQuordleVisited] = useState(true);
  const [resultDismissed, setResultDismissed] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const { palette, setPalette } = useWordGamePalette();
  const { visible: keyboardVisible, setVisible: setKeyboardVisible } =
    useOnScreenKeyboardVisibility();

  // Wait for the last tile's flip/reveal animation to finish before
  // showing the win/loss modal, so it never covers the reveal.
  useEffect(() => {
    if (!(store.wonAll || store.lost)) {
      setResultReady(false);
      return;
    }
    const timer = setTimeout(() => setResultReady(true), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [store.wonAll, store.lost]);

  useEffect(() => {
    store.init();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);
  useEffect(() => {
    let quordleVisited = JSON.parse(
      localStorage.getItem("quordleVisited") || "false"
    );
    if (!quordleVisited) {
      setQuordleVisited(false);
      quordleVisited = true;
      localStorage.setItem("quordleVisited", JSON.stringify(quordleVisited));
    }
  }, []);
  useEffect(() => {
    if (!quordleVisited) {
      setOnboardingModal(true);
    }
  }, [quordleVisited]);

  const getStats = async () =>
    getByUserEmail("quordle-stats", userSession).then((result) =>
      setStats(result[0])
    );
  useEffect(() => {
    getStats();
  }, [session]);

  const addQuordleStats = async () => {
    if (session) {
      let wins = 0;
      let losses = 0;
      let totalScore = 0;
      if (stats) {
        totalScore = Math.round(stats.totalScore + store.totalScore);
        if (store.wonAll) {
          wins = stats.wins + 1;
          losses = stats.losses;
        }
        if (store.lost) {
          losses = stats.losses + 1;
          wins = stats.wins;
        }
      } else {
        totalScore = Math.round(store.totalScore);
        if (store.wonAll) {
          wins = 1;
        }
        if (store.lost) {
          losses = 1;
        }
      }
      const body = { userEmail, wins, losses, totalScore };

      if (stats) {
        updateData("quordle-stats", "PUT", body);
      } else {
        updateData("quordle-stats", "POST", body);
      }
    }
  };
  useEffect(() => {
    if (store.roundComplete) {
      addQuordleStats();
    }
  }, [store.roundComplete]);

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <GameShell maxWidthClassName="max-w-lg lg:max-w-5xl">
      {onboardingModal ? (
        <ModalBackdrop>
          <OnboardingModal
            title="How to play Quordle"
            textOne="Guess 4 words in 9 tries. Each guess applies to all four boards at once. After each guess, every tile updates to show how close you were - using whichever color palette you've picked below (Fimla or Classic)."
            demo={<PaletteLegend />}
            onClick={() => setOnboardingModal(false)}
          />
        </ModalBackdrop>
      ) : null}

      <GameToolbar title="Quordle">
        <PaletteSwitch palette={palette} onChange={setPalette} />
        <IconButton
          icon={HiOutlineQuestionMarkCircle}
          label="How to play"
          onClick={() => setOnboardingModal(true)}
        />
        <IconButton
          icon={keyboardVisible ? MdOutlineKeyboardHide : MdOutlineKeyboard}
          label={keyboardVisible ? "Hide keyboard" : "Show keyboard"}
          active={keyboardVisible}
          onClick={() => setKeyboardVisible(!keyboardVisible)}
        />
      </GameToolbar>

      {store.error && (
        <p className="flex items-center justify-center h-6 px-2 rounded-md text-error text-sm">
          {store.error}
        </p>
      )}

      {/* `w-fit` + `mx-auto` is the key fix here: without it, this grid
          stretches to GameShell's full width and its column tracks end
          up far wider than a board, so `justify-items-center` centers
          each board inside a mostly-empty track - that dead space, not
          the gap value, is what made the boards look "spread apart".
          Shrinking the grid to its content's actual width makes the
          explicit gap the only space between boards.

          The 4 board wrappers below are rendered in the same DOM order
          at every breakpoint - only `grid-cols-2` vs `lg:grid-cols-4`
          changes, so the exact same 4 components auto-flow into a 2x2
          grid (phone/tablet) or a single row of 4 (laptop/desktop)
          without any duplicated markup or breakpoint-specific logic. */}
      <div className="mx-auto grid w-fit grid-cols-2 gap-x-2.5 gap-y-2.5 p-2 sm:gap-x-3 sm:gap-y-3 lg:grid-cols-4">
        <div className="flex flex-col gap-1">
          {store.guesses.map((_, i) => (
            <QuordleGrid
              key={i}
              word1={store.word1}
              guess={store.guesses[i]}
              isGuessed={i < store.currentGuess}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {store.guesses2.map((_, i) => (
            <QuordleGrid
              key={i}
              word1={store.word2}
              guess={store.guesses2[i]}
              isGuessed={i < store.currentGuess2}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {store.guesses3.map((_, i) => (
            <QuordleGrid
              key={i}
              word1={store.word3}
              guess={store.guesses3[i]}
              isGuessed={i < store.currentGuess3}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1">
          {store.guesses4.map((_, i) => (
            <QuordleGrid
              key={i}
              word1={store.word4}
              guess={store.guesses4[i]}
              isGuessed={i < store.currentGuess4}
            />
          ))}
        </div>
      </div>

      {(store.wonAll || store.lost) && resultReady && !resultDismissed && (
        <ModalBackdrop onClick={() => setResultDismissed(true)}>
          <ResultModal
            gameName="Quordle"
            icon={<QuordleCompletionIcon />}
            title={store.wonAll ? "You won!" : "Almost!"}
            message={
              store.wonAll ? (
                "All four words solved."
              ) : (
                <>
                  The words were{" "}
                  <strong className="font-bold text-tile-correct">
                    {store.word1}
                  </strong>
                  ,{" "}
                  <strong className="font-bold text-tile-correct">
                    {store.word2}
                  </strong>
                  ,{" "}
                  <strong className="font-bold text-tile-correct">
                    {store.word3}
                  </strong>{" "}
                  and{" "}
                  <strong className="font-bold text-tile-correct">
                    {store.word4}
                  </strong>
                  .
                </>
              )
            }
            score={Math.round(store.totalScore)}
            guesses={store.currentGuess}
            footerNote={
              store.wonAll
                ? "A perfect finish across all four boards."
                : "Better luck on the next set."
            }
            onClose={() => setResultDismissed(true)}
            onPlayAgain={() => {
              store.init();
              setResultDismissed(false);
            }}
          />
        </ModalBackdrop>
      )}

      {keyboardVisible && (
        <Keyboard
          store={store}
          boards={[
            { correctLetters: store.greenLetters1, presentLetters: store.yellowLetters1 },
            { correctLetters: store.greenLetters2, presentLetters: store.yellowLetters2 },
            { correctLetters: store.greenLetters3, presentLetters: store.yellowLetters3 },
            { correctLetters: store.greenLetters4, presentLetters: store.yellowLetters4 },
          ]}
        />
      )}
    </GameShell>
  );
};

export default observer(Quordle);
