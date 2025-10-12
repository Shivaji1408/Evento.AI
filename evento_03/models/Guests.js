const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {                 
        type: String,
        trim: true
    },
    circle: {               // New pleasant field with toggle options
        type: String,
        trim: true,
        enum: ['Family Circle', 'Friends Circle', 'Work Circle', 'Other Circle'],
        default: 'Other Circle'
    },
    profilePic: {              
        type: String,
        trim: true,
        default: 'https://via.placeholder.com/150?text=Guest+Photo'
    },
    rsvp: {          
        type: String,
        enum: ['Pending', 'Accepted', 'Declined'],
        default: 'Pending'
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

const Guest = mongoose.model('Guest', guestSchema);
module.exports = Guest;
