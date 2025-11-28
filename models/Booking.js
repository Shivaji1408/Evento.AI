const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },

  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },

  bookingDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    required: true
  },

  razorpayPaymentId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
