const express = require('express');
const Guest = require('../models/Guests');

const router = express.Router();

// ✅ Route for guest list
router.get('/', async (req, res) => {
  try {
    const guests = await Guest.find({});
    res.render('guests/index', { guests });
  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});

// ✅ Render invitation form
router.get('/invite', async (req, res) => {
  const guests = await Guest.find();
  res.render('guests/invite', { guests });
});

// ✅ Handle sending invites
router.post('/invite/send', async (req, res) => {
  try {
    const { message } = req.body;
    const guests = await Guest.find();

    for (const g of guests) {
      console.log(`Would send invite to: ${g.phoneNumber}`);
      // Later we’ll plug in Twilio or WhatsApp API
    }

    res.render('guests/success', { message, count: guests.length });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { err: err.message });
  }
});

module.exports = router;
