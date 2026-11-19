// A cap on AI calls for the WHOLE app per day, across all players.
//
// The per-IP rate limit stops one person. It can't stop a hundred people (or
// one person with many IP addresses) from using up the free daily quota
// together. This counter can.
//
// It lives in memory: a restart resets it, and it assumes one server process.
// That's fine for this game; a bigger app would keep the count in a database.

import { DAILY_AI_CALL_LIMIT } from "./config.js";

let currentDay = todayUtc();
let callsUsed = 0;

function todayUtc() {
  return new Date().toISOString().slice(0, 10); // "2026-11-18"
}

// Reserve `count` AI calls BEFORE making them. Returns false if that would go
// over today's cap, and then nothing is reserved.
export function reserveAiCalls(count) {
  const today = todayUtc();
  if (today !== currentDay) {
    currentDay = today; // a new day: start counting from zero
    callsUsed = 0;
  }

  if (callsUsed + count > DAILY_AI_CALL_LIMIT) {
    return false;
  }
  callsUsed += count;
  return true;
}
