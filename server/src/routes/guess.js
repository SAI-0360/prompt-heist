import { Router } from "express";
import { isValidLevel, getLevel, LEVEL_COUNT } from "../levels.js";
import { normalise } from "../text.js";

const router = Router();

const MAX_GUESS_LENGTH = 100;

// POST /api/guess   body: { level, guess }   ->   { correct }
// The real password never leaves the server; the browser only learns true/false.
router.post("/", (req, res) => {
  const { level, guess } = req.body ?? {};

  if (!isValidLevel(level)) {
    return res
      .status(400)
      .json({ error: `level must be a whole number from 1 to ${LEVEL_COUNT}` });
  }

  if (typeof guess !== "string" || guess.trim() === "") {
    return res.status(400).json({ error: "guess must be a non-empty string" });
  }

  if (guess.length > MAX_GUESS_LENGTH) {
    return res
      .status(400)
      .json({ error: `guess must be at most ${MAX_GUESS_LENGTH} characters` });
  }

  // Forgiving match: "iron lantern" and "IRON-LANTERN" both count
  const correct = normalise(guess) === normalise(getLevel(level).password);
  res.json({ correct });
});

export default router;
