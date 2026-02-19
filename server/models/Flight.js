const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  airline: String,
  departureCity: String,
  destinationCity: String,
  departureDate: Date,
  arrivalDate: Date,
  price: Number,
  availableSeats: Number
}, { timestamps: true });

module.exports = mongoose.model("Flight", flightSchema);
