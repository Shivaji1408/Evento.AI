const mongoose = require('mongoose');

const caterSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    cuisineType: {
        type: String,
        trim: true              // e.g. "Indian", "Continental", "Multi-cuisine"
    },
    contactNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    pricePerPlate: {
        type: Number,           // average cost per plate
        required: true
    },
    specialties: [{
        type: String,
        trim: true              // e.g. "Veg", "Non-Veg", "Desserts"
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

const Cater = mongoose.model('Cater', caterSchema);
module.exports = Cater;
