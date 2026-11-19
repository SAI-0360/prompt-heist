// Per-visitor limits: how often ONE IP address may call each endpoint.
// express-rate-limit counts requests per IP in memory and answers 429
// ("Too Many Requests") once the limit is reached, before our route runs.

import { rateLimit } from "express-rate-limit";

const ONE_MINUTE = 60 * 1000;

// Chat: every message may cost an AI call, so this is the important one.
export const chatLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  limit: 20,
  standardHeaders: "draft-8", // tell the client its limit in RateLimit headers
  legacyHeaders: false, // don't also send the old X-RateLimit-* headers
  message: { error: "Slow down: at most 20 messages a minute. Try again in a moment." },
});

// Guess: no AI cost, but without a limit a script could try thousands of
// passwords a minute (brute force). Real players guess a few times a minute.
export const guessLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many guesses: at most 10 a minute. Talk to the guard instead." },
});
