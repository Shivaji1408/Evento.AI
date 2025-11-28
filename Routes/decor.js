// routes/decor.js
const express = require('express');
const Decor = require('../models/Decors');
const Rating = require('../models/Rating');

const router = express.Router();

/* ============================================================
   SHOW ALL DECORS (City filter)
   ============================================================ */
router.get('/decors', async (req, res) => {
  try {
    const { city } = req.query;

    const query = {};
    if (city && city.trim() !== "") {
      query.city = city.trim();
    }

    const decors = await Decor.find(query).lean();

    res.render("decors/index", {
      decors,
      filters: { city: city || "" }
    });

  } catch (e) {
    console.error("Error loading decors:", e);
    res.status(500).render("error", { err: e.message });
  }
});

/* ============================================================
   NEW DECOR FORM
   ============================================================ */
router.get('/decors/new', (req, res) => {
  res.render("decors/new");
});

/* ============================================================
   SHOW SINGLE DECOR PAGE (with rating system)
   ============================================================ */
router.get('/decors/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const decor = await Decor.findById(id).lean();
    if (!decor) {
      return res.status(404).render("error", { err: "Decor service not found" });
    }

    // Fetch ratings for this decor
    const ratings = await Rating.find({ kind: "Decor", refId: id })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((total, r) => total + r.stars, 0);
      avgRating = +(sum / ratings.length).toFixed(1);
    }

    res.render("decors/show", {
      decor,
      ratings,
      avgRating,
      totalReviews: ratings.length
    });

  } catch (e) {
    console.error("Error loading decor:", e);
    res.status(500).render("error", { err: e.message });
  }
});

/* ============================================================
   SUBMIT RATING (POST)
   ============================================================ */
router.post('/decors/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, stars, comment } = req.body;

    if (!userName || !stars) {
      return res.redirect(`/decors/${id}#reviews`);
    }

    const decor = await Decor.findById(id).lean();
    if (!decor) {
      return res.status(404).render("error", { err: "Decor service not found" });
    }

    await Rating.create({
      kind: "Decor",
      refId: id,
      userName,
      stars: Number(stars),
      comment: comment || ""
    });

    res.redirect(`/decors/${id}#reviews`);

  } catch (e) {
    console.error("Decor rating submit error:", e);
    res.status(500).render("error", { err: e.message });
  }
});

/* ============================================================
   DELETE RATING
   ============================================================ */
router.delete('/decors/:decorId/rate/:ratingId', async (req, res) => {
  try {
    const { decorId, ratingId } = req.params;

    await Rating.findByIdAndDelete(ratingId);

    res.redirect(`/decors/${decorId}#reviews`);

  } catch (e) {
    console.error("Decor rating delete error:", e);
    res.status(500).render("error", { err: e.message });
  }
});

module.exports = router;
