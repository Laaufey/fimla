import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { games } from "../data/paths";
import Head from "next/head";
import GameCard from "../components/GameCard";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="all" />
        <meta
          name="description"
          content="Word games in Icelandic, play wordle, quordle, spelling bee and crosswords for free"
          key="titleDescription"
        />
        <meta name="keywords" content="wordgames" key="titleKeywords" />
      </Head>

      {session && (
        <section className="w-full mt-8 mb-2 lg:p-6">
          <h1 className="heading-1">Hello, {displayName}</h1>
          <p className="mt-1">Ready for today&apos;s games?</p>
        </section>
      )}

      <section
        className={`grid w-full gap-6 md:gap-3 lg:gap-6 lg:p-6 sm:grid-cols-2 grid-rows-auto ${
          session ? "md:mt-0" : "md:mt-12"
        }`}
      >
        {React.Children.toArray(
          games.map((game) => (
            <Link href={game.path}>
              <GameCard
                image={game.image}
                title={game.name}
                placeholderImg={game.placeholderImg}
              />
            </Link>
          ))
        )}
      </section>
    </>
  );
}
