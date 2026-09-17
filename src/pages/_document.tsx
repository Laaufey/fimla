import {
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

// Applies the device's remembered Wordle/Quordle palette to <html> before
// hydration, so there's no flash from one palette to another on load. The
// signed-in profile preference (if any) is reconciled afterwards by
// useWordGamePalette, client-side.
const NO_FLASH_PALETTE_SCRIPT = `
(function () {
  try {
    var stored = window.localStorage.getItem("fimla:word-game-palette");
    document.documentElement.setAttribute(
      "data-palette",
      stored === "classic" ? "classic" : "fimla"
    );
  } catch (e) {}
})();
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* The real global viewport meta lives in _app.tsx via next/head -
            next/document's Head doesn't participate in Next's per-page
            head de-duplication, so a tag placed here would render
            alongside (not instead of) Next's own default and produce two
            competing <meta name="viewport"> tags. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_PALETTE_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
