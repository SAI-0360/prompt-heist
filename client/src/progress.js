import { useEffect, useState } from "react";
import { LEVEL_COUNT } from "./content/levels.js";

// Progress = how many levels are solved (0 to 5). Levels 1..solved are done, and the
// next one is unlocked. Saved in localStorage so a page refresh doesn't lose it.
//
// localStorage belongs to the player: they can edit it in DevTools and unlock every
// level. That's fine here. It only skips the game; every guess is still checked by
// the server. Never use localStorage to decide something that matters.

const STORAGE_KEY = "prompt-heist:solved";

function readSolved() {
  try {
    // getItem gives a string or null. Treat it like any untrusted input:
    // anything that isn't a whole number from 0 to LEVEL_COUNT becomes 0.
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isInteger(value) && value >= 0 && value <= LEVEL_COUNT ? value : 0;
  } catch {
    return 0; // storage can be blocked (some privacy modes); just start fresh
  }
}

function writeSolved(value) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Can't save: the game still works, progress just won't survive a refresh
  }
}

export function useProgress() {
  // Passing the function (not calling it) means it runs once, on the first render
  const [solved, setSolved] = useState(readSolved);

  // Whenever `solved` changes, save it
  useEffect(() => {
    writeSolved(solved);
  }, [solved]);

  function markSolved(level) {
    // Replaying an old level must never LOWER progress
    setSolved((old) => Math.max(old, level));
  }

  function resetProgress() {
    setSolved(0);
  }

  // The highest level the player may open
  const unlocked = Math.min(solved + 1, LEVEL_COUNT);

  return { solved, unlocked, markSolved, resetProgress };
}
