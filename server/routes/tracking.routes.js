const express = require("express");
const router = express.Router();

const {
  trackOpen,
  trackClick,
  getTrackingStats,
} = require("../controllers/tracking.controller");

router.get("/open/:id", trackOpen);
router.get("/click/:id", trackClick);
router.get("/stats/:id", getTrackingStats);

module.exports = router;
