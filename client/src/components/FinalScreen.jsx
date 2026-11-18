import { FINAL_LESSONS, REPO_URL } from "../content/levels.js";

export default function FinalScreen({ onReplay, onPlayAgain }) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
        Heist complete
      </p>
      <h1 className="mt-2 text-4xl font-bold">You beat all five guards.</h1>
      <p className="mt-4 text-slate-300">
        Every defence fell, the strong ones just took longer. Here's what that means for real
        apps that give AI private data and real powers:
      </p>

      <ol className="mt-8 space-y-4">
        {FINAL_LESSONS.map((lesson, index) => (
          <li key={lesson.title} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">
              <span className="text-emerald-400">{index + 1}.</span> {lesson.title}
            </h2>
            <p className="mt-1 text-slate-300">{lesson.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-emerald-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          See how each defence works (GitHub)
        </a>
        <button
          type="button"
          onClick={onReplay}
          className="rounded-lg border border-slate-700 px-5 py-2 text-slate-300 transition hover:bg-slate-800"
        >
          Replay a level
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-lg px-5 py-2 text-slate-500 transition hover:text-slate-300"
        >
          Reset progress
        </button>
      </div>
    </main>
  );
}
