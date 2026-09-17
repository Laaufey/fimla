import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export type GameCardVariant = "wordle" | "quordle" | "spelling" | "crosswords";

const CARD_STYLES: Record<GameCardVariant, string> = {
  wordle: "bg-play-card-wordle text-warm-white",
  quordle: "bg-play-card-quordle text-ink",
  spelling: "bg-play-card-spelling text-ink",
  crosswords: "bg-play-card-crosswords text-ink",
};

const BUTTON_STYLES: Record<GameCardVariant, string> = {
  wordle: "bg-lavender text-ink",
  quordle: "bg-aubergine text-warm-white",
  spelling: "bg-brandpurple text-warm-white",
  crosswords: "bg-aubergine text-warm-white",
};

// Intrinsic viewBox size of each supplied SVG, used so next/image can
// preserve its aspect ratio without cropping or stretching.
const ART: Record<
  GameCardVariant,
  { src: string; width: number; height: number; sizeClassName?: string }
> = {
  wordle: { src: "/wordle-card-art.svg", width: 420, height: 300 },
  quordle: { src: "/quordle-card-art.svg", width: 520, height: 300 },
  // The honeycomb's own negative space makes it read visually smaller than
  // the other three cards' edge-to-edge grids at the same rendered width,
  // so it gets a ~15% size boost (only at sm+, where the safe padding
  // gutter comfortably absorbs the extra centered overflow).
  spelling: {
    src: "/spelling-bee-card-art.svg",
    width: 480,
    height: 290,
    sizeClassName: "sm:w-[115%]",
  },
  // Uses its own black-tile art rather than the pink-tile version shown
  // on the Crosswords "coming soon" page - the two are intentionally
  // different, so they're separate files rather than a shared one.
  crosswords: { src: "/crosswords-card-art-home.svg", width: 390, height: 300 },
};

type GameCardProps = {
  number: string;
  title: string;
  href: string;
  variant: GameCardVariant;
};

const GameCard = ({ number, title, href, variant }: GameCardProps) => {
  const art = ART[variant];

  return (
    <div
      className={`group relative flex flex-col justify-center gap-1.5 overflow-hidden rounded-xl p-3 transition-transform duration-200 ease-out hover:-translate-y-1 sm:h-full sm:gap-6 sm:rounded-2xl sm:p-6 lg:grid lg:grid-cols-2 lg:items-center lg:rounded-3xl lg:p-8 ${CARD_STYLES[variant]}`}
    >
      <div className="relative z-10 flex flex-col justify-between gap-1.5 sm:h-full sm:items-stretch sm:gap-6">
        <div>
          <p className="text-[0.65rem] font-ui font-medium tracking-wide opacity-70 sm:text-xs">
            {number}
          </p>
          <span
            aria-hidden="true"
            className="mt-1 block h-px w-6 bg-current opacity-30 sm:mt-2 sm:w-8"
          />
        </div>

        <h2 className="font-display text-lg font-extrabold leading-tight tracking-tight-brand sm:text-3xl lg:text-4xl">
          {title}
        </h2>

        <Link
          href={href}
          aria-label={`Play ${title}`}
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition hover:opacity-90 active:opacity-80 sm:gap-2 sm:px-6 sm:py-3 sm:text-sm ${BUTTON_STYLES[variant]}`}
        >
          <span>play</span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </Link>
      </div>

      {/* Mobile only: the art fills the card's full height along the right
          side and bleeds slightly past its right edge, clipped by the
          card's own overflow-hidden - no rotation, just a bigger, cropped
          (object-cover) view of the same flat grid art. From sm+ this
          reverts to the original static, fully-contained, in-flow block. */}
      <motion.div
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 1, delay: 1 }}
        className="pointer-events-none absolute inset-y-0 -right-4 flex w-3/5 items-center sm:static sm:inset-auto sm:flex sm:h-auto sm:w-full sm:items-center sm:justify-center"
      >
        <Image
          src={art.src}
          width={art.width}
          height={art.height}
          unoptimized
          alt=""
          className={`h-full w-full object-cover sm:h-auto sm:w-full sm:object-contain ${art.sizeClassName ?? ""}`}
        />
      </motion.div>
    </div>
  );
};

export default GameCard;
