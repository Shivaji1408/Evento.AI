const express = require("express");
const router = express.Router();

const Budget = require("../models/Budget");
const Venue = require("../models/Venue");
const Decor = require("../models/Decors");
const Cater = require("../models/Caters");
const Photographer = require("../models/Photographer");

// ✅ BOOK VENUE → ADD TO BUDGET
router.post("/venues/:id/book", async (req, res) => {
  const data = await Venue.findById(req.params.id);
  await Budget.create({ title: data.name, category: "Venue", cost: data.pricePerDay || 0 });
  res.redirect(`/venues/${req.params.id}`);
});

// ✅ BOOK DECOR → ADD TO BUDGET
router.post("/decors/:id/book", async (req, res) => {
  const data = await Decor.findById(req.params.id);
  const decorCost = data.priceRange?.max || data.priceRange?.min || 0;
  await Budget.create({ title: data.name, category: "Decor", cost: decorCost });
  res.redirect(`/decors/${req.params.id}`);
});

// ✅ BOOK CATERER → ADD TO BUDGET
router.post("/caterers/:id/book", async (req, res) => {
  const data = await Cater.findById(req.params.id);
  await Budget.create({ title: data.name, category: "Catering", cost: data.pricePerPlate || 0 });
  res.redirect(`/caterers/${req.params.id}`);
});

// ✅ BOOK PHOTOGRAPHER → ADD TO BUDGET
router.post("/photographers/:id/book", async (req, res) => {
  const data = await Photographer.findById(req.params.id);
  await Budget.create({ title: data.name, category: "Photography", cost: data.pricePerDay || 0 });
  res.redirect(`/photographers/${req.params.id}`);
});

// ✅ SHOW BUDGET DATA
router.get("/budget/data", async (req, res) => {
  const items = await Budget.find({});
  const total = items.reduce((sum, i) => sum + i.cost, 0);
  res.json({ total, items });
});

// DELETE budget item
router.delete("/budget/delete/:id", async (req, res) => {
  await Budget.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
