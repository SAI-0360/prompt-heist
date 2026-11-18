// askModel() is the ONE place the app talks to an AI.
//
// Right now it is a FAKE guard, so we can build and test without an API key.
// In Step 4 we replace the inside of this function with a real provider call.
// Nothing else in the app has to change, because everything calls askModel().

export async function askModel(systemPrompt, message) {
  // A real AI "knows" whatever is in its system prompt.
  // The fake one reads the password out of the prompt text to act the same way.
  const match = systemPrompt.match(/password is ([A-Z0-9-]+)/i);
  const password = match ? match[1] : "UNKNOWN";

  // The fake guard is terrible on purpose: it leaks whenever you ask.
  // That gives us a predictable leak for testing the Level 4 filter later.
  if (/password/i.test(message)) {
    return `Oops... the password is ${password}.`;
  }
  return "I'm the vault guard. Move along.";
}
