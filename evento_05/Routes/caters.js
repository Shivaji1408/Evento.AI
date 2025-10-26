const express = require('express');
const Cater = require('../models/Caters');

const router = express.Router();

// SHOW ALL CATERERS
router.get('/caterers', async (req, res) => {
  try {
    let caters = await Cater.find({});
    res.render('caters/index', { caters });
  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});

// SHOW NEW CATERER FORM
router.get('/caterers/new', (req, res) => {
  res.render('caters/new');
});

// SHOW SINGLE CATERER PAGE
router.get('/caterers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const cater = await Cater.findById(id);

    if (!cater) {
      return res.status(404).render('error', { err: 'Caterer not found' });
    }

    res.render('caters/show', { cater });
  } catch (e) {
    console.error('Error fetching caterer:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
