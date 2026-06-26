const Lead = require("../models/Lead");
const { v4: uuidv4 } = require("uuid");
const sendLeadEmail = require("../services/email.service");

const createLead = async (req, res) => {
  try {
    const { name, email, phone, company = "", requirement } = req.body;

    if (!name || !email || !phone || !requirement) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and requirement are required.",
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
    } catch (emailError) {
      console.error("Email send failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
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

const getDashboard = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const emailsSent = await Lead.countDocuments({ emailSent: true });
    const opened = await Lead.countDocuments({ opened: true });
    const clicked = await Lead.countDocuments({ clicked: true });
    const openRate = emailsSent ? Math.round((opened / emailsSent) * 100) : 0;
    const clickRate = emailsSent ? Math.round((clicked / emailsSent) * 100) : 0;
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        emailsSent,
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
  getDashboard,
};