const express = require('express');
const router = express.Router();
const Photographer = require('../models/Photographer');

// Show all photographers
router.get('/photographers', async (req, res) => {
  try {
    const photographers = await Photographer.find({});
    res.render('photographer/index', { photographers });
  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});

// New photographer form
router.get('/photographers/new', (req, res) => {
  res.render('photographer/new');
});

// Show single photographer
router.get('/photographers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await Photographer.findById(id);

    if (!photographer) {
      return res.status(404).render('error', { err: 'Photographer not found' });
    }

    res.render('photographer/show', { photographer });
  } catch (e) {
    console.error('Error fetching photographer:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
