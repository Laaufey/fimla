import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import LoadingIcon from "../components/LoadingIcon";
import PageHeading from "../components/PageHeading";

const Leaderboard = ({ wordleSessionStats, quordleSessionStats }) => {
  const { data: session, status } = useSession();
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [stats, setStats] = useState([]);

  const wordleClick = () => {
    setWordle(true);
    setQuordle(false);
  };
  const quordleClick = () => {
    setQuordle(true);
    setWordle(false);
  };
  const initLeaderBoardW = () => {
    setStats(wordleSessionStats);
  };
  const initLeaderBoardQ = () => {
    setStats(quordleSessionStats);
  };
  useEffect(() => {
    if (quordle) initLeaderBoardQ();
  }, [quordle]);
  useEffect(() => {
    if (wordle) initLeaderBoardW();
  }, [wordle]);

  if (status === "loading") return <LoadingIcon isPage />;

  const tabClassName = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 active:opacity-80 ${
      active
        ? "bg-nav-interactive text-nav-interactive-text"
        : "text-text-secondary hover:bg-nav-interactive hover:text-nav-interactive-text"
    }`;

  const rows = stats
    ?.filter((item) => item["totalScore"])
    .sort((prev, next) => next["totalScore"] - prev["totalScore"])
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-y-4">
      <PageHeading title="Leaderboard" />

      <div
        className="flex gap-2"
        role="tablist"
        aria-label="Leaderboard game"
      >
        <button
          type="button"
          role="tab"
          aria-selected={wordle}
          onClick={wordleClick}
          className={tabClassName(wordle)}
        >
          Wordle
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={quordle}
          onClick={quordleClick}
          className={tabClassName(quordle)}
        >
          Quordle
        </button>
      </div>

      <section className="w-full rounded-3xl bg-surface p-4 shadow-md sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 px-4 pb-3 text-xs font-ui font-medium uppercase tracking-wide text-text-muted sm:px-6">
          <span className="w-8 shrink-0 sm:w-10">Rank</span>
          <span className="flex-1">Name</span>
          <span className="shrink-0">Score</span>
        </div>

        <div className="flex flex-col gap-2">
          {rows?.map((item, i) => {
            const isFirst = i === 0;
            return (
              <div
                key={item["id"]}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 ${
                  isFirst
                    ? "bg-lavender text-ink"
                    : "bg-surface-subtle text-text-primary"
                }`}
              >
                <span className="w-8 shrink-0 font-display text-lg font-extrabold tabular-nums sm:w-10 sm:text-xl">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-ui font-medium">
                  {`${item["userEmail"]}`.split("@")[0]}
                </span>
                <span className="shrink-0 font-display text-lg font-extrabold tabular-nums sm:text-xl">
                  {item["totalScore"]}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Leaderboard;

export const getServerSideProps = async () => {
  try {
    const { prisma } = await import("../../lib/prisma");
    const wordleData = await prisma.wordleStats.findMany({});
    const quordleData = await prisma.quordleStats.findMany({});

    const wordleSessionStats = wordleData || null;
    const quordleSessionStats = quordleData || null;

    return { props: { wordleSessionStats, quordleSessionStats } };
  } catch (error) {
    console.error("Leaderboard getServerSideProps failed:", error);
    return { props: { wordleSessionStats: [], quordleSessionStats: [] } };
  }
};
