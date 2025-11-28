// routes/venue.js
const express = require('express');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Budget = require('../models/Budget');
const Rating = require('../models/Rating');

const router = express.Router();


// ==================== SHOW ALL VENUES ====================
router.get('/venues', async (req, res) => {
  try {
    const { city, date } = req.query;

    const query = {};
    if (city) query.city = city;

    // Exclude booked venues
    let bookedVenueIds = [];
    if (date) {
      const bookings = await Booking.find({ kind: 'Venue', eventDate: date }).lean();
      bookedVenueIds = bookings.map(b => String(b.refId));
    }
    if (bookedVenueIds.length > 0) {
      query._id = { $nin: bookedVenueIds };
    }

    const venues = await Venue.find(query).lean();

    res.render('venue/index', {
      venues,
      filters: { city: city || '', date: date || '' }
    });

  } catch (e) {
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
    const venue = await Venue.findById(id).lean();

    if (!venue) return res.status(404).render('error', { err: 'Venue not found' });

    // Fetch all ratings for this venue
    const ratings = await Rating.find({ kind: 'Venue', refId: id })
      .sort({ createdAt: -1 })
      .lean();

    // Average rating
    let avgRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((s, r) => s + r.stars, 0);
      avgRating = +(sum / ratings.length).toFixed(1);
    }

    res.render('venue/show', {
      venue,
      ratings,
      avgRating,
      totalReviews: ratings.length
    });

  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});


// ==================== SUBMIT RATING ====================
router.post('/venues/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, stars, comment } = req.body;

    if (!userName || !stars) {
      return res.redirect(`/venues/${id}#reviews`);
    }

    await Rating.create({
      kind: 'Venue',
      refId: id,
      userName,
      stars: Number(stars),
      comment
    });

    res.redirect(`/venues/${id}#reviews`);

  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});


// ==================== DELETE RATING ====================
router.delete('/venues/:venueId/rate/:ratingId', async (req, res) => {
  try {
    const { venueId, ratingId } = req.params;

    await Rating.findByIdAndDelete(ratingId);

    res.redirect(`/venues/${venueId}#reviews`);

  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});


// ==================== PAYMENT PAGE (GET) ====================
router.get('/venues/:id/pay', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).lean();
    if (!venue) return res.status(404).render('error', { err: 'Venue not found' });

    // 👉 Correct view path
    res.render('booking/payment', {
      service: { kind: 'Venue', item: venue },
      prefillDate: req.query.eventDate || ''
    });

  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});


// ==================== PAYMENT SUBMIT (POST) ====================
router.post('/venues/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerName, eventDate, guests = 0 } = req.body;

    const venue = await Venue.findById(id).lean();
    if (!venue) return res.status(404).render('error', { err: 'Venue not found' });

    // Check if already booked
    const existing = await Booking.findOne({
      kind: 'Venue',
      refId: id,
      eventDate
    });

    if (existing) {
      return res.render('booking/payment', {
        service: { kind: 'Venue', item: venue },
        prefillDate: eventDate,
        error: 'Venue already booked on this date.'
      });
    }

    // Prepare items for booking
    const items = [{
      kind: 'Venue',
      refId: id,
      name: venue.name,
      price: Number(venue.pricePerDay || 0)
    }];

    const totalCost = items.reduce((s, i) => s + i.price, 0);

    // Save booking
    const booking = await Booking.create({
      eventName: `${venue.name} Booking`,
      eventDate,
      city: venue.city,
      guests: Number(guests),
      budget: totalCost,
      items,
      totalCost,
      status: 'booked',
      buyerName
    });

    await Budget.create({
      title: `Venue: ${venue.name}`,
      category: 'Venue',
      cost: totalCost
    });

    res.render('ai/bookingSummary', { booking });

  } catch (e) {
    res.status(500).render('error', { err: e.message });
  }
});


module.exports = router;
