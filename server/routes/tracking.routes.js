const express = require("express");
const router = express.Router();

const {
  trackOpen,
  trackClick,
} = require("../controllers/tracking.controller");

router.get("/open/:id", trackOpen);
router.get("/click/:id", trackClick);

module.exports = router;
