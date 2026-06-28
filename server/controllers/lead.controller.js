const Lead = require("../models/Lead");
const { v4: uuidv4 } = require("uuid");
const { sendLeadEmail, resendLeadEmail } = require("../services/email.service");

const createLead = async (req, res) => {
  try {
    const { name, email, phone, company = "", requirement } = req.body;

    if (!name || !email || !phone || !requirement) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and requirement are required.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    const trackingId = uuidv4();
    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      requirement,
      trackingId,
    });

    try {
      await sendLeadEmail(lead);
      await Lead.findByIdAndUpdate(lead._id, { emailSent: true });
      console.log(`✅ Lead created: ${lead._id} with email sent`);
    } catch (emailError) {
      console.error("❌ Email send failed:", emailError.message);
      // Don't fail the request if email fails, lead is still created
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: leads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({ success: true, data: lead });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const resendEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    try {
      await resendLeadEmail(lead);
      await Lead.findByIdAndUpdate(id, { emailSent: true });
      return res.status(200).json({
        success: true,
        message: "Email resent successfully",
        data: lead,
      });
    } catch (emailError) {
      console.error("❌ Email resend failed:", emailError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to send email: " + emailError.message,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const emailsSent = await Lead.countDocuments({ emailSent: true });
    const opened = await Lead.countDocuments({ opened: true });
    const clicked = await Lead.countDocuments({ clicked: true });
    const openRate = emailsSent ? Math.round((opened / emailsSent) * 100) : 0;
    const clickRate = emailsSent ? Math.round((clicked / emailsSent) * 100) : 0;
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(20);

    // Calculate email failure rate
    const emailFailed = totalLeads - emailsSent;

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        emailsSent,
        emailFailed,
        opened,
        clicked,
        openRate,
        clickRate,
        recentLeads,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  resendEmail,
  getDashboard,
};