import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
console.log("API Key loaded:", process.env.OPENAI_API_KEY?.slice(0, 8) + "…");


const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate-plan", async (req, res) => {
  try {
    const { name, date, type, guests } = req.body;

    if (!name || !date || !type || !guests)
      return res.status(400).json({ error: "Missing required fields" });

    const prompt = `
      You are an expert event planner AI.
      Create a detailed, structured plan for:
      - Event Name: ${name}
      - Type: ${type}
      - Date: ${date}
      - Number of Guests: ${guests}

      Include:
      1. Event Overview
      2. Budget Estimation in Rs. (Venue, Food, Decor, Photography, etc.)
      3. Timeline and Schedule for the day
      4. Task Checklist before the event
      Use headings and bullet points for readability.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const plan = completion.choices[0].message.content;
    res.json({ plan });
  } catch (error) {
    console.error("Error generating plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate plan." });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running at http://localhost:5000")
);
