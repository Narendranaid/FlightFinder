const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

exports.bookFlight = async (req, res) => {
  try {
    const { flightId, seatNumber } = req.body;

    //  Validate flightId
    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      return res.status(400).json("Invalid flight ID");
    }

    // Validate seat format (Rows A-J, Seats 1-6)
    const validSeatPattern = /^[A-J][1-6]$/;
    if (!validSeatPattern.test(seatNumber)) {
      return res.status(400).json("Invalid seat number");
    }

    // Check flight exists
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json("Flight not found");
    }

    // Prevent duplicate seat booking
    const existingSeat = await Booking.findOne({
      flight: flightId,
      seatNumber
    });

    if (existingSeat) {
      return res.status(400).json("Seat already booked");
    }

    // Atomic seat decrement (race-condition safe)
    const updatedFlight = await Flight.findOneAndUpdate(
      { _id: flightId, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!updatedFlight) {
      return res.status(400).json("No seats available");
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      flight: flightId,
      seatNumber
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("flight");

    res.json(bookings);

  } catch (error) {
    res.status(500).json(error.message);
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid booking ID");
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json("Booking not found");
    }

    // 🔐 Ownership check
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json("Unauthorized action");
    }

    const flight = await Flight.findById(booking.flight);

    // Restore seat count only if flight exists
    if (flight) {
      await Flight.findByIdAndUpdate(
        flight._id,
        { $inc: { availableSeats: 1 } }
      );
    }

    await booking.deleteOne();

    res.json("Booking cancelled successfully");

  } catch (error) {
    res.status(500).json(error.message);
  }
};


exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("flight");

    res.json(bookings);

  } catch (error) {
    res.status(500).json(error.message);
  }
};


exports.getBookedSeats = async (req, res) => {
  try {
    const { flightId } = req.params;

    // Validate flight ID
    if (!mongoose.Types.ObjectId.isValid(flightId)) {
      return res.status(400).json("Invalid flight ID");
    }

    const bookings = await Booking.find({
      flight: flightId
    });

    const bookedSeats = bookings.map(
      (booking) => booking.seatNumber
    );

    res.json(bookedSeats);

  } catch (error) {
    res.status(500).json(error.message);
  }
};
