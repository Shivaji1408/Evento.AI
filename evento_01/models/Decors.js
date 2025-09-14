const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    style: {
        type: String,
        trim: true              // e.g. "Traditional", "Modern", "Theme-based"
    },
    contactNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    priceRange: {
        min: { type: Number },
        max: { type: Number }
    },
    servicesOffered: [{
        type: String,
        trim: true              // e.g. "Stage Decoration", "Lighting", "Flower Arrangement"
    }],
    city: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Decor = mongoose.model('Decor', decorSchema);
module.exports = Decor;
