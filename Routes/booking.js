const express = require("express");
const router = express.Router();
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");

// Payment Page (Booking page)
router.get("/venues/:id/book", async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (!venue) {
      return res.status(404).render("error", { err: "Venue not found" });
    }

    res.render("booking/payment", { venue });
  } catch (error) {
    res.status(500).render("error", { err: error.message });
  }
});
