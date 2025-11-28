const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
});

// ================================
// GET – Scheduler Page
// ================================
router.get("/ai/scheduler", (req, res) => {
  res.render("ai/scheduler", {
    meta: {},
    schedule: null,
    warning: null,
    error: null
  });
});

// ================================
// POST – Generate AI Schedule
// ================================
router.post("/ai/scheduler", async (req, res) => {
  try {
    const {
      eventName,
      eventDate,
      guests,
      startTime,
      endTime,
      userSubEvents,
      language
    } = req.body;

    // Validation
    if (!eventName || !eventDate || !startTime || !endTime) {
      return res.render("ai/scheduler", {
        meta: req.body,
        schedule: null,
        warning: "Please fill all required fields.",
        error: null
      });
    }

    // User-added subevents
    const userEventsList = userSubEvents
      ? userSubEvents.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    // ================================
    // AI PROMPT (MAJOR IMPROVEMENT)
    // ================================
    const prompt = `
You are an expert professional event planner.

TASK:
Generate a detailed timeline schedule for the following event. 
Use culturally appropriate sub-events depending on the event type.

### EVENT DETAILS:
Event Type: ${eventName}
Event Date: ${eventDate}
Guest Count: ${guests}
Time Window: ${startTime} to ${endTime}
Language: ${language}

### USER CUSTOM SUB-EVENTS (IF ANY):
${userEventsList.length ? userEventsList.join(", ") : "None"}

### RULES:
1. Generate sub-events appropriate for the event type  
   (e.g., Wedding, Birthday, Engagement, Corporate Event, Anniversary, Cultural Event, etc.)
2. Include all user-defined sub-events.
3. Duration must be realistic.
4. Output **ONLY VALID JSON**, EXACT example format:

[
  {"title": "Guest Arrival", "duration": 30},
  {"title": "Ceremony", "duration": 60}
]

NO text before or after JSON. NO markdown. NO extra characters.
    `.trim();

    // ================================
    // AI CALL (USING 4o-mini / 4o)
    // ================================
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt
    });

    let text = response.output_text.trim();

    // Remove accidental ```json fences
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

    let scheduleJSON;

    try {
      scheduleJSON = JSON.parse(text);
    } catch (err) {
      console.log("AI RAW OUTPUT:", text);
      return res.render("ai/scheduler", {
        meta: req.body,
        schedule: null,
        warning: null,
        error: "AI returned invalid JSON. Please try again."
      });
    }

    // ================================
    // Add unique IDs for each sub-event
    // ================================
    scheduleJSON = scheduleJSON.map((ev, i) => ({
      id: "ev_" + i + "_" + Date.now(),
      title: ev.title,
      duration: ev.duration
    }));

    res.render("ai/scheduler", {
      meta: req.body,
      schedule: scheduleJSON,
      warning: null,
      error: null
    });

  } catch (error) {
    console.log("Scheduler AI Error:", error);
    return res.render("ai/scheduler", {
      meta: req.body,
      schedule: null,
      warning: null,
      error: "AI Error — please try again later."
    });
  }
});

module.exports = router;
