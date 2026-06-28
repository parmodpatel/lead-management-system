const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendLeadEmail = async (lead) => {
  try {
    const openPixelUrl = `${process.env.BACKEND_URL}/track/open/${encodeURIComponent(
      lead.trackingId
    )}`;
    const clickUrl = `${process.env.BACKEND_URL}/track/click/${encodeURIComponent(
      lead.trackingId
    )}?redirect=${encodeURIComponent(
      process.env.CLIENT_URL || "https://google.com"
    )}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2 style="margin: 0;">Thank You for Contacting Us!</h2>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p>Hi <strong>${lead.name}</strong>,</p>
          <p>Thank you for reaching out to us. We’ve received your request and will review it shortly.</p>

          <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p style="margin: 0;"><strong>Your Requirement:</strong></p>
            <p style="margin: 5px 0 0 0; color: #555;">${lead.requirement}</p>
          </div>

          <p>
            <a href="${clickUrl}" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
              Learn More About Our Services
            </a>
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            We look forward to working with you!<br>
            Best regards,<br>
            The Lead Management Team
          </p>

          <img src="${openPixelUrl}" alt="" width="1" height="1" style="display:none" />
        </div>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: lead.email,
      subject: "We’ve Received Your Request",
      html,
    });

    console.log(`✅ Email sent to ${lead.email} (Tracking ID: ${lead.trackingId})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${lead.email}:`, error.message);
    throw error;
  }
};

const resendLeadEmail = async (lead) => {
  return sendLeadEmail(lead);
};

module.exports = {
  sendLeadEmail,
  resendLeadEmail,
};