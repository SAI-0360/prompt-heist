import { LEVEL_COUNT, getLevelInfo } from "../content/levels.js";

// Shown after a correct guess. This card is the core of the learning:
// what you tried, why it worked, and how a real app would defend.
export default function DebriefCard({ level, messages, onNext }) {
  const { title, debrief } = getLevelInfo(level);
  const isLast = level === LEVEL_COUNT;

  // Only the player's own messages, newest last; at most the last 5
  const yourMessages = messages.filter((message) => message.role === "player").slice(-5);

  return (
    <section
      aria-labelledby="debrief-title"
      className="rounded-xl border border-emerald-700 bg-emerald-950/30 p-6"
    >
      <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
        ✓ Level {level} cleared: {title}
      </p>
      <h2 id="debrief-title" className="mt-2 text-2xl font-bold">
        What just happened
      </h2>

      <h3 className="mt-5 font-semibold text-slate-200">Your trick</h3>
      {yourMessages.length === 0 ? (
        <p className="mt-1 text-slate-400">
          You guessed it without asking the guard anything. Lucky, or clever?
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {yourMessages.map((message, index) => (
            <li
              key={index}
              className="whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-300"
            >
              {message.text}
            </li>
          ))}
        </ul>
      )}

      <h3 className="mt-5 font-semibold text-slate-200">Why it worked</h3>
      <p className="mt-1 text-slate-300">{debrief.whyItWorked}</p>

      <h3 className="mt-5 font-semibold text-slate-200">How a real app would defend</h3>
      <p className="mt-1 text-slate-300">{debrief.realDefence}</p>

      <p className="mt-6 rounded-lg border-l-4 border-emerald-500 bg-slate-900 px-4 py-3 font-semibold">
        Lesson: {debrief.lesson}
      </p>

      <button
        type="button"
        onClick={onNext}
        autoFocus
        className="mt-6 rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        {isLast ? "See the three real lessons →" : `On to Level ${level + 1} →`}
      </button>
    </section>
  );
}
