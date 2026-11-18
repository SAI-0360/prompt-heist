import { useState } from "react";
import Landing from "./components/Landing.jsx";
import LevelPage from "./components/LevelPage.jsx";
import FinalScreen from "./components/FinalScreen.jsx";
import { useProgress } from "./progress.js";
import { LEVEL_COUNT } from "./content/levels.js";

// No router library: the game is three screens, so one piece of state is enough.
export default function App() {
  const { solved, unlocked, markSolved, resetProgress } = useProgress();
  const [screen, setScreen] = useState("landing"); // "landing" | "level" | "final"
  const [level, setLevel] = useState(unlocked);

  function openLevel(number) {
    // The progress bar already disables locked levels; this is a second guard
    // so no other button can open one either.
    if (number < 1 || number > unlocked) return;
    setLevel(number);
    setScreen("level");
    window.scrollTo(0, 0);
  }

  function start() {
    if (solved === LEVEL_COUNT) setScreen("final");
    else openLevel(unlocked);
  }

  function startOver() {
    resetProgress();
    setLevel(1);
    setScreen("landing");
  }

  if (screen === "final") {
    return <FinalScreen onReplay={() => openLevel(1)} onPlayAgain={startOver} />;
  }

  if (screen === "level") {
    return (
      <LevelPage
        key={level}
        level={level}
        solved={solved}
        unlocked={unlocked}
        onSolved={markSolved}
        onOpenLevel={openLevel}
        onFinish={() => setScreen("final")}
        onHome={() => setScreen("landing")}
      />
    );
  }

  return <Landing solved={solved} onStart={start} onResetProgress={startOver} />;
}
