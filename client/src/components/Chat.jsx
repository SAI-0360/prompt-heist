import { useEffect, useRef, useState } from "react";
import { sendChat } from "../api.js";

// Must match MAX_MESSAGE_LENGTH on the server. The server is the one that enforces it;
// this only helps honest players see the limit before they hit it.
const MAX_LENGTH = 500;

// `messages` lives in LevelPage (the parent), not here, because the debrief card
// also needs it. This component just shows the list and adds to it.
// Each message: { role: "player" | "guard" | "error", text, blocked? }
export default function Chat({ level, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's own form submit (page reload)
    const text = input.trim();
    if (!text || pending) return;

    // `setX(old => ...)` builds the new list from the latest list, not a stale copy
    setMessages((old) => [...old, { role: "player", text }]);
    setInput("");
    setPending(true);

    try {
      const { reply, blocked } = await sendChat(level, text);
      setMessages((old) => [...old, { role: "guard", text: reply, blocked }]);
    } catch (error) {
      setMessages((old) => [...old, { role: "error", text: error.message }]);
    } finally {
      setPending(false); // runs after try OR catch, so the box never stays locked
    }
  }

  return (
    <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900">
      <div
        className="h-80 space-y-3 overflow-y-auto p-4"
        aria-live="polite"
        aria-label="Conversation with the guard"
      >
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            The guard is waiting. Say something to start.
          </p>
        )}

        {messages.map((message, index) => (
          <Bubble key={index} message={message} />
        ))}

        {pending && <p className="text-sm italic text-slate-500">The guard is thinking…</p>}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-slate-800 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_LENGTH}
            placeholder="Talk to the guard…"
            aria-label="Your message to the guard"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={pending || input.trim() === ""}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
        <p className="mt-1 text-right text-xs text-slate-600">
          {input.length}/{MAX_LENGTH}
        </p>
      </form>
    </section>
  );
}

// One chat bubble. The text is shown as plain text: React escapes it, so even if the
// AI (or a player) produces <script> or HTML, it is displayed, never executed.
function Bubble({ message }) {
  const { role, text, blocked } = message;

  if (role === "player") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-lg bg-emerald-600/20 px-3 py-2 text-emerald-100">
          {text}
        </p>
      </div>
    );
  }

  if (role === "error") {
    return (
      <p className="rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
        {text}
      </p>
    );
  }

  // role === "guard"
  return (
    <div className="flex justify-start">
      <p
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 ${
          blocked
            ? "border border-amber-700 bg-amber-950/40 text-amber-200"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {text}
      </p>
    </div>
  );
}
