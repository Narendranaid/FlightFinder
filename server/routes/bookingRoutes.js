const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getBookedSeats } = require("../controllers/bookingController");

const {
  bookFlight,
  getUserBookings,
  cancelBooking,
  getAllBookings
} = require("../controllers/bookingController");

router.post("/book", authMiddleware, bookFlight);
router.get("/my", authMiddleware, getUserBookings);
router.delete("/cancel/:id", authMiddleware, cancelBooking);
router.get("/seats/:flightId", getBookedSeats);

// ADMIN ONLY
router.get("/all", authMiddleware, adminMiddleware, getAllBookings);

module.exports = router;
