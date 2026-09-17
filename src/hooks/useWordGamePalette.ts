import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import getByUserEmail from "../../lib/getByUserEmail";
import updateData from "../../lib/updateData";

export type WordGamePalette = "fimla" | "classic";

export const WORD_GAME_PALETTE_STORAGE_KEY = "fimla:word-game-palette";
const DEFAULT_PALETTE: WordGamePalette = "fimla";

function isValidPalette(value: unknown): value is WordGamePalette {
  return value === "fimla" || value === "classic";
}

function readLocalPalette(): WordGamePalette {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  try {
    const stored = window.localStorage.getItem(WORD_GAME_PALETTE_STORAGE_KEY);
    return isValidPalette(stored) ? stored : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

function writeLocalPalette(value: WordGamePalette) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORD_GAME_PALETTE_STORAGE_KEY, value);
  } catch {
    // Storage unavailable (private mode, quota, disabled) - fall back to
    // the in-memory value for the rest of this session, silently.
  }
}

function applyPaletteAttribute(value: WordGamePalette) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-palette", value);
}

/**
 * One shared Wordle/Quordle result-color preference. Semantic tile/keyboard
 * states are driven entirely by the `data-palette` attribute on <html> (see
 * src/styles/brand.css) - this hook only ever decides which of "fimla" /
 * "classic" that attribute should be, and where the choice is remembered:
 *
 *   1. Authenticated profile preference (UserInfo.wordGamePalette), when set.
 *   2. This device's existing guest/local preference.
 *   3. The Fimla default.
 *
 * A tiny inline script in _document.tsx applies the localStorage value to
 * <html> before hydration, so there's no flash on first paint; this hook
 * just picks up whatever is already there and reconciles it with the
 * signed-in profile once a session is available.
 */
export default function useWordGamePalette() {
  const { data: session, status } = useSession();

  const [palette, setPaletteState] = useState<WordGamePalette>(() => {
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-palette");
      if (isValidPalette(attr)) return attr;
    }
    return readLocalPalette();
  });

  // null = "we don't yet know if this account has a UserInfo row"
  const profileRowExists = useRef<boolean | null>(null);
  const hasReconciled = useRef(false);

  const applyPalette = (value: WordGamePalette) => {
    setPaletteState(value);
    applyPaletteAttribute(value);
    writeLocalPalette(value);
  };

  // Keep multiple tabs/pages on this device in sync with each other.
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== WORD_GAME_PALETTE_STORAGE_KEY) return;
      if (isValidPalette(e.newValue)) {
        setPaletteState(e.newValue);
        applyPaletteAttribute(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Reconcile with the signed-in profile once a session becomes available.
  useEffect(() => {
    if (status !== "authenticated" || hasReconciled.current) return;
    hasReconciled.current = true;

    getByUserEmail("userinfo", session?.user).then((result) => {
      const info = result?.[0];
      profileRowExists.current = Boolean(info);
      const profilePalette = info?.wordGamePalette;

      if (isValidPalette(profilePalette)) {
        // Account preference wins over whatever was on this device.
        setPaletteState((current) => {
          if (profilePalette !== current) {
            applyPaletteAttribute(profilePalette);
            writeLocalPalette(profilePalette);
            return profilePalette;
          }
          return current;
        });
      } else if (session?.user?.email) {
        // No saved profile preference yet - adopt this device's current
        // choice and save it, so it now follows the account.
        const userEmail = session.user.email;
        setPaletteState((current) => {
          const body = {
            userEmail,
            wordGamePalette: current,
          };
          if (info) {
            updateData("userinfo", "PUT", body);
          } else {
            updateData("userinfo", "POST", body);
          }
          profileRowExists.current = true;
          return current;
        });
      }
    });
  }, [status, session]);

  const setPalette = (value: WordGamePalette) => {
    // Update local state, the DOM attribute, and localStorage immediately -
    // don't wait on the network so the game never feels blocked by a save.
    applyPalette(value);

    if (status !== "authenticated" || !session?.user?.email) return;

    const email = session.user.email;
    const save = () => {
      const body = { userEmail: email, wordGamePalette: value };
      if (profileRowExists.current) {
        updateData("userinfo", "PUT", body);
      } else {
        updateData("userinfo", "POST", body);
        profileRowExists.current = true;
      }
    };

    if (profileRowExists.current === null) {
      getByUserEmail("userinfo", session.user).then((result) => {
        profileRowExists.current = Boolean(result?.[0]);
        save();
      });
    } else {
      save();
    }
  };

  return { palette, setPalette };
}
