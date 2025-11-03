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
    const { name, type, startDate, endDate, guests } = req.body;

    if (!name || !type || !startDate || !endDate || !guests)
      return res.status(400).json({ error: "Missing required fields" });

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    const daysToStart = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    let urgencyNote;
    if (daysToStart <= 3) {
      urgencyNote = `⚠️ The event starts in just ${daysToStart} days! Focus on last-minute arrangements, vendor confirmations, and logistics setup.`;
    } else if (daysToStart <= 14) {
      urgencyNote = `⏳ Only ${daysToStart} days left until the event begins. Prioritize venue booking, vendor coordination, and rehearsals.`;
    } else if (daysToStart <= 60) {
      urgencyNote = `🗓️ The event is ${daysToStart} days away. Plan in weekly milestones for smooth preparation.`;
    } else {
      urgencyNote = `✅ You have ${daysToStart} days before the event — plan a detailed preparation timeline and allocate resources gradually.`;
    }

    const prompt = `
You are a professional event planner AI.
Generate a **detailed, realistic, multi-day event plan** based on the following details:

- Event Name: ${name}
- Type: ${type}
- Event Duration: ${duration} days
- Start Date: ${startDate}
- End Date: ${endDate}
- Days Remaining Until Start: ${daysToStart}
- Number of Guests: ${guests}

${urgencyNote}

Please include the following sections:
1. 📝 **Event Overview** — a short description of the event.
2. 📅 **Day-by-Day Itinerary** — outline the schedule for each day from ${startDate} to ${endDate}.
3. 🧾 **Preparation Timeline** — steps and milestones before the event begins.
4. 💰 **Estimated Budget Breakdown (INR)** — estimate costs for:
   - Venue
   - Catering/Food
   - Decoration
   - Photography/Videography
   - Entertainment or Activities
   - Miscellaneous
   Include total estimated cost and short tips on cost optimization.
5. ✅ **Checklist** — a list of must-do items before and during the event.
6. 🌟 **Suggestions for Improvement** — creative ideas to enhance the event experience.

Make it easy to read with emojis, headings, and bullet points.
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

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
