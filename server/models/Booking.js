const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight"
  },
  seatNumber: String,
  status: {
    type: String,
    default: "Booked"
  }
}, { timestamps: true });

bookingSchema.index(
  { flight: 1, seatNumber: 1 },
  { unique: true }
);


module.exports = mongoose.model("Booking", bookingSchema);
