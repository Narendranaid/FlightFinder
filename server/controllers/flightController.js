const Flight = require("../models/Flight");
const Booking = require("../models/Booking");

// Add Flight (Admin)
exports.addFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.json(flight);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Get All Flights
exports.getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// Search Flights
exports.searchFlights = async (req, res) => {
  try {
    const { from, to } = req.query;

    const flights = await Flight.find({
      departureCity: from,
      destinationCity: to
    });

    res.json(flights);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json("Flight not found");
    }

    // Delete related bookings first
    await Booking.deleteMany({ flight: req.params.id });

    await flight.deleteOne();

    res.json("Flight and related bookings deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
