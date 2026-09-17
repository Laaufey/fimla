import { ComponentType } from "react";
import { StatGraphicProps } from "./IconSvg";
import WinsIcon from "./WinsIcon";
import LossesIcon from "./LossesIcon";
import GamesPlayedIcon from "./GamesPlayedIcon";
import AverageScoreIcon from "./AverageScoreIcon";
import WinRatioIcon from "./WinRatioIcon";
import TotalScoreIcon from "./TotalScoreIcon";

export type StatIconName =
  | "wins"
  | "losses"
  | "gamesPlayed"
  | "averageScore"
  | "winRatio"
  | "totalScore";

const STAT_ICON_COMPONENTS: Record<StatIconName, ComponentType<StatGraphicProps>> = {
  wins: WinsIcon,
  losses: LossesIcon,
  gamesPlayed: GamesPlayedIcon,
  averageScore: AverageScoreIcon,
  winRatio: WinRatioIcon,
  totalScore: TotalScoreIcon,
};

type StatIconProps = {
  name: StatIconName;
  className?: string;
  decorative?: boolean;
  title?: string;
};

/**
 * Public entry point for the stat-card graphics: selects the right icon via
 * a typed component map. Decorative by default (aria-hidden, unfocusable);
 * pass decorative={false} with a title to expose an accessible name instead.
 */
export function StatIcon({ name, className, decorative = true, title }: StatIconProps) {
  const Graphic = STAT_ICON_COMPONENTS[name];
  return <Graphic className={className} title={decorative ? undefined : title} />;
}
