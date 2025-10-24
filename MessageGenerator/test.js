import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say Hello!" }],
    });
    console.log("✅ It works:", response.choices[0].message.content);
  } catch (err) {
    console.error("❌ Test failed:", err.response ? err.response.data : err.message);
  }
}

test();
