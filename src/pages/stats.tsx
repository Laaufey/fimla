import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LoadingIcon from "../components/LoadingIcon";
import StatCard from "../components/StatCard";
import PageHeading from "../components/PageHeading";
import AuthPromptBanner from "../components/AuthPromptBanner";

const Stats = ({
  wordleSessionStats,
  quordleSessionStats,
  beeSessionStats,
}) => {
  const { data: session, status } = useSession();

  const noStats = {
    wins: 0,
    losses: 0,
    gamesPlayed: 0,
    totalScore: 0,
    avgScore: 0,
  };
  const [stats, setStats] = useState(noStats);
  const [beeStats, setBeeStats] = useState(noStats);
  const [wordle, setWordle] = useState(true);
  const [quordle, setQuordle] = useState(false);
  const [bee, setBee] = useState(false);

  const wordleClick = () => {
    setWordle(true);
    setQuordle(false);
    setBee(false);
  };
  const quordleClick = () => {
    setQuordle(true);
    setWordle(false);
    setBee(false);
  };
  const beeClick = () => {
    setBee(true);
    setQuordle(false);
    setWordle(false);
  };

  const initWordleStats = () => {
      if (session && !wordleSessionStats) {
        setStats(noStats);
      } else if (session) {
        setStats(wordleSessionStats);
      } else if (typeof window !== undefined) {
        if (stats !== null) {
          let data = [JSON.parse(localStorage.getItem("stats")!)];
          const wordleLocalStats = data[0];
          if (wordleLocalStats === null) {
            setStats(noStats);
          } else {
            setStats(wordleLocalStats);
          }
        }
      }
    },
    initQuordleStats = () => {
      if (session && !quordleSessionStats) {
        setStats(noStats);
      } else if (session) {
        setStats(quordleSessionStats);
      } else {
        setStats(noStats);
      }
    },
    initBeeStats = () => {
      if (session && !beeSessionStats) {
        setBeeStats(noStats);
      } else if (session) {
        setBeeStats(beeSessionStats);
      } else {
        setBeeStats(noStats);
      }
    };

  useEffect(() => {
    initWordleStats();
  }, [session]);
  useEffect(() => {
    if (quordle) initQuordleStats();
  }, [quordle]);
  useEffect(() => {
    if (wordle) initWordleStats();
  }, [wordle]);
  useEffect(() => {
    if (bee) initBeeStats();
  }, [bee]);

  if (status === "loading") return <LoadingIcon isPage />;

  const tabClassName = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 active:opacity-80 ${
      active
        ? "bg-nav-interactive text-nav-interactive-text"
        : "text-text-secondary hover:bg-nav-interactive hover:text-nav-interactive-text"
    }`;

  return (
    <div className="flex flex-col gap-y-4">
      <PageHeading title="Game Stats" />

      <div className="flex gap-2" role="tablist" aria-label="Stats game">
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
        <button
          type="button"
          role="tab"
          aria-selected={bee}
          onClick={beeClick}
          className={tabClassName(bee)}
        >
          Spelling Bee
        </button>
      </div>
      {!session && (quordle || bee) ? (
        <AuthPromptBanner
          title={
            quordle ? "Unlock your Quordle stats" : "Unlock your Spelling Bee stats"
          }
          description="Create a free account to save your games, follow your progress and compare your scores."
          primaryActionLabel="Create account"
          primaryActionHref="/api/auth/signin"
          secondaryText="Already have an account?"
          secondaryActionLabel="Sign in"
          secondaryActionHref="/api/auth/signin"
        />
      ) : stats ? (
        <>
          {!bee ? (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                  label="Wins"
                  value={stats.wins}
                  icon="wins"
                  cardClassName="bg-gradient-aubergine text-warm-white"
                  labelBorderClassName="border-warm-white/20"
                />
                <StatCard
                  label="Losses"
                  value={stats.losses}
                  icon="losses"
                  cardClassName="bg-gradient-lavender text-ink"
                  labelBorderClassName="border-ink/15"
                />
                <StatCard
                  label="Games Played"
                  value={stats.wins + stats.losses}
                  icon="gamesPlayed"
                  cardClassName="bg-gradient-purple text-warm-white"
                  labelBorderClassName="border-warm-white/20"
                />
                <StatCard
                  label="Average Score"
                  value={
                    stats.totalScore > 0 ? (
                      <>
                        {(
                          stats.totalScore /
                          (stats.wins + stats.losses)
                        ).toFixed(0)}
                      </>
                    ) : (
                      <>0</>
                    )
                  }
                  icon="averageScore"
                  cardClassName="bg-surface-subtle text-text-primary"
                  labelBorderClassName="border-border-subtle"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  label="Win Ratio"
                  value={
                    stats.wins > 0 || stats.losses > 0 ? (
                      <>
                        {(
                          (stats.wins / (stats.wins + stats.losses)) *
                          100
                        ).toFixed(0) + "%"}
                      </>
                    ) : (
                      <>0%</>
                    )
                  }
                  icon="winRatio"
                  cardClassName="bg-gradient-pink text-ink"
                  labelBorderClassName="border-ink/15"
                  wide
                />
                <StatCard
                  label="Total Score"
                  value={stats.totalScore || "0"}
                  icon="totalScore"
                  cardClassName="bg-gradient-aubergine text-warm-white"
                  labelBorderClassName="border-lavender/40"
                  wide
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex w-full space-x-4">
                <StatCard
                  label="Total Score"
                  value={beeStats.totalScore || "0"}
                  icon="totalScore"
                  cardClassName="bg-gradient-aubergine text-warm-white"
                  labelBorderClassName="border-lavender/40"
                  wide
                />
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Stats;

export const getServerSideProps = async ({ req }) => {
  try {
    const { prisma } = await import("../../lib/prisma");
    const session = await getSession({ req });
    const getEmail = session?.user?.email;
    const userEmail = getEmail?.toString();

    const wordleData = await prisma.wordleStats.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    const quordleData = await prisma.quordleStats.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    const beeData = await prisma.spellingBeeStats.findMany({
      where: {
        userEmail: userEmail,
      },
    });
    const wordleSessionStats = wordleData[0] || null;
    const quordleSessionStats = quordleData[0] || null;
    const beeSessionStats = beeData[0] || null;

    return {
      props: { wordleSessionStats, quordleSessionStats, beeSessionStats },
    };
  } catch (error) {
    console.error("Stats getServerSideProps failed:", error);
    return {
      props: {
        wordleSessionStats: null,
        quordleSessionStats: null,
        beeSessionStats: null,
      },
    };
  }
};
