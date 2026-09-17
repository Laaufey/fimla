import type { IconType } from "react-icons";

type IconButtonProps = {
  icon: IconType;
  label: string;
  onClick: () => void;
  active?: boolean;
};

/** Compact circular icon button for game-toolbar controls (how-to-play,
 * keyboard show/hide). The visible icon is decorative - `label` is the
 * real accessible name and doubles as a tooltip. */
const IconButton = ({ icon: Icon, label, onClick, active = false }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    title={label}
    onClick={onClick}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base transition-colors ${
      active
        ? "bg-accent-lavender text-ink"
        : "bg-surface-secondary text-text-secondary hover:text-text-primary"
    }`}
  >
    <Icon aria-hidden="true" />
  </button>
);

export default IconButton;
