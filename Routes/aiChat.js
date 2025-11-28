// routes/aiChat.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const rateLimit = require("express-rate-limit");

// --- OpenAI client
const client = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
});

// --- rate limiter: 20 requests per minute per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, reply: "Too many requests — try again in a minute." }
});

// helper to clamp history size
function pushHistory(session, role, content) {
  if (!session.aiHistory) session.aiHistory = [];
  session.aiHistory.push({ role, content, ts: Date.now() });
  // keep last 10 messages (user+assistant pairs)
  if (session.aiHistory.length > 20) session.aiHistory.splice(0, session.aiHistory.length - 20);
}

// --- Render chatbot frontend
router.get("/ai/chatbot", (req, res) => {
  // ensure session exists; cookie-session or express-session required in app.js
  if (!req.session) req.session = {};
  res.render("ai/chatbot", { title: "Evento.AI Chat Assistant" });
});

// --- Chat endpoint
router.post("/ai/chatbot", aiLimiter, async (req, res) => {
  try {
    const userMessage = (req.body?.userMessage || "").trim();
    const language = (req.body?.language || "English").trim();

    if (!userMessage) {
      return res.status(400).json({ success: false, reply: "Please enter a message." });
    }

    // initialize session history
    if (!req.session) req.session = {};
    // include a short system instruction once (if not present)
    if (!req.session.systemInstructionSent) {
      // push system instruction to history
      pushHistory(req.session, "system", "You are Evento.AI — a helpful assistant for event planning. Answer briefly and clearly.");
      req.session.systemInstructionSent = true;
    }

    // add user's message to history
    pushHistory(req.session, "user", userMessage);

    // build messages for OpenAI from session history (trim to last 12 items)
    const messages = (req.session.aiHistory || []).map(m => ({ role: m.role, content: m.content }));

    // Add explicit instruction about language
    messages.push({
      role: "user",
      content: `Respond in ${language}. Keep answers short and actionable.`
    });

    // call openai
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.2
    });

    const aiReply = response?.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";

    // add assistant reply to session history
    pushHistory(req.session, "assistant", aiReply);

    return res.json({ success: true, reply: aiReply });
  } catch (err) {
    console.error("AI Chat error:", err);
    return res.status(500).json({ success: false, reply: "AI Error. Please try again later." });
  }
});

module.exports = router;
