const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    serviceType: {
        type: String,
        trim: true              // e.g. "Photography", "Videography", "Both"
    },
    contactNumber: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    specialties: [{
        type: String,
        trim: true              // e.g. "Wedding", "Corporate", "Candid"
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

const Photographer = mongoose.model('Photographer', photographerSchema);
module.exports = Photographer;
