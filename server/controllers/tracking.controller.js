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
      return res.status(404).send("Not found");
    }

    if (!lead.opened) {
      lead.opened = true;
      lead.openedAt = new Date();
      await lead.save();
    }

    res.set({
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    return res.send(onePixelGif);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

const trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const redirectTo = req.query.redirect || process.env.CLIENT_URL || "https://google.com";
    const lead = await Lead.findOne({ trackingId: id });

    if (!lead) {
      return res.status(404).send("Not found");
    }

    if (!lead.clicked) {
      lead.clicked = true;
      lead.clickedAt = new Date();
      await lead.save();
    }

    return res.redirect(redirectTo);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  trackOpen,
  trackClick,
};
