import Image from "next/image";
import Link from "next/link";

import GameShell from "../../components/GameShell";
import GameToolbar from "../../components/GameToolbar";

const Crosswords = () => (
  <GameShell maxWidthClassName="max-w-lg">
    <GameToolbar title="Crosswords" />
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <Image
        src="/crosswords-card-art.svg"
        alt=""
        width={390}
        height={300}
        unoptimized
        className="w-40 opacity-80 sm:w-48"
      />
      <h2 className="heading-2">Coming soon</h2>
      <p className="max-w-sm text-text-secondary">
        Crosswords is still being developed - check back soon. In the
        meantime, try one of our other games!
      </p>
      <Link
        href="/"
        className="mt-2 rounded-full bg-nav-interactive px-4 py-2 text-sm font-semibold text-nav-interactive-text transition-opacity hover:opacity-90 active:opacity-80"
      >
        Back to games
      </Link>
    </div>
  </GameShell>
);

export default Crosswords;
