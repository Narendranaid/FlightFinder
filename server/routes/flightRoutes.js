const express = require("express");
const router = express.Router();
const {
  addFlight,
  getFlights,
  searchFlights,
  deleteFlight
} = require("../controllers/flightController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Public
router.get("/", getFlights);
router.get("/search", searchFlights);

// Admin Only
router.post("/add", authMiddleware, adminMiddleware, addFlight);
router.delete("/:id",authMiddleware,adminMiddleware,deleteFlight);

module.exports = router;
