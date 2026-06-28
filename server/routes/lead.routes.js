const express = require("express");

const router = express.Router();

const {
  createLead,
  getLeads,
  getLeadById,
  resendEmail,
  getDashboard,
} = require("../controllers/lead.controller");

router.get("/", getLeads);
router.get("/dashboard", getDashboard);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.post("/:id/resend-email", resendEmail);

module.exports = router;