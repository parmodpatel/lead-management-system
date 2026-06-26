const express = require("express");

const router = express.Router();

const {
  createLead,
  getLeads,
  getDashboard,
} = require("../controllers/lead.controller");

router.get("/", getLeads);
router.get("/dashboard", getDashboard);
router.post("/", createLead);

module.exports = router;