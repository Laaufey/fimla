import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import {
  HiOutlineRefresh,
  HiX,
  HiOutlineQuestionMarkCircle,
  HiPlus,
  HiOutlineBackspace,
  HiOutlineArrowRight,
  HiOutlineEye,
} from "react-icons/hi";
import { useSession } from "next-auth/react";

import SpellingBeeStore from "../../stores/SpellingBeeStore.jsx";
import SpellingBeeGrid from "../../components/SpellingBeeGrid";
import OnboardingModal from "../../components/OnboardingModal";
import ModalBackdrop from "../../components/ModalBackdrop";
import ProgressBar from "../../components/ProgressBar";
import GameShell from "../../components/GameShell";
import GameToolbar from "../../components/GameToolbar";
import IconButton from "../../components/IconButton";
import ResultModal, {
  SpellingBeeCompletionIcon,
} from "../../components/ResultModal";
import getByUserEmail from "../../../lib/getByUserEmail";
import updateData from "../../../lib/updateData";
import LoadingIcon from "../../components/LoadingIcon";

const SpellingBee = () => {
  const { data: session, status } = useSession();
  const user = session?.user?.email;
  const userSession = session?.user;
  const ref = useRef(null);
  const store = useLocalObservable(() => SpellingBeeStore);
  const [word, setWord] = useState("");
  const [onboardingModal, setOnboardingModal] = useState(false);
  const [beeVisited, setBeeVisited] = useState(true);
  const [stats, setStats] = useState({ user, totalScore: 0 });
  const [hintsModal, setHintsModal] = useState(false);
  const [winModalDismissed, setWinModalDismissed] = useState(false);
  const fourLetterHints: string[][] = store.fourLetterHints;
  const fiveLetterHints: string[][] = store.fiveLetterHints;
  const showWinModal = store.wonAll && !winModalDismissed;

  useEffect(() => {
    store.startGame();
    window.addEventListener("keydown", store.handleKeydown);
    return () => {
      window.removeEventListener("keydown", store.handleKeydown);
    };
  }, []);
  useEffect(() => {
    focusInput();
    window.addEventListener("keydown", focusInput);
    return () => {
      window.removeEventListener("keydown", focusInput);
    };
  }, []);

  const focusInput = () => {
    const input = document.getElementById("sbInput");
    if (input) input.focus();
  };

  useEffect(() => {
    store.word = word;
  }, [word]);

  useEffect(() => {
    let beeVisited = JSON.parse(localStorage.getItem("beeVisited") || "false");
    if (!beeVisited) {
      beeVisited = true;
      localStorage.setItem("beeVisited", JSON.stringify(beeVisited));
      setBeeVisited(false);
    }
  }, []);
  useEffect(() => {
    if (!beeVisited) {
      setOnboardingModal(true);
    }
  }, [beeVisited]);

  const clearInput = (e: { key: string }) => {
    if (e.key === "Enter") {
      setWord("");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      store.error = "";
    }, 2000);
  }, [store.error]);

  const getStats = async () =>
    getByUserEmail("bee-stats", userSession).then((result) =>
      setStats(result[0])
    );
  useEffect(() => {
    getStats();
  }, [session]);

  const startNewPuzzle = () => {
    store.startGame();
    setWord("");
    setWinModalDismissed(false);
  };

  const addBeeStats = async () => {
    let totalScore = {};
    if (session && stats) {
      totalScore =
        stats.totalScore +
        store.fourLetterWords.length +
        store.fiveLetterWords.length * 2;
    } else {
      totalScore =
        store.fourLetterWords.length + store.fiveLetterWords.length * 2;
    }
    const body = { user, totalScore };

    if (stats) {
      updateData("bee-stats", "PUT", body);
    } else {
      updateData("bee-stats", "POST", body);
    }
  };

  if (!store.letters.length || status === "loading")
    return <LoadingIcon isPage />;

  return (
    <GameShell maxWidthClassName="max-w-lg lg:max-w-4xl">
      {(onboardingModal || hintsModal) && (
        <ModalBackdrop
          onClick={() => {
            setOnboardingModal(false);
            setHintsModal(false);
          }}
        >
          {onboardingModal && (
            <OnboardingModal
              title="How to play Spelling Bee"
              textOne="Find as many words as you can using the 7 letters given. Words must contain at least 4 letters. Letters can be used more than once. Our word list does not include words that are obscure, hyphenated, or proper nouns."
              textTwo="Points are given for each word, 4 letter words are worth 1 point, 5 letter words are worth 2 points and so on. Create an account to save your stats, it’s free!"
              image="/how-to-sb.png"
              alt="spellingbee"
              onClick={() => setOnboardingModal(false)}
            />
          )}
          {hintsModal && (
            <div className="flex w-[90vw] max-w-xl flex-col gap-6 rounded-2xl bg-surface p-6 shadow-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="heading-2">Today's hints</h2>
                  <p className="text-sm text-text-secondary">
                    The numbers show how many words start with each letter.
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setHintsModal(false)}
                  className="-m-2 shrink-0 rounded-full p-2 text-xl text-text-secondary transition-colors hover:text-text-primary"
                >
                  <HiX aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-col gap-6 sm:flex-row sm:justify-evenly">
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="heading-3 mb-1">4-letter words</h3>
                  {fourLetterHints.map((words, index) =>
                    words.length === 0 ? null : (
                      <p key={index} className="text-text-secondary">
                        <span className="font-semibold uppercase text-text-primary">
                          {store.letters[index]}
                        </span>{" "}
                        &ndash; {words.length}
                      </p>
                    )
                  )}
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <h3 className="heading-3 mb-1">5-letter words</h3>
                  {fiveLetterHints.map((words, index) =>
                    words.length === 0 ? null : (
                      <p key={index} className="text-text-secondary">
                        <span className="font-semibold uppercase text-text-primary">
                          {store.letters[index]}
                        </span>{" "}
                        &ndash; {words.length}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </ModalBackdrop>
      )}

      {showWinModal && (
        <ModalBackdrop onClick={() => setWinModalDismissed(true)}>
          <ResultModal
            gameName="Spelling Bee"
            icon={<SpellingBeeCompletionIcon />}
            title="You won!"
            message="You found every word in today's puzzle."
            score={
              store.fourLetterWords.length + store.fiveLetterWords.length * 2
            }
            guesses={store.allFoundWords.length}
            secondaryLabel="Words found"
            footerNote="Great spelling!"
            playAgainLabel="New puzzle"
            onPlayAgain={startNewPuzzle}
            onClose={() => setWinModalDismissed(true)}
          />
        </ModalBackdrop>
      )}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        {/* Left column: header, input, letters, and their controls. */}
        <div className="flex flex-col gap-4">
          <GameToolbar title="Spelling Bee">
            <IconButton
              icon={HiOutlineQuestionMarkCircle}
              label="How to play"
              onClick={() => setOnboardingModal(true)}
            />
            <IconButton
              icon={HiOutlineEye}
              label="Hints"
              onClick={() => setHintsModal(true)}
            />
            <IconButton
              icon={HiPlus}
              label="New puzzle"
              onClick={startNewPuzzle}
            />
          </GameToolbar>

          {store.error && (
            <p className="flex h-6 items-center justify-center rounded-md text-sm text-error">
              {store.error}
            </p>
          )}

          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
            {word.length > 0 && (
              <button
                type="button"
                aria-label="Delete letter"
                title="Delete letter"
                onClick={() => setWord((current) => current.slice(0, -1))}
                className="absolute bottom-2 left-0 rounded-full p-1 text-lg text-nav-background transition-colors hover:opacity-80 lg:hidden"
              >
                <HiOutlineBackspace aria-hidden="true" />
              </button>
            )}
            <input
              ref={ref}
              id="sbInput"
              placeholder="Start typing..."
              className="w-full border-0 border-b-2 border-border-subtle bg-transparent px-2 py-2 text-center text-xl text-text-primary outline-none transition-colors placeholder:text-text-secondary focus-visible:border-nav-interactive focus-visible:outline-none sm:text-2xl"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyUp={clearInput}
            />
            {word.length > 0 && (
              <button
                type="button"
                aria-label="Submit word"
                title="Submit word"
                onClick={() => {
                  store.submitWord();
                  setWord("");
                }}
                className="absolute bottom-2 right-0 rounded-full p-1 text-lg text-nav-background transition-colors hover:opacity-80 lg:hidden"
              >
                <HiOutlineArrowRight aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex justify-center py-2">
            <SpellingBeeGrid
              store={store}
              onLetterClick={(letter) => setWord((current) => current + letter)}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="button"
              aria-label="Shuffle letters"
              title="Shuffle letters"
              onClick={() => store.shuffle(store.letters)}
              className="rounded-full p-3 text-2xl text-text-secondary transition-colors hover:text-nav-interactive focus-visible:text-nav-interactive"
            >
              <HiOutlineRefresh aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right column: found words. */}
        <div className="flex flex-col gap-3 lg:border-l lg:border-border-subtle lg:pl-8">
          <div className="flex items-baseline justify-between">
            <h2 className="heading-3">Words</h2>
            <p className="text-sm text-text-secondary">
              {store.allFoundWords.length} / {store.allWords.length}
            </p>
          </div>
          <ProgressBar progressPercentage={store.progressPercentage} />
          {store.allFoundWords.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-secondary">
              Your found words will appear here.
            </p>
          ) : (
            <div className="grid max-h-40 grid-cols-2 gap-x-4 gap-y-1 overflow-y-auto sm:max-h-52 sm:grid-cols-3">
              {store.allFoundWords.map((word: string, i: number) => (
                <div className="flex items-center gap-2 py-0.5" key={i}>
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-nav-interactive" />
                  <span className="truncate capitalize text-text-primary">
                    {word}
                  </span>
                </div>
              ))}
            </div>
          )}
          <button
            className="mt-2 w-full rounded-full bg-nav-interactive px-4 py-3 text-base font-semibold text-nav-interactive-text transition-opacity hover:opacity-90 active:opacity-80"
            onClick={addBeeStats}
          >
            Save score & quit
          </button>
        </div>
      </div>
    </GameShell>
  );
};

export default observer(SpellingBee);
