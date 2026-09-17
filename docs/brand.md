# Fimla Brand Foundation

## Direction

Fimla is a modern editorial puzzle platform: intelligent, confident, playful
without feeling childish. The visual language combines warm neutral space,
near-black structure, saturated purple, soft lavender, and one controlled
pink accent.

## Single source of truth

`src/styles/brand.css` is the **only** application-owned file allowed to
contain a literal color value (hex/rgb/hsl/oklch/named) or a font-family
string. Every other file — components, pages, `tailwind.config.js`, inline
SVGs — must reference the CSS custom properties it defines (or their
Tailwind class aliases). See that file's own header comment for the full
rationale; this doc just documents the resulting palette and token names.

## Core palette (7 brand colors + 3 functional colors)

| Core token                  | Hex       | Use                                   |
| ---------------------------- | --------: | -------------------------------------- |
| `--core-ink`                 | `#0D0D0F` | Page ink / darkest background          |
| `--core-aubergine`           | `#24122F` | Deep aubergine surface                 |
| `--core-profile-purple`      | `#4B3B63` | Muted profile purple (settings rail)   |
| `--core-purple`              | `#6D28D9` | Primary vivid purple                   |
| `--core-lavender`            | `#C4B5FD` | Pale lavender                          |
| `--core-pink`                | `#F59AD3` | Restrained pink                        |
| `--core-warm-white`          | `#F7F5F0` | Warm off-white                         |

Functional (non-brand) colors, kept deliberately separate from the 7 above
because they carry meaning rather than decoration:

| Core token                   | Hex       | Use                                    |
| ----------------------------- | --------: | ---------------------------------------- |
| `--core-feedback-correct`     | `#17B787` | Wordle/Quordle/Spelling Bee "correct" tile |
| `--core-feedback-present`     | `#EFC64A` | "Present" (wrong spot) tile              |
| `--core-error`                | `#FF5454` | Form/API error text (pre-existing token) |

Every other color in the app — every gradient stop, every nav surface,
every muted/secondary tint — is derived from these 10 literals via direct
reuse or `color-mix()`, never a new literal. This is a deliberate
consolidation: earlier revisions of this file accumulated several
near-duplicate purples/lavenders/near-blacks (a separate `violet`, a
separate `lilac`, a separate nav-only lavender, etc.); those are now all
expressed as `color-mix()` blends of the palette above instead of their own
hex values.

## Semantic tokens

Defined on `:root` (light) with overrides on `.dark` (dark theme), per
next-themes' class strategy. `tailwind.config.js` maps Tailwind color names
to these variables — new work should prefer the semantic names on the
right; the legacy names on the left still exist as aliases so already-shipped
pages don't need to be touched.

| Tailwind class(es)                              | CSS variable                    | Light value                 | Dark value                 |
| ------------------------------------------------ | -------------------------------- | ---------------------------- | ---------------------------- |
| `bg-canvas` / `bg-page-background`               | `--color-page-background`       | warm-white                   | ink                           |
| `bg-surface` / `bg-surface-primary`              | `--color-surface-primary`        | warm-white                   | aubergine                     |
| `bg-surface-subtle` / `bg-surface-secondary`     | `--color-surface-secondary`      | warm-white ↦ 8% ink mix       | aubergine ↦ 15% warm-white mix |
| `bg-profile`                                      | `--color-profile`                | muted profile purple (fixed) | muted profile purple (fixed) |
| `bg-primary` / `bg-action-primary`               | `--color-action-primary`         | vivid purple                 | pale lavender                |
| `bg-primary-hover` / `bg-action-primary-hover`   | `--color-action-primary-hover`   | purple ↦ 15% warm-white mix   | lavender ↦ 15% purple mix     |
| `text-on-primary` / `text-on-action-primary`     | `--color-on-action-primary`      | warm-white                   | ink                           |
| `bg-accent-lavender`                              | `--color-accent-lavender`        | pale lavender (fixed)        | pale lavender (fixed)        |
| `bg-accent-pink`                                  | `--color-accent-pink`            | restrained pink (fixed)      | restrained pink (fixed)      |
| `text-text-primary`                               | `--color-text-primary`           | ink                           | warm-white                   |
| `text-text-muted` / `text-text-secondary`        | `--color-text-secondary`         | ink ↦ 42% warm-white mix      | warm-white ↦ 28% ink mix      |
| `text-text-inverse`                               | `--color-text-inverse`           | warm-white                   | ink                           |
| `border-border-subtle`                            | `--color-border-subtle`          | ink ↦ 86% warm-white mix      | warm-white ↦ 86% ink mix      |
| `outline-focus` (via global `:focus-visible`)    | `--color-focus`                  | vivid purple                 | pale lavender                |
| `bg-danger-surface`                               | `--color-danger-surface`         | pink ↦ 82% warm-white mix     | pink ↦ 84% aubergine mix      |
| `bg-danger-action`                                | `--color-danger-action`          | restrained pink (fixed)      | restrained pink (fixed)      |
| `text-danger-action-text`                          | `--color-danger-action-text`     | ink (fixed)                   | ink (fixed)                   |
| `bg-overlay`                                      | `--color-overlay`                | ink @ 50% (modal scrim)       | ink @ 65%                     |
| `bg-lavender-tint`                                | `--color-surface-lavender-tint`  | lavender ↦ 75% warm-white mix | (fixed, same value)          |

