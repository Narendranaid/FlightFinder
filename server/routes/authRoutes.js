const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  register,
  login,
  getAllUsers
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// ADMIN ONLY
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

module.exports = router;
