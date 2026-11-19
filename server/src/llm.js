// askModel() is the ONE place the app talks to an AI.
//
// Steps 1-3 used a fake guard here. It is now a real model on Groq. Nothing
// else in the app had to change, because everything calls askModel().

import Groq from "groq-sdk";
import { GUARD_MODEL } from "./config.js";

// Fail fast (like the passwords in levels.js): no key, no server.
if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing. Add it to server/.env (or set it on the host).");
}

const client = new Groq({
  // apiKey is read from process.env.GROQ_API_KEY by default
  timeout: 20 * 1000, // a player won't wait a minute (the SDK default)
  maxRetries: 1, // one quick retry on network/5xx errors, not two
});

// Settings that only some models accept
function reasoningOptions(model) {
  if (model.startsWith("openai/gpt-oss")) {
    // Think a little, and NEVER send the thinking back (see below)
    return { reasoning_effort: "low", include_reasoning: false };
  }
  if (model.startsWith("qwen/")) {
    return { reasoning_effort: "none" }; // qwen can skip thinking entirely
  }
  return {};
}

export async function askModel(systemPrompt, message, { model = GUARD_MODEL, maxTokens = 400 } = {}) {
  let completion;
  try {
    completion = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      // Caps the answer length: less cost, and less room for long leaks
      max_completion_tokens: maxTokens,
      ...reasoningOptions(model),
    });
  } catch (error) {
    // Log what went wrong for us (never the key; the SDK doesn't put it in errors)
    console.error(`AI call to ${model} failed:`, error.status ?? "", error.name, error.message);

    // Turn it into an error with a safe, player-facing message.
    // index.js's error handler sends `publicMessage` with `status`.
    const busy = error instanceof Groq.RateLimitError;
    const safe = new Error("AI call failed");
    safe.status = busy ? 503 : 502;
    safe.publicMessage = busy
      ? "The guard is busy: too many players right now. Try again in a few seconds."
      : "The guard didn't answer. Try again in a moment.";
    throw safe;
  }

  // Only the final answer. A reasoning model's "thinking" may mention the
  // password ("the password is X, but I must not say it"); it is switched off
  // above with include_reasoning: false and must never be returned.
  const text = completion.choices[0]?.message?.content?.trim();
  return text || "…";
}
