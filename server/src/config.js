// Optional settings from the environment, each with a safe default.
// Like the passwords in levels.js: if a value IS set but is wrong, crash at
// startup with a clear message instead of quietly using something unexpected.

function readWholeNumber(name, defaultValue, min, max) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} must be a whole number from ${min} to ${max} (got "${raw}").`);
  }
  return value;
}

// How many proxies sit in front of Express. 0 locally (nothing in front).
// On a host like Render it's 1. Express uses this to decide which IP address
// in the X-Forwarded-For header is the real visitor. See index.js.
export const TRUST_PROXY = readWholeNumber("TRUST_PROXY", 0, 0, 5);

// Most AI calls the whole app may make per day (UTC), across ALL players.
// Protects the free-tier quota (and money, if the key is ever on a paid plan).
export const DAILY_AI_CALL_LIMIT = readWholeNumber("DAILY_AI_CALL_LIMIT", 800, 1, 100000);

// Which Groq model plays the guard, and which one reviews replies on Level 5.
// Groq's free limits are per model, so two different models also means two
// separate daily quotas.
function readModelName(name, defaultValue) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return defaultValue;
  if (!/^[A-Za-z0-9._/-]{1,100}$/.test(raw)) {
    throw new Error(`${name} doesn't look like a model name (got "${raw}").`);
  }
  return raw;
}

export const GUARD_MODEL = readModelName("GUARD_MODEL", "allam-2-7b");
export const REVIEWER_MODEL = readModelName("REVIEWER_MODEL", "openai/gpt-oss-120b");
