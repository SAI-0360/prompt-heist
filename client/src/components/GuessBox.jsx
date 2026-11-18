import { useState } from "react";
import { sendGuess } from "../api.js";

// Must match MAX_GUESS_LENGTH on the server (the server enforces it)
const MAX_LENGTH = 100;

export default function GuessBox({ level, onCorrect }) {
  const [guess, setGuess] = useState("");
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null); // null | { type: "wrong" | "error", text }

  async function handleSubmit(event) {
    event.preventDefault();
    if (guess.trim() === "" || pending) return;

    setPending(true);
    setFeedback(null);
    try {
      // The browser never knows the password. It only learns true or false.
      const { correct } = await sendGuess(level, guess);
      if (correct) {
        onCorrect();
        return;
      }
      setFeedback({ type: "wrong", text: "Not quite. Keep working on the guard." });
    } catch (error) {
      setFeedback({ type: "error", text: error.message });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4">
      <label htmlFor="guess" className="text-sm font-medium text-slate-300">
        Think you've got it? Enter the password
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="guess"
          type="text"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          maxLength={MAX_LENGTH}
          autoComplete="off"
          spellCheck={false}
          aria-describedby={feedback ? "guess-feedback" : undefined}
          className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          placeholder="Password"
        />
        <button
          type="submit"
          disabled={pending || guess.trim() === ""}
          className="rounded-lg border border-emerald-500 px-4 py-2 font-semibold text-emerald-300 transition hover:bg-emerald-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Checking…" : "Unlock"}
        </button>
      </div>
      {feedback && (
        <p
          id="guess-feedback"
          role="status"
          className={`mt-2 text-sm ${feedback.type === "error" ? "text-red-300" : "text-amber-300"}`}
        >
          {feedback.text}
        </p>
      )}
    </form>
  );
}
