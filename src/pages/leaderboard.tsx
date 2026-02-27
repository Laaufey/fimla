import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import { prisma } from "../../lib/prisma";
import LoadingIcon from "../components/LoadingIcon";

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

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="my-10 heading-1">Leaderboard</h1>
      <div className="flex mb-3 space-x-4 cursor-pointer">
        <h3
          className={`${wordle && "underline underline-offset-4"}`}
          onClick={wordleClick}
        >
          Wordle
        </h3>
        <h3
          className={`${quordle && "underline underline-offset-4"}`}
          onClick={quordleClick}
        >
          Quordle
        </h3>
      </div>
      <section className="flex w-full p-10 rounded-md bg-lightest dark:bg-darker">
        <table className="w-full">
          <tbody>
            <tr>
              <th className="w-1/3 text-left">Rank</th>
              <th className="w-1/3 text-left">Name</th>
              <th className="w-1/3 text-left">Score</th>
            </tr>

            {stats
              ?.filter((item) => item["totalScore"])
              .sort((prev, next) => next["totalScore"] - prev["totalScore"])
              .slice(0, 5)
              .map((item, i) => (
                <tr key={item["id"]}>
                  <td className="w-1/3">{i + 1}</td>
                  <td className="w-1/3">
                    {`${item["userEmail"]}`.split("@")[0]}
                  </td>
                  <td className="w-1/3">{item["totalScore"]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Leaderboard;

export const getServerSideProps = async () => {
  try {
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
