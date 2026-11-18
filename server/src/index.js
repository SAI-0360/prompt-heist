import express from "express";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Don't advertise "X-Powered-By: Express" to every visitor
app.disable("x-powered-by");

// Parse JSON bodies, and refuse anything over 10 KB.
// A 500-character message is far smaller, so bigger bodies are junk or abuse.
app.use(express.json({ limit: "10kb" }));

// Quick "is the server up?" check (the host can ping this after deploy)
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/chat", chatRouter);

// Any route we didn't define: JSON 404 instead of Express's HTML page
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (4 arguments = Express knows it's for errors).
// Send short, safe messages; never send stack traces to the browser.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Request too large" });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Prompt Heist server running on http://localhost:${PORT}`);
});
