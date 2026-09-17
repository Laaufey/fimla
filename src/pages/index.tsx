import { useSession } from "next-auth/react";
import React from "react";
import { games } from "../data/paths";
import Head from "next/head";
import GameCard, { GameCardVariant } from "../components/GameCard";
import PageHeading from "../components/PageHeading";

const CARD_VARIANTS: GameCardVariant[] = [
  "wordle",
  "quordle",
  "spelling",
  "crosswords",
];

export default function Home() {
  const { data: session } = useSession();

  const displayName =
    session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0];

  return (
    <>
      <Head>
        <title>
          Fimla - Íslenskir orðaleikir - Word games in Icelandic, play wordle,
          quordle, spelling bee and crosswords for free!
        </title>
        <meta name="robots" content="all" />
        <meta
          name="description"
          content="Word games in Icelandic, play wordle, quordle, spelling bee and crosswords for free"
          key="titleDescription"
        />
        <meta name="keywords" content="wordgames" key="titleKeywords" />
      </Head>

      {session && (
        <PageHeading
          title={`Hello, ${displayName}`}
          description="Ready for today's games?"
        />
      )}

      <section className="grid w-full grid-cols-1 items-stretch gap-3 sm:grid-cols-2 sm:gap-6">

        {React.Children.toArray(
          games.map((game, index) => (
            <GameCard
              number={String(index + 1).padStart(2, "0")}
              title={game.name}
              href={game.path}
              variant={CARD_VARIANTS[index]}
            />
          ))
        )}
      </section>
    </>
  );
}
