import { LEVELS } from "../content/levels.js";

// Five steps: solved ✓, the one you're on, unlocked, or locked 🔒.
// Solved and unlocked levels can be opened; locked ones can't.
export default function ProgressBar({ level, solved, unlocked, onOpenLevel }) {
  return (
    <nav aria-label="Level progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {LEVELS.map((item) => {
          const isSolved = item.number <= solved;
          const isCurrent = item.number === level;
          const isLocked = item.number > unlocked;

          let style = "bg-slate-800 text-slate-300 hover:bg-slate-700"; // unlocked
          if (isSolved) style = "bg-emerald-900/60 text-emerald-300 hover:bg-emerald-900";
          if (isLocked) style = "bg-slate-900 text-slate-600 cursor-not-allowed";
          if (isCurrent) style = "bg-emerald-500 text-slate-950 font-semibold";

          const state = isLocked ? "locked" : isSolved ? "solved" : "not solved yet";

          return (
            <li key={item.number} className="flex-1">
              <button
                type="button"
                onClick={() => onOpenLevel(item.number)}
                disabled={isLocked}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Level ${item.number}: ${item.title} (${state})`}
                className={`w-full rounded-md py-2 text-sm transition ${style}`}
              >
                {isLocked ? "🔒" : isSolved ? `✓ ${item.number}` : item.number}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
