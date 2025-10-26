const express = require('express');
const Decor = require('../models/Decors'); // ✅ Correct model import

const router = express.Router();

// ==================== SHOW ALL DECORS ====================
router.get('/decors', async (req, res) => {
  try {
    const decors = await Decor.find({});
    res.render('decors/index', { decors }); // ✅ Correct folder name
  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});

// ==================== NEW DECOR FORM ====================
router.get('/decors/new', (req, res) => {
  res.render('decors/new'); // ✅ Correct path
});

// ==================== SHOW SINGLE DECOR ====================
router.get('/decors/:id', async (req, res) => {
  try {
    const decor = await Decor.findById(req.params.id);

    if (!decor) {
      return res.status(404).render('error', { err: 'Decor service not found' });
    }

    res.render('decors/show', { decor }); // ✅ Must match folder name
  } catch (e) {
    console.error('Error fetching decor:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
