const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  title: { type: String, required: true },   // Venue, Caterer, etc
  cost: { type: Number, required: true },
  category: { type: String },                // venue, catering, decor...
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Budget", budgetSchema);
