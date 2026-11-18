import { useState } from "react";
import Chat from "./Chat.jsx";
import GuessBox from "./GuessBox.jsx";
import DebriefCard from "./DebriefCard.jsx";
import ProgressBar from "./ProgressBar.jsx";
import { LEVEL_COUNT, getLevelInfo } from "../content/levels.js";

// App renders this with key={level}, so moving to another level throws this
// component away and starts a fresh one: empty chat, no debrief showing.
export default function LevelPage({ level, solved, unlocked, onSolved, onOpenLevel, onFinish, onHome }) {
  const info = getLevelInfo(level);

  // "Lifted" state: Chat adds to it, DebriefCard reads it
  const [messages, setMessages] = useState([]);
  const [won, setWon] = useState(false);

  function handleCorrect() {
    onSolved(level); // save progress (App → useProgress)
    setWon(true); // show the debrief card here
  }

  function handleNext() {
    if (level === LEVEL_COUNT) onFinish();
    else onOpenLevel(level + 1);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <button
        type="button"
        onClick={onHome}
        className="mb-4 text-sm font-semibold text-slate-400 transition hover:text-emerald-300"
      >
        ← Prompt Heist
      </button>

      <ProgressBar level={level} solved={solved} unlocked={unlocked} onOpenLevel={onOpenLevel} />

      <header className="mb-4">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          Level {info.number} of {LEVEL_COUNT}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{info.title}</h1>
        {!won && <p className="mt-3 text-slate-300">{info.briefing}</p>}
      </header>

      {won ? (
        <DebriefCard level={level} messages={messages} onNext={handleNext} />
      ) : (
        <>
          <Chat level={level} messages={messages} setMessages={setMessages} />
          <GuessBox level={level} onCorrect={handleCorrect} />
        </>
      )}
    </main>
  );
}
