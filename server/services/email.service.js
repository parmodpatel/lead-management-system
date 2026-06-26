const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLeadEmail = async (lead) => {
  const openPixelUrl = `${process.env.BACKEND_URL}/track/open/${encodeURIComponent(
    lead.trackingId
  )}`;
  const clickUrl = `${process.env.BACKEND_URL}/track/click/${encodeURIComponent(
    lead.trackingId
  )}?redirect=${encodeURIComponent(
    process.env.CLIENT_URL || "https://google.com"
  )}`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="color: #0f172a;">Hello ${lead.name},</h2>
      <p>Thank you for contacting us. We received your request and will follow up shortly.</p>
      <p><strong>Requirement:</strong> ${lead.requirement}</p>
      <p>
        <a href="${clickUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;">
          View Our Services
        </a>
      </p>
      <img src="${openPixelUrl}" alt="" width="1" height="1" style="display:none" />
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: lead.email,
    subject: "Thank you for reaching out",
    html,
  });
};

module.exports = sendLeadEmail;