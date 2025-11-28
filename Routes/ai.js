// Routes/ai.js
const express = require('express');
const OpenAI = require('openai');
require('dotenv').config();

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configurable model (set in .env). Defaults to gpt-3.5-turbo (cheap & reliable).
const MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// GET -> show form (render with no output initially)
router.get('/ai/invitation', (req, res) => {
  res.render('ai/invitation', { output: null, language: 'English' });
});

// POST -> generate invitation
router.post('/ai/invitation', async (req, res) => {
  try {
    const {
      eventName = '',
      dateTime = '',
      venue = '',
      host = '',
      note = '',
      tone = 'Formal',
      language = 'English',
    } = req.body;

    // Basic validation
    if (!eventName || !dateTime) {
      return res.render('ai/invitation', {
        output: 'Please provide at least Event Name and Date/Time.',
        language
      });
    }

    // Optional: sample local uploaded image path you provided earlier (example)
    // You can include this in prompts if you want the invite to reference an image/link.
    const sampleImagePath = '/mnt/data/bcd48720-1e76-4692-8aa2-116aa3dcb7b9.png';

    // Build user prompt using the helper below
    const userPrompt = buildInvitationPrompt({
      language,
      tone,
      eventName,
      dateTime,
      venue,
      host,
      note,
      imagePath: sampleImagePath // optional, remove if not needed
    });

    // Make request to OpenAI
    // Use chat/completions style for gpt-3.5-turbo or system/user messages for newer SDKs
    const resp = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a professional copywriter who writes formal and perfect invitation messages for events.' },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 450
    });

    // Extract text (SDK returns differently by versions; this aligns to many SDKs)
    let invitationText = '';
    if (resp && resp.choices && resp.choices[0] && resp.choices[0].message) {
      invitationText = resp.choices[0].message.content.trim();
    } else if (resp.output) {
      // fallback for some client shapes
      invitationText = (Array.isArray(resp.output) ? resp.output.map(o=>o.content).join("\n") : resp.output).trim();
    } else {
      invitationText = 'AI returned no text. Please try again later.';
    }

    // Render page with result
    res.render('ai/invitation', { output: invitationText, language });

  } catch (err) {
    console.error('AI Error:', err);

    // Friendly messages for common cases
    let message = 'AI service is temporarily unavailable. Please try again later.';
    if (err?.code === 'insufficient_quota' || err?.error?.type === 'insufficient_quota') {
      message = 'AI is unavailable: your OpenAI project has insufficient quota or billing is not enabled. Please check your OpenAI billing and key.';
    } else if (err?.status === 429) {
      message = 'AI rate limit reached. Please wait a moment and try again.';
    }

    // Provide a simple fallback "locally generated" invitation so user gets immediate usable output
    const fallback = localFallbackInvitation({
      eventName: req.body.eventName,
      dateTime: req.body.dateTime,
      venue: req.body.venue,
      host: req.body.host,
      note: req.body.note,
      tone: req.body.tone,
      language: req.body.language
    });

    res.render('ai/invitation', {
      output: `${message}\n\nFallback invitation (local):\n\n${fallback}`,
      language: req.body.language || 'English'
    });
  }
});

module.exports = router;

/* -------------------------
   Helper: buildInvitationPrompt
   Produces a robust prompt that forces a structured invitation output.
   ------------------------- */
function buildInvitationPrompt({ language, tone, eventName, dateTime, venue, host, note, imagePath }) {
  // Normalize tone mapping (simple)
  const toneMap = {
    Formal: 'formal and polite',
    Friendly: 'warm and friendly',
    Festive: 'celebratory and festive'
  };
  const toneText = toneMap[tone] || toneMap.Formal;

  if (language === 'Hindi') {
    // Hindi prompt
    return `
आप एक पेशेवर इवेंट कॉपीराइटर हैं। नीचे दी गई जानकारी के आधार पर एक सुंदर, पारंपरिक और औपचारिक (या चुने हुए tone के अनुसार) निमंत्रण संदेश तैयार करें।
निमंत्रण को निम्न स्वरूप में प्रस्तुत करें — शीर्षक/हेडर, प्रमुख संदेश (संक्षेप में), विवरण (दिनांक/समय/स्थान), मेज़बान/आयोजक का नाम, RSVP/संपर्क जानकारी (यदि उपलब्ध), और विनम्र समापन।
भाषा: हिंदी
टोन: ${toneText}

इवेंट का नाम: ${eventName}
दिनांक/समय: ${dateTime}
स्थान: ${venue || 'जानकारी नहीं दी गई'}
आयोजक: ${host || 'जानकारी नहीं दी गई'}
नोट/विशेष निर्देश: ${note || 'कोई नहीं'}

कीमत में कृपया प्रोफ़ेशनल फ़ॉर्मेट रखें और लाइन ब्रेक का उपयोग करें। सीमित शब्दों में 3-5 पैरा बनाएं। यदि कोई इमेज संदर्भ उपलब्ध है, तो उसका जिक्र संक्षेप में करें: ${imagePath ? `Image reference: ${imagePath}` : 'No image.'}
`;
  } else {
    // English prompt
    return `
You are a professional event copywriter. Based on the information below, generate a polished, properly formatted invitation message suitable for printing or sending by email/WhatsApp. Include:
- A short headline/title
- A warm opening line
- Event details (date & time, venue)
- Host / organizer line
- RSVP/contact line (if note includes RSVP info)
- A polite closing signature

Language: English
Tone: ${toneText}

Event Name: ${eventName}
Date & Time: ${dateTime}
Venue: ${venue || 'Not provided'}
Host / Organizer: ${host || 'Not provided'}
Extra note / RSVP details: ${note || 'None'}

Produce a clean invitation (use line breaks), 3–5 short paragraphs. If an image/link is relevant mention it briefly: ${imagePath ? `Image reference: ${imagePath}` : 'No image.'}
`;
  }
}

/* -------------------------
   Helper: localFallbackInvitation
   Simple server-side generator that builds a decent invitation if AI fails.
   ------------------------- */
function localFallbackInvitation({ eventName, dateTime, venue, host, note, tone, language }) {
  if (language === 'Hindi') {
    // a compact Hindi fallback
    return `${eventName}\n\nसादर निमंत्रण है।\nकृपया हमारे साथ इस विशेष अवसर पर शामिल हों।\n\nतारीख/समय: ${dateTime}\nस्थान: ${venue || '—'}\nआयोजक: ${host || '—'}\n\n${note ? 'नोट: ' + note + '\n\n' : ''}कृपया अपनी उपस्थिति की पुष्टि करें।\n\nआपका विनीत,\n${host || 'आयोजक'}`;
  } else {
    // English fallback
    return `${eventName}\n\nYou are cordially invited to join us on this special occasion.\n\nDate & Time: ${dateTime}\nVenue: ${venue || '—'}\nHosted by: ${host || '—'}\n\n${note ? 'Note: ' + note + '\n\n' : ''}Please RSVP to confirm your presence.\n\nWarm regards,\n${host || 'Organizer'}`;
  }
}
