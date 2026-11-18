import { LEVEL_COUNT } from "../content/levels.js";

export default function Landing({ solved, onStart, onResetProgress }) {
  const finished = solved === LEVEL_COUNT;

  let startLabel = "Start the heist";
  if (finished) startLabel = "See the lessons";
  else if (solved > 0) startLabel = `Continue at Level ${solved + 1}`;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-emerald-400">
        A prompt injection game
      </p>
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Prompt Heist</h1>
      <p className="mt-6 text-lg text-slate-300">
        An AI guard knows a secret password. Talk your way past it.
      </p>
      <p className="mt-3 text-slate-400">
        Five levels. Each defence is stronger than the last, and each one teaches why real AI
        apps still leak.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-10 rounded-lg bg-emerald-500 px-8 py-3 text-lg font-semibold text-slate-950 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        {startLabel}
      </button>

      {solved > 0 && (
        <button
          type="button"
          onClick={onResetProgress}
          className="mt-4 text-sm text-slate-500 underline-offset-4 hover:text-slate-300 hover:underline"
        >
          Start over from Level 1
        </button>
      )}

      <p className="mt-8 text-xs text-slate-500">
        No login. Your progress is saved only in this browser.
      </p>
    </main>
  );
}
