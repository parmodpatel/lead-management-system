# Email & Tracking System Documentation

## Overview
The Lead Management System includes a complete email sending and tracking infrastructure that monitors when leads open emails and click on links.

## Features

### 1. **Email Sending**
- Automatically sends personalized HTML emails when a lead is created
- Includes tracking pixels for open detection
- Includes tracked links for click detection
- Beautiful, responsive email template
- Error handling with graceful fallback

### 2. **Open Tracking**
- Detects when an email is opened via an invisible tracking pixel (1x1 GIF)
- Records the timestamp of the first open
- Updates lead data with `opened: true` and `openedAt: timestamp`

### 3. **Click Tracking**
- Tracks when recipients click on links in emails
- Redirects users to the specified destination URL
- Records timestamp of the first click
- Updates lead data with `clicked: true` and `clickedAt: timestamp`

### 4. **Dashboard Analytics**
- Shows total leads count
- Shows emails sent count
- Shows emails failed count
- Shows total opens and click-throughs
- Calculates open rate: `(opened / emailsSent) * 100`
- Calculates click rate: `(clicked / emailsSent) * 100`
- Displays recent 20 leads

## API Endpoints

### Leads Management

#### Create Lead & Send Email
```
POST /api/leads/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "requirement": "Need CRM solution for 50 users"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "requirement": "Need CRM solution for 50 users",
    "trackingId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "emailSent": true,
    "opened": false,
    "clicked": false,
    "createdAt": "2024-06-26T10:30:00Z",
    "updatedAt": "2024-06-26T10:30:00Z"
  }
}
```

#### Get All Leads
```
GET /api/leads/
```

Returns array of all leads sorted by most recent first.

#### Get Lead by ID
```
GET /api/leads/{leadId}
```

Returns specific lead details.

#### Resend Email to Lead
```
POST /api/leads/{leadId}/resend-email
```

Resends the tracking email to a specific lead. Useful if the initial email failed.

#### Get Dashboard Statistics
```
GET /api/dashboard
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalLeads": 50,
    "emailsSent": 48,
    "emailFailed": 2,
    "opened": 32,
    "clicked": 15,
    "openRate": 67,
    "clickRate": 31,
    "recentLeads": [...]
  }
}
```

### Tracking Endpoints

#### Track Email Open
```
GET /track/open/{trackingId}
```

Called automatically via invisible pixel in email. Returns 1x1 transparent GIF.

#### Track Link Click
```
GET /track/click/{trackingId}?redirect={redirectUrl}
```

Called when user clicks tracked link. Records click and redirects to the URL.

#### Get Tracking Statistics
```
GET /track/stats/{leadId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "trackingId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "email": "john@example.com",
    "name": "John Doe",
    "emailSent": true,
    "opened": true,
    "openedAt": "2024-06-26T11:15:00Z",
    "clicked": true,
    "clickedAt": "2024-06-26T11:20:00Z",
    "createdAt": "2024-06-26T10:30:00Z"
  }
}
```

## Setup & Configuration

### Environment Variables (.env)

```
# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Tracking URLs
BACKEND_URL=http://localhost:5001
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=5001
```

### Gmail Setup (for nodemailer)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select Mail and Device
   - Generate password
   - Copy the 16-character password to `.env` as `EMAIL_PASS`

### Required Dependencies

All dependencies are already installed:
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.7.2",
  "nodemailer": "^9.0.1",
  "uuid": "^14.0.1",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2"
}
```

## Data Model

### Lead Schema

```javascript
{
  name: String,                    // Lead's full name
  email: String,                   // Lead's email (unique)
  phone: String,                   // Lead's phone number
  company: String,                 // Company name (optional)
  requirement: String,             // What they need
  trackingId: String,              // UUID for tracking
  emailSent: Boolean,              // Was email sent?
  opened: Boolean,                 // Was email opened?
  opened At: Date,                 // When was it opened?
  clicked: Boolean,                // Did they click?
  clickedAt: Date,                 // When did they click?
  createdAt: Date,                 // Record created
  updatedAt: Date                  // Last updated
}
```

## Email Template Features

- **Gradient Header**: Professional purple gradient with thank you message
- **Content Box**: Lead's requirement highlighted in a styled box
- **Call-to-Action Button**: "Learn More About Our Services" with tracking
- **Footer**: Reply-to information and signature
- **Tracking Pixel**: Invisible 1x1 GIF for open detection
- **Responsive Design**: Looks good on all devices

## How Tracking Works

### Open Tracking Flow
1. Email is sent with invisible pixel: `<img src="/track/open/{trackingId}" />`
2. When recipient opens email, email client loads the pixel image
3. GET request to `/track/open/{trackingId}` is made
4. Server finds lead by trackingId and updates `opened: true`
5. Server returns 1x1 transparent GIF
6. Email client displays the GIF (invisible to user)

### Click Tracking Flow
1. Email contains tracked link: `<a href="/track/click/{trackingId}?redirect={url}">`
2. When recipient clicks link, browser sends GET request
3. Server finds lead by trackingId and updates `clicked: true`
4. Server performs redirect to destination URL
5. User sees destination page seamlessly

## Logging

The system provides detailed console logging:

```
✅ Email transporter ready
✅ Email sent to john@example.com (Tracking ID: f47ac10b-...)
✅ Lead created: 507f1f77... with email sent
📧 Email opened by john@example.com at 2024-06-26T11:15:00Z
🔗 Email link clicked by john@example.com at 2024-06-26T11:20:00Z
❌ Email transporter error: [error details]
❌ Failed to send email to john@example.com: [error details]
```

## Analytics & Metrics

The dashboard provides key metrics:

- **Open Rate**: Percentage of emails opened (opened / emailsSent * 100)
- **Click Rate**: Percentage of emails with clicks (clicked / emailsSent * 100)
- **Failure Rate**: Emails that failed to send (emailFailed)
- **Recent Activity**: Last 20 leads with full tracking data

## Best Practices

1. **Always validate email addresses** on the frontend before submission
2. **Use genuine sender addresses** - Gmail requires proper authentication
3. **Monitor delivery failures** - Check logs for bounced emails
4. **Respect email frequency** - Don't spam leads with too many emails
5. **Personalize templates** - Use lead names and custom requirements
6. **Track conversions** - Use dashboard to identify high-value leads
7. **Test tracking** - Verify opens/clicks are recorded correctly

## Troubleshooting

### Emails Not Sending
- Check `.env` file has correct `EMAIL_USER` and `EMAIL_PASS`
- Verify Gmail app password is 16 characters
- Check MongoDB connection is working
- Review server logs for specific errors

### Tracking Not Working
- Verify `BACKEND_URL` in `.env` matches actual server address
- Check tracking pixel is loaded in email client
- Ensure MongoDB is recording opens/clicks (check logs)
- Verify trackingId is unique UUID

### Opens Recorded But Clicks Not
- Check email client supports link clicking
- Verify redirect URL is valid
- Check CORS is not blocking tracking requests

## Future Enhancements

- Email templates library
- Scheduled email sequences
- A/B testing for subject lines
- Unsubscribe management
- Email bounce handling
- Attachment support
- Multiple recipient groups
