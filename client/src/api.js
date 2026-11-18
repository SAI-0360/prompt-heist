// The ONLY file that talks to the server. Components call these two functions
// and never write fetch() themselves, so the URLs and error handling live in one place.
//
// Paths start with /api and have no host: in development the Vite proxy forwards
// them to Express, and in production Express serves this app itself.

async function post(path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch only throws when the request never reached a server (offline, server down)
    throw new Error("Can't reach the server. Is it running?");
  }

  // Our server always answers with JSON, but be safe in case something else answers
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // 400 / 413 / 500 from Express carry { error: "..." }
    if (data.error) throw new Error(data.error);
    // A 5xx with no JSON body didn't come from our code: a proxy or host answering
    // because Express is down or restarting
    if (response.status >= 500) throw new Error("The server isn't responding. Try again in a moment.");
    throw new Error("Something went wrong");
  }
  return data;
}

// -> { reply, blocked }
export function sendChat(level, message) {
  return post("/api/chat", { level, message });
}

// -> { correct }
export function sendGuess(level, guess) {
  return post("/api/guess", { level, guess });
}
