// routes/caterers.js
const express = require('express');
const Cater = require('../models/Caters');
const Rating = require('../models/Rating'); 

const router = express.Router();

/* ============================================================
   SHOW ALL CATERERS
   ============================================================ */
router.get('/caterers', async (req, res) => {
  try {
    const { city } = req.query;

    let query = {};
    if (city && city.trim() !== "") {
      query.city = city.trim();
    }

    const caters = await Cater.find(query).lean();

    res.render('caters/index', {
      caters,
      filters: { city: city || "" }
    });

  } catch (e) {
    console.error('Caterer fetch error:', e.message);
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   NEW CATERER FORM
   ============================================================ */
router.get('/caterers/new', (req, res) => {
  res.render('caters/new');
});

/* ============================================================
   SHOW SINGLE CATERER (with ratings)
   ============================================================ */
router.get('/caterers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const cater = await Cater.findById(id).lean();
    if (!cater) {
      return res.status(404).render('error', { err: 'Caterer not found' });
    }

    // ⭐ Fetch ratings for this Caterer
    const ratings = await Rating.find({ kind: 'Caterer', refId: id })
      .sort({ createdAt: -1 })
      .lean();

    // ⭐ Calculate average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((s, r) => s + (r.stars || 0), 0);
      avgRating = +(sum / ratings.length).toFixed(1);
    }

    res.render('caters/show', {
      cater,
      ratings,
      avgRating,
      totalReviews: ratings.length
    });

  } catch (e) {
    console.error('Caterer details error:', e);
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   SUBMIT RATING
   ============================================================ */
router.post('/caterers/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, stars, comment } = req.body;

    if (!userName || !stars) {
      return res.redirect(`/caterers/${id}#reviews`);
    }

    const cater = await Cater.findById(id).lean();
    if (!cater) {
      return res.status(404).render('error', { err: 'Caterer not found' });
    }

    // ⭐ FIXED — save as Caterer (valid enum)
    await Rating.create({
      kind: 'Caterer',
      refId: id,
      userName,
      stars: Number(stars),
      comment: comment || ""
    });

    res.redirect(`/caterers/${id}#reviews`);

  } catch (e) {
    console.error('Caterer rating error:', e);
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   DELETE RATING
   ============================================================ */
router.delete('/caterers/:caterId/rate/:ratingId', async (req, res) => {
  try {
    const { caterId, ratingId } = req.params;

    await Rating.findByIdAndDelete(ratingId);

    res.redirect(`/caterers/${caterId}#reviews`);

  } catch (e) {
    console.error('Delete rating error:', e);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
