const Lead = require("../models/Lead");

const onePixelGif = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

const trackOpen = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findOne({ trackingId: id });

    if (!lead) {
      console.warn(`⚠️  Track open: Lead not found with trackingId: ${id}`);
      res.set({
        "Content-Type": "image/gif",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      });
      return res.send(onePixelGif);
    }

    if (!lead.opened) {
      lead.opened = true;
      lead.openedAt = new Date();
      await lead.save();
      console.log(`📧 Email opened by ${lead.email} at ${lead.openedAt}`);
    }

    res.set({
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    return res.send(onePixelGif);
  } catch (err) {
    console.error("❌ Error tracking open:", err);
    res.set({ "Content-Type": "image/gif" });
    return res.send(onePixelGif);
  }
};

const trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const redirectTo = req.query.redirect || process.env.CLIENT_URL || "https://google.com";
    const lead = await Lead.findOne({ trackingId: id });

    if (!lead) {
      console.warn(`⚠️  Track click: Lead not found with trackingId: ${id}`);
      return res.redirect(redirectTo);
    }

    if (!lead.clicked) {
      lead.clicked = true;
      lead.clickedAt = new Date();
      await lead.save();
      console.log(`🔗 Email link clicked by ${lead.email} at ${lead.clickedAt}`);
    }

    return res.redirect(redirectTo);
  } catch (err) {
    console.error("❌ Error tracking click:", err);
    const redirectTo = req.query.redirect || process.env.CLIENT_URL || "https://google.com";
    return res.redirect(redirectTo);
  }
};

const getTrackingStats = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        trackingId: lead.trackingId,
        email: lead.email,
        name: lead.name,
        emailSent: lead.emailSent,
        opened: lead.opened,
        openedAt: lead.openedAt,
        clicked: lead.clicked,
        clickedAt: lead.clickedAt,
        createdAt: lead.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  trackOpen,
  trackClick,
  getTrackingStats,
};
