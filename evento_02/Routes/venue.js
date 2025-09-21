const express = require('express');
const Venue = require('../models/Venue');

const router = express.Router();

// ==================== SHOW ALL VENUES ====================
router.get('/venues', async (req, res) => {
  try {
    const venues = await Venue.find({});
    res.render('venue/index', { venues });
  } catch (e) {
    console.error('Error fetching venues:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

// ==================== NEW VENUE FORM ====================
router.get('/venues/new', (req, res) => {
  res.render('venue/new');
});

// ==================== SHOW SINGLE VENUE ====================
router.get('/venues/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).render('error', { err: 'Venue not found' });
    }

    // Render show.ejs and pass "venue" directly
    res.render('venue/show', { venue });
  } catch (e) {
    console.error('Error fetching venue:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
