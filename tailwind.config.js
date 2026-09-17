/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        // Height-sensitive breakpoint for compact game shells on short
        // laptop windows/landscape phones, alongside the normal
        // width-based screens above.
        short: { raw: "(max-height: 700px)" },
      },
      colors: {
        // Legacy neutral scale (see src/styles/brand.css --legacy-*).
        // Names are historical; values are fully derived from the core
        // brand palette so there is still one source of truth for them.
        light: "var(--legacy-light)",
        lighter: "var(--legacy-lighter)",
        lightest: "var(--legacy-lightest)",
        medium: "var(--legacy-medium)",
        mediumdark: "var(--legacy-mediumdark)",
        dark: "var(--legacy-dark)",
        darker: "var(--legacy-darker)",
        darkest: "var(--legacy-darkest)",
        background: "var(--legacy-background)",
        purple2: "var(--legacy-purple2)",

        // Functional (non-brand) colors — game feedback + form/API errors
        error: "var(--color-error-text)",
        green: "var(--color-feedback-correct)",
        yellow: "var(--color-feedback-present)",

        // Fimla brand foundations — the 7-color core palette (see
        // src/styles/brand.css). Fixed identity: same value in both
        // themes.
        ink: "var(--core-ink)",
        aubergine: "var(--core-aubergine)",
        profile: "var(--core-profile-purple)",
        brandpurple: "var(--core-purple)",
        lavender: "var(--core-lavender)",
        brandpink: "var(--core-pink)",
        "warm-white": "var(--core-warm-white)",

        // Semantic tokens — swap between light/dark via the `.dark`
        // class (see src/styles/brand.css). Prefer these names for new
        // work; the aliases above exist for already-shipped call sites.
        "page-background": "var(--color-page-background)",
        canvas: "var(--color-page-background)",
        "surface-primary": "var(--color-surface-primary)",
        surface: "var(--color-surface-primary)",
        "surface-secondary": "var(--color-surface-secondary)",
        "surface-subtle": "var(--color-surface-secondary)",
        "action-primary": "var(--color-action-primary)",
        primary: "var(--color-action-primary)",
        "action-primary-hover": "var(--color-action-primary-hover)",
        "primary-hover": "var(--color-action-primary-hover)",
        "on-action-primary": "var(--color-on-action-primary)",
        "on-primary": "var(--color-on-action-primary)",
        "accent-lavender": "var(--color-accent-lavender)",
        "accent-pink": "var(--color-accent-pink)",
        "lavender-tint": "var(--color-surface-lavender-tint)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-secondary)",
        "text-inverse": "var(--color-text-inverse)",
        "border-subtle": "var(--color-border-subtle)",
        focus: "var(--color-focus)",
        "danger-surface": "var(--color-danger-surface)",
        "danger-action": "var(--color-danger-action)",
        "danger-action-text": "var(--color-danger-action-text)",
        overlay: "var(--color-overlay)",

        // Floating navigation tokens (see docs/brand.md)
        "nav-background": "var(--nav-background)",
        "nav-border": "var(--nav-border)",
        "nav-text": "var(--nav-text)",
        "nav-text-muted": "var(--nav-text-muted)",
        "nav-item": "var(--nav-item-background)",
        // The ONE shared hover/active/open/selected highlight - see the
        // comment in brand.css. Never give hover and active different
        // values; both reference this same pair.
        "nav-interactive": "var(--nav-interactive-background)",
        "nav-interactive-text": "var(--nav-interactive-text)",
        "nav-focus": "var(--nav-focus)",

        // Play page game card fills (solid, no gradient)
        "play-card-wordle": "var(--play-card-wordle-bg)",
        "play-card-quordle": "var(--play-card-quordle-bg)",
        "play-card-spelling": "var(--play-card-spelling-bg)",
        "play-card-crosswords": "var(--play-card-crosswords-bg)",

        // Word-game (Wordle/Quordle) tile + keyboard tokens - see
        // src/styles/brand.css. Values swap with light/dark and with the
        // `data-palette` attribute (see useWordGamePalette).
        "tile-empty": "var(--tile-empty-bg)",
        "tile-entered": "var(--tile-entered-bg)",
        "tile-correct": "var(--tile-correct-bg)",
        "tile-present": "var(--tile-present-bg)",
        "tile-absent": "var(--tile-absent-bg)",
        "tile-text-empty": "var(--tile-text-empty)",
        "tile-text-entered": "var(--tile-text-entered)",
        "tile-text-correct": "var(--tile-text-correct)",
        "tile-text-present": "var(--tile-text-present)",
        "tile-text-absent": "var(--tile-text-absent)",
        "key-bg": "var(--key-bg)",
        "key-used": "var(--key-used-bg)",
        "key-text": "var(--key-text)",
      },
      backgroundImage: {
        "gradient-purple": "var(--gradient-purple)",
        "gradient-aubergine": "var(--gradient-aubergine)",
        "gradient-lavender": "var(--gradient-lavender)",
        "gradient-pink": "var(--gradient-pink)",
      },
      fontFamily: {
        display: "var(--font-display)",
        brand: "var(--font-brand)",
        body: "var(--font-body)",
        ui: "var(--font-body)",
      },
      letterSpacing: {
        "tight-brand": "-0.04em",
      },
      transitionDelay: {
        delay0: "0ms",
        delay1: "500ms",
        delay2: "1000ms",
        delay3: "1500ms",
        delay4: "2000ms",
      },
    },
  },
  plugins: [],
};
