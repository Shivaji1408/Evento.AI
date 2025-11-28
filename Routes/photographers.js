// routes/photographers.js
const express = require('express');
const router = express.Router();
const Photographer = require('../models/Photographer');
const Rating = require('../models/Rating'); // ⭐ UNIVERSAL RATING MODEL

/* ============================================================
   SHOW ALL PHOTOGRAPHERS (supports ?city= filter)
   ============================================================ */
router.get('/photographers', async (req, res) => {
  try {
    const { city } = req.query;
    let filter = {};

    if (city && city.trim() !== "") {
      filter.city = city.trim();
    }

    const photographers = await Photographer.find(filter).lean();

    res.render('photographer/index', { photographers, city });
  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   NEW PHOTOGRAPHER FORM
   ============================================================ */
router.get('/photographers/new', (req, res) => {
  res.render('photographer/new');
});

/* ============================================================
   SHOW SINGLE PHOTOGRAPHER (⭐ WITH RATING)
   ============================================================ */
router.get('/photographers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await Photographer.findById(id).lean();

    if (!photographer) {
      return res.status(404).render('error', { err: 'Photographer not found' });
    }

    // ⭐ Fetch ratings for this photographer
    const ratings = await Rating.find({ kind: 'Photographer', refId: id })
      .sort({ createdAt: -1 })
      .lean();

    // ⭐ Calculate average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((s, r) => s + (r.stars || 0), 0);
      avgRating = +(sum / ratings.length).toFixed(1);
    }

    res.render('photographer/show', {
      photographer,
      ratings,
      avgRating,
      totalReviews: ratings.length
    });

  } catch (e) {
    console.error('Error fetching photographer:', e);
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   SUBMIT RATING
   ============================================================ */
router.post('/photographers/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, stars, comment } = req.body;

    if (!userName || !stars) {
      return res.redirect(`/photographers/${id}#reviews`);
    }

    const photographer = await Photographer.findById(id).lean();
    if (!photographer) {
      return res.status(404).render('error', { err: 'Photographer not found' });
    }

    await Rating.create({
      kind: 'Photographer',
      refId: id,
      userName,
      stars: Number(stars),
      comment: comment || ""
    });

    res.redirect(`/photographers/${id}#reviews`);

  } catch (e) {
    console.error('Photographer rating error:', e);
    res.status(500).render('error', { err: e.message });
  }
});

/* ============================================================
   DELETE RATING
   ============================================================ */
router.delete('/photographers/:photographerId/rate/:ratingId', async (req, res) => {
  try {
    const { photographerId, ratingId } = req.params;

    await Rating.findByIdAndDelete(ratingId);

    res.redirect(`/photographers/${photographerId}#reviews`);

  } catch (e) {
    console.error('Delete rating error:', e);
    res.status(500).render('error', { err: e.message });
  }
});

module.exports = router;
