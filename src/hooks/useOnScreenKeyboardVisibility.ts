import { useEffect, useState } from "react";

const STORAGE_KEY = "fimla:word-game-keyboard-visible";

// Fine-pointer (mouse/trackpad) devices default to collapsed since a
// physical keyboard is assumed; coarse-pointer (touch) devices default to
// visible, since they usually have no physical keyboard.
function detectDefaultVisibility(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return true;
  }
}

function readStoredVisibility(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
    return null;
  } catch {
    return null;
  }
}

/**
 * Device-local (never synced to the user profile - different devices have
 * different input needs) on-screen keyboard visibility for Wordle/Quordle.
 * Once the player explicitly toggles it, that choice is remembered and
 * respected regardless of viewport resizes.
 */
export default function useOnScreenKeyboardVisibility() {
  const [visible, setVisibleState] = useState<boolean>(() => {
    const stored = readStoredVisibility();
    return stored !== null ? stored : detectDefaultVisibility();
  });

  // The server/initial render can't know pointer type, so resolve the real
  // default once the client mounts - but only when nothing was explicitly
  // chosen before, so we never override a stored preference.
  useEffect(() => {
    if (readStoredVisibility() === null) {
      setVisibleState(detectDefaultVisibility());
    }
  }, []);

  const setVisible = (value: boolean) => {
    setVisibleState(value);
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // Storage unavailable - keep the in-memory value for this session.
    }
  };

  return { visible, setVisible };
}
