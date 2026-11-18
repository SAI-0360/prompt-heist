// Level 4+ defence: a plain code check on the AI's reply, BEFORE the player sees it.
// No amount of clever wording changes what this code does, unlike a system prompt.

import { normalise } from "../text.js";

export const FILTER_BLOCK_MESSAGE =
  "🛡️ Blocked by the output filter: the guard's reply contained the password.";

export function leaksPassword(reply, password) {
  const cleanReply = normalise(reply);
  const cleanPassword = normalise(password);
  const reversed = [...cleanPassword].reverse().join("");

  return cleanReply.includes(cleanPassword) || cleanReply.includes(reversed);
}
