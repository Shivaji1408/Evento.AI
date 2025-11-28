// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['Venue', 'Decor', 'Caterer', 'Photographer'],
    required: true
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  userName: { type: String, required: true },
  stars: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to avoid duplicate exact review (optional)
// ratingSchema.index({ kind: 1, refId: 1, userName: 1 }, { unique: false });

module.exports = mongoose.model('Rating', ratingSchema);