Legacy neutral-scale class names (`light`, `lighter`, `lightest`, `medium`,
`mediumdark`, `dark`, `darker`, `darkest`, `background`, `purple2`) still
work exactly as before but now resolve to `--legacy-*` variables in
`brand.css`, which are themselves derived from the core palette — so there
is still one source of truth even though a subset of pages reference colors
by these older, appearance-based names rather than the new purpose-based
ones. `error`, `green`, and `yellow` are the three functional colors above.

## Typography

- Family: **Archivo** (`--font-display` / `--font-brand`) for page titles,
  card values, and major headings — weights 700/800/900, `-0.04em` tracking
  on large sizes.
- Family: **Inter** (`--font-body`, aliased as the `font-ui` Tailwind class
  for existing call sites) for navigation, tabs, labels, body copy, buttons
  — weights 400/500/600/700.

Both fonts are loaded via `next/font/google` in `src/pages/_app.tsx`, the
one place the literal family names `"Archivo"`/`"Inter"` are allowed to
appear outside `brand.css` — `next/font` requires the loader call itself to
live in a module that exposes CSS variables (`--font-archivo`,
`--font-inter`), which `brand.css` then composes into the semantic
`--font-display` / `--font-body` / `--font-brand` tokens. This is a
documented technical exception, not a duplicated literal.

## Light / dark guidance

- Theming runs entirely through `next-themes` (`attribute="class"` in
  `_app.tsx`) plus Tailwind's `dark:` class strategy.
- The navigation bar, the Play dropdown, the Play page's four game cards,
  the Settings profile rail, and the account-action buttons are
  deliberately **theme-invariant** (fixed identity in both themes) — this
  matches the reference designs for those surfaces and keeps their brand
  identity legible regardless of theme. Page canvas, neutral surfaces,
  muted text, and borders still adapt between light and dark via the
  semantic tokens above.
- Every interactive element gets exactly one focus treatment: a global
  `:focus-visible { outline: 2px solid var(--color-focus); }` rule in
  `globals.css`, paired with `:focus { outline: none; }` so a mouse/touch
  interaction never leaves a residual ring — only real keyboard focus
  shows the outline. Components must not add their own
  `focus-visible:outline-*` utility classes on top of this; the global
  rule is the single source of truth for focus rings.

## Stat card icons

The Game Stats cards use small, restrained geometric SVG graphics (tile
grids, dot fields, bar charts, split circles) — not illustrations, emoji, or
external icon packs. They live at `src/components/icons/`: six standalone
components (`WinsIcon`, `LossesIcon`, `GamesPlayedIcon`, `AverageScoreIcon`,
`WinRatioIcon`, `TotalScoreIcon`) plus a typed `StatIcon` wrapper
(`src/components/icons/StatIcon.tsx`). Each icon is decorative
(`aria-hidden`, unfocusable) by default; pass `decorative={false}` with a
`title` to expose an accessible name instead.

Icon color tokens (`src/styles/brand.css`), all derived from the core
palette:

| Token                  | Use                                   |
| ----------------------- | --------------------------------------- |
| `--stat-icon-strong`    | Deepest fill (= `--core-purple`)        |
| `--stat-icon-vivid`     | Second-deepest fill                     |
| `--stat-icon-medium`    | Mid-tone fill                           |
| `--stat-icon-soft`      | Lighter fill (= `--core-lavender`)      |
| `--stat-icon-pale`      | Palest fill                             |
| `--stat-icon-contrast`  | Bright accent (= `--core-warm-white`)   |
| `--stat-icon-line`      | Outline strokes (`color-mix(currentColor...)`) |

`--stat-icon-medium` gets a brighter dark-theme override so the Average
Score card's bar graphic still reads against its darker
`surface-secondary` background. The other tokens are reused unchanged in
dark mode because those stat cards keep a fixed gradient identity across
themes.

Icons are not decoration for its own sake — keep new ones flat-fill,
geometric, and restrained (no glow, gradients-within-icons, 3D, or cartoon
outlines).
