import { Router } from "express";
import { askModel } from "../llm.js";
import { isValidLevel, getLevel, LEVEL_COUNT } from "../levels.js";
import { leaksPassword, FILTER_BLOCK_MESSAGE } from "../defences/filter.js";
import { reserveAiCalls } from "../daily-budget.js";
import { reviewerAllows, REVIEWER_BLOCK_MESSAGE } from "../defences/reviewer.js";

const router = Router();

const MAX_MESSAGE_LENGTH = 500;

// POST /api/chat   body: { level, message }   ->   { reply, blocked }
router.post("/", async (req, res) => {
  // req.body is undefined if the request had no JSON body, so fall back to {}
  const { level, message } = req.body ?? {};

  if (!isValidLevel(level)) {
    return res
      .status(400)
      .json({ error: `level must be a whole number from 1 to ${LEVEL_COUNT}` });
  }

  if (typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "message must be a non-empty string" });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res
      .status(400)
      .json({ error: `message must be at most ${MAX_MESSAGE_LENGTH} characters` });
  }

  const { systemPrompt, password, outputFilter, aiReviewer } = getLevel(level);

  // Daily cap for the whole app. Level 5 costs two AI calls (guard + reviewer).
  // Checked AFTER validation, so invalid requests never use up the budget.
  if (!reserveAiCalls(aiReviewer ? 2 : 1)) {
    return res.status(503).json({
      error: "The guard is off duty: the game's daily limit is used up. Try again tomorrow.",
    });
  }

  const playerMessage = message.trim();
  const reply = await askModel(systemPrompt, playerMessage);

  // Level 4+: check the reply in code before the player sees it (cheap, instant)
  if (outputFilter && leaksPassword(reply, password)) {
    return res.json({ reply: FILTER_BLOCK_MESSAGE, blocked: true });
  }

  // Level 5: a second AI reviews whatever the filter let through (costs a call,
  // so it runs only after the free check has passed)
  if (aiReviewer && !(await reviewerAllows({ playerMessage, reply, password }))) {
    return res.json({ reply: REVIEWER_BLOCK_MESSAGE, blocked: true });
  }

  res.json({ reply, blocked: false });
});

export default router;
