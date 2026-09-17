// Shared compact pill-button variants (Settings, Groups). Consistent
// height, radius, typography, and interaction states across every
// variant - only fill/text color differs. See docs/brand.md for the
// underlying tokens; never add a literal color here.
const BASE =
  "inline-flex h-10 w-fit shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-150 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40";

// The one lavender/purple interactive accent, reused everywhere an
// affirmative (non-destructive) action needs emphasis.
export const buttonPrimary = `${BASE} bg-accent-lavender text-ink hover:opacity-90`;

// Neutral, bordered - for a secondary action that shouldn't compete with
// the page's one accent color.
export const buttonSecondary = `${BASE} border border-border-subtle text-text-primary hover:bg-surface-secondary`;

// The existing destructive color, reserved for actions that can't be
// undone.
export const buttonDestructive = `${BASE} bg-danger-action text-danger-action-text hover:opacity-90`;

// Lowest emphasis - plain text, no fill or border.
export const buttonQuiet =
  "text-sm font-medium text-text-secondary underline-offset-4 transition-colors duration-150 hover:text-text-primary hover:underline";
