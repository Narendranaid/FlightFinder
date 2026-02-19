const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth",authRoutes);

const flightRoutes = require("./routes/flightRoutes");
app.use("/api/flights", flightRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings",bookingRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));
