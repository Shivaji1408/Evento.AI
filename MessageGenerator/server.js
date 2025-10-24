import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ✅ OpenAI Client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ API Route
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is missing." });
    }

    console.log("🟢 Received prompt:", prompt);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // ✅ works for all accounts
      messages: [
        { role: "system", content: "You are a helpful assistant that generates creative messages." },
        { role: "user", content: prompt },
      ],
    });

    const aiMessage = completion.choices[0].message.content;
    console.log("✅ AI Message:", aiMessage);

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("❌ Backend Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.message || "Failed to generate message." });
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
