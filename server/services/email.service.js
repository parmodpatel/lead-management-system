const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const isRetryable = (err) => {
  // Network errors or server errors (5xx) or rate limits (429) are retryable
  const status = err && (err.statusCode || (err.error && err.error.statusCode));
  if (!status) return true; // unknown/network error
  if (status >= 500) return true;
  if (status === 429) return true;
  return false;
};

const sendWithRetry = async (payload, options = {}) => {
  const maxRetries = Number(process.env.RESEND_MAX_RETRIES || options.maxRetries || 3);
  const baseDelay = Number(process.env.RESEND_RETRY_BASE_DELAY_MS || 500);

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      const result = await resend.emails.send(payload);

      // Resend SDK may return an object with `error` instead of throwing
      if (result && result.error) {
        const err = new Error(result.error.message || "Resend API error");
        err.name = result.error.name || "ResendError";
        err.statusCode = result.error.statusCode || result.error.status || undefined;
        err.raw = result.error;
        throw err;
      }

      return result;
    } catch (err) {
      // If it's a validation error (unverified domain / from address), don't retry
      const name = err.name || (err.raw && err.raw.name) || null;
      const status = err.statusCode || (err.raw && err.raw.statusCode) || null;

      if (name === "validation_error" || status === 403) {
        // Provide actionable guidance for domain verification
        const guidance = `Resend validation error: ${err.message}.\n` +
          `To send to arbitrary recipients you must verify a sending domain at https://resend.com/domains and set RESEND_FROM_EMAIL to an address on that domain. ` +
          `While testing you can only send to your account email (the one used to sign up).`;

        const ex = new Error(guidance);
        ex.original = err;
        ex.statusCode = status || 403;
        throw ex;
      }

      if (attempt > maxRetries || !isRetryable(err)) {
        // no more retries
        throw err;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`Resend send attempt ${attempt} failed (will retry in ${delay}ms):`, err.message || err);
      await sleep(delay);
      // loop to retry
    }
  }
};

const sendLeadEmail = async (lead) => {
  // DEV_MODE: do not send real emails, just log and return mock response
  if (process.env.DEV_MODE === "true") {
    const openPixelUrl = `${process.env.BACKEND_URL}/track/open/${encodeURIComponent(lead.trackingId)}`;
    const clickUrl = `${process.env.BACKEND_URL}/track/click/${encodeURIComponent(lead.trackingId)}?redirect=${encodeURIComponent(process.env.CLIENT_URL || "https://google.com")}`;

    const text = `Hi ${lead.name},\n\nThank you for reaching out.\n\nWe received your requirement: "${lead.requirement}"\n\nLearn more: ${clickUrl}\n\nRegards,\nTeam`;

    console.log(`[DEV_MODE] Mock email to ${lead.email}`);
    console.log("[DEV_MODE] Text:\n", text);
    console.log("[DEV_MODE] Tracking URLs:", { openPixelUrl, clickUrl });

    return { data: { id: `dev-mock-${lead.trackingId}` }, mock: true };
  }

  try {
    const openPixelUrl = `${process.env.BACKEND_URL}/track/open/${encodeURIComponent(lead.trackingId)}`;
    const clickUrl = `${process.env.BACKEND_URL}/track/click/${encodeURIComponent(lead.trackingId)}?redirect=${encodeURIComponent(process.env.CLIENT_URL || "https://google.com")}`;

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

    const text = `Hi ${lead.name},\n\nThank you for reaching out.\n\nWe received your requirement: "${lead.requirement}"\n\nLearn more: ${clickUrl}\n\nRegards,\nTeam`;

    const payload = {
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: lead.email,
      subject: "We’ve Received Your Request",
      text,
      html,
    };

    const result = await sendWithRetry(payload);

    console.log(`✅ Email sent to ${lead.email} (Tracking ID: ${lead.trackingId})`);
    console.log("Resend response:", result);
    return result;
  } catch (error) {
    console.error(`❌ Failed to send email to ${lead.email}:`, error?.message || error);
    // If the error includes actionable guidance (from sendWithRetry), surface it
    if (error && error.original) {
      console.error("Original error:", error.original);
    }
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

