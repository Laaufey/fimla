import { ReactNode } from "react";
import { StatIcon, StatIconName } from "./icons/StatIcon";

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: StatIconName;
  cardClassName: string;
  labelBorderClassName: string;
  /** Wide (2-column) cards get a larger icon than the 4-up cards. */
  wide?: boolean;
};

const SMALL_ICON_SIZE =
  "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14";
const WIDE_ICON_SIZE =
  "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";

/** Presentational shell for a single Game Stats card: label, value, and icon. */
export default function StatCard({
  label,
  value,
  icon,
  cardClassName,
  labelBorderClassName,
  wide = false,
}: StatCardProps) {
  return (
    <div
      className={`flex h-36 w-full items-start justify-between gap-3 rounded-2xl p-6 lg:h-56 ${cardClassName}`}
    >
      <div className="flex h-full min-w-0 flex-1 flex-col justify-between">
        <h1
          className={`border-b-[0.5px] pb-1 text-2xl font-ui font-medium ${labelBorderClassName}`}
        >
          {label}
        </h1>
        <h1 className="font-display font-extrabold tracking-tight-brand tabular-nums text-[clamp(1.75rem,6vw,4.5rem)]">
          {value}
        </h1>
      </div>
      <div
        className={`shrink-0 self-start opacity-90 ${
          wide ? WIDE_ICON_SIZE : SMALL_ICON_SIZE
        }`}
      >
        <StatIcon name={icon} />
      </div>
    </div>
  );
}
