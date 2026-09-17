import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import { MdOutlineKeyboard, MdOutlineKeyboardHide } from "react-icons/md";

import WordGrid, { REVEAL_DURATION_MS } from "../../components/WordGrid";
import Keyboard from "../../components/Keyboard";
import WordleStore from "../../stores/WordleStore.jsx";
import OnboardingModal from "../../components/OnboardingModal";
import PaletteLegend from "../../components/PaletteLegend";
import ModalBackdrop from "../../components/ModalBackdrop";
import ResultModal, {
  WordleCompletionIcon,
} from "../../components/ResultModal";
import GameShell from "../../components/GameShell";
import GameToolbar from "../../components/GameToolbar";
import PaletteSwitch from "../../components/PaletteSwitch";
import IconButton from "../../components/IconButton";
import useWordGamePalette from "../../hooks/useWordGamePalette";
import useOnScreenKeyboardVisibility from "../../hooks/useOnScreenKeyboardVisibility";
import getByUserEmail from "../../../lib/getByUserEmail";
import updateData from "../../../lib/updateData";
import LoadingIcon from "../../components/LoadingIcon";

const Wordle = () => {
  const { data: session, status } = useSession();
  const userSession = session?.user;
  const user = session?.user?.email;
  const [stats, setStats] = useState({
    wins: 0,
    losses: 0,
    totalScore: 0,
    gamesPlayed: 0,
    avgScore: 0,
  });
  const store = useLocalObservable(() => WordleStore);
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [wordleVisited, setWordleVisited] = useState(true);
  const [resultDismissed, setResultDismissed] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const { palette, setPalette } = useWordGamePalette();
  const { visible: keyboardVisible, setVisible: setKeyboardVisible } =
    useOnScreenKeyboardVisibility();

  // Wait for the last tile's flip/reveal animation to finish before
  // showing the win/loss modal, so it never covers the reveal.
  useEffect(() => {
    if (!(store.won || store.lost)) {
      setResultReady(false);
      return;
    }
    const timer = setTimeout(() => setResultReady(true), REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [store.won, store.lost]);

  useEffect(() => {
    store.startGame();
    window.addEventListener("keyup", store.handleKeyup);
    return () => {
      window.removeEventListener("keyup", store.handleKeyup);
    };
  }, []);

  useEffect(() => {
    let wordleVisited = JSON.parse(
      localStorage.getItem("wordleVisited") || "false"
    );
    if (!wordleVisited) {
      wordleVisited = true;
      localStorage.setItem("wordleVisited", JSON.stringify(wordleVisited));
      setWordleVisited(false);
    }
  }, []);
  useEffect(() => {
    if (!wordleVisited) {
      setOnboardingModal(true);
    }
  }, [wordleVisited]);

  const getStats = async () =>
    getByUserEmail("wordle-stats", userSession).then((result) =>
      setStats(result[0])
    );

  useEffect(() => {
    getStats();
  }, [session]);

  const addWordleStats = async () => {
    if (session) {
      let wins = 0;
      let losses = 0;
      let totalScore = 0;

      if (stats) {
        totalScore = stats.totalScore + store.totalScore;
        if (store.won) {
          wins = stats.wins + 1;
          losses = stats.losses;
        }
        if (store.lost) {
          losses = stats.losses + 1;
          wins = stats.wins;
        }
      } else {
        totalScore = store.totalScore;
        if (store.won) {
          wins = 1;
        }
        if (store.lost) {
          losses = 1;
        }
      }
      const body = { user, totalScore, wins, losses };
      if (stats) {
        updateData("wordle-stats", "PUT", body);
      } else {
        updateData("wordle-stats", "POST", body);
      }
    }
  };
  useEffect(() => {
    if (store.won || store.lost) {
      addWordleStats();
    }
  }, [store.roundComplete]);

  if (status === "loading") return <LoadingIcon isPage />;

  return (
    <GameShell>
      {onboardingModal ? (
        <ModalBackdrop>
          <OnboardingModal
            title="How to play Wordle"
            textOne="Guess the word in 6 tries. After each guess, every tile updates to show how close you were - using whichever color palette you've picked below (Fimla or Classic)."
            demo={<PaletteLegend />}
            onClick={() => setOnboardingModal(false)}
          />
        </ModalBackdrop>
      ) : null}

      <GameToolbar title="Wordle">
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

      <div className="flex flex-col items-center gap-1 p-2">
        {store.guesses.map((_, i) => (
          <WordGrid
            word={store.word}
            guess={store.guesses[i]}
            isGuessed={i < store.numberOfGuesses}
            key={i}
          />
        ))}
      </div>

      {(store.won || store.lost) && resultReady && !resultDismissed && (
        <ModalBackdrop onClick={() => setResultDismissed(true)}>
          <ResultModal
            gameName="Wordle"
            icon={<WordleCompletionIcon />}
            title={store.won ? "You won!" : "Almost!"}
            message={
              store.won ? (
                "You guessed today's word."
              ) : (
                <>
                  The word was{" "}
                  <strong className="font-bold text-tile-correct">
                    {store.word}
                  </strong>
                  .
                </>
              )
            }
            score={Math.round(store.totalScore)}
            guesses={store.numberOfGuesses}
            footerNote={store.won ? "Nice work." : "Better luck next time."}
            onClose={() => setResultDismissed(true)}
            onPlayAgain={() => {
              store.startGame();
              setResultDismissed(false);
            }}
          />
        </ModalBackdrop>
      )}

      {keyboardVisible && <Keyboard store={store} />}
    </GameShell>
  );
};

export default observer(Wordle);
