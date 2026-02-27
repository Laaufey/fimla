import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { observer, useLocalObservable } from "mobx-react-lite";

import Keyboard2 from "../../components/Keyboard2";
import QuordleGrid from "../../components/QuordleGrid";
import QuordleStore from "../../stores/QuordleStore.jsx";
import OnboardingModal from "../../components/OnboardingModal";
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
    console.log(store.word1, store.word2, store.word3, store.word4);
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
      console.log(body);

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
    <div className="flex flex-col items-center my-10 justify-evenly">
      <div className="flex justify-center">
        {onboardingModal ? (
          <OnboardingModal
            title="How to play Quordle"
            textOne="Try to guess 4 words in 9 tries. Each guess applies to the four different words you need to solve. After each guess, the color of the tiles will change to show how close your guess was to the word."
            textTwo="The letter H is in the word and in the correct spot. The letter O is in the word but in the wrong spot."
            image="/how-to-play.png"
            alt="wordle-letters"
            onClick={() => setOnboardingModal(false)}
          />
        ) : null}
      </div>
      <div className="flex items-center justify-between w-full border-b-2">
        <h1 className="pb-2 heading-1">Quordle</h1>
        <div className="flex cursor-pointer gap-x-6">
          <Link href="/stats">Stats</Link>
          <button onClick={() => setOnboardingModal(true)}>How to play</button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-evenly">
        <h1 className="h-6 px-2 rounded-md text-error">{store.error}</h1>
        <div className="grid grid-cols-2 gap-4 my-4">
          <div>
            {store.guesses.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word1}
                guess={store.guesses[i]}
                isGuessed={i < store.currentGuess}
                won={store.won1}
              />
            ))}
          </div>
          <div>
            {store.guesses2.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word2}
                guess={store.guesses2[i]}
                isGuessed={i < store.currentGuess2}
                won={store.won2}
              />
            ))}
          </div>
          <div>
            {store.guesses3.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word3}
                guess={store.guesses3[i]}
                isGuessed={i < store.currentGuess3}
                won={store.won3}
              />
            ))}
          </div>
          <div>
            {store.guesses4.map((_, i) => (
              <QuordleGrid
                key={i}
                word1={store.word4}
                guess={store.guesses4[i]}
                isGuessed={i < store.currentGuess4}
                won={store.won4}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        {store.wonAll && (
          <h1 className="text-xl font-bold text-green">You Won! Good job!</h1>
        )}
        {store.lost && (
          <div className="flex items-center my-2 gap-x-8">
            <p className="text-lg font-bold">Almost! correct words:</p>
            <div>
              <p className="text-lg font-bold text-green">
                {store.word1} - {store.word2}
              </p>
              <p className="text-lg font-bold text-green">
                {store.word3} - {store.word4}
              </p>
            </div>
          </div>
        )}
      </div>
      <Keyboard2 store={store} />
    </div>
  );
};

export default observer(Quordle);
