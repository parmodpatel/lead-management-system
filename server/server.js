const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const leadRoutes = require("./routes/lead.routes");
const trackingRoutes = require("./routes/tracking.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/track", trackingRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});