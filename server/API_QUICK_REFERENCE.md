# Quick Reference: Email & Tracking API

## Testing with cURL

### 1. Create a Lead (Triggers Email)
```bash
curl -X POST http://localhost:5001/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Tech Corp",
    "requirement": "CRM solution for 50 users"
  }'
```

### 2. Get All Leads
```bash
curl http://localhost:5001/api/leads/
```

### 3. Get Specific Lead
```bash
curl http://localhost:5001/api/leads/{leadId}
```

### 4. Get Dashboard Stats
```bash
curl http://localhost:5001/api/dashboard
```

### 5. Resend Email to Lead
```bash
curl -X POST http://localhost:5001/api/leads/{leadId}/resend-email
```

### 6. Get Tracking Stats for Lead
```bash
curl http://localhost:5001/track/stats/{leadId}
```

---

## Testing with JavaScript (Fetch API)

### Create Lead
```javascript
fetch('http://localhost:5001/api/leads/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    company: 'Sales Inc',
    requirement: 'Email marketing automation'
  })
})
.then(res => res.json())
.then(data => console.log(data))
```

### Get Dashboard
```javascript
fetch('http://localhost:5001/api/dashboard')
  .then(res => res.json())
  .then(data => console.log('Analytics:', data.data))
```

---

## Example Response: Create Lead

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
    "requirement": "CRM solution for 50 users",
    "trackingId": "a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5",
    "emailSent": true,
    "opened": false,
    "clicked": false,
    "createdAt": "2024-06-26T10:30:00Z",
    "updatedAt": "2024-06-26T10:30:00Z"
  }
}
```

---

## Example Response: Dashboard

```json
{
  "success": true,
  "data": {
    "totalLeads": 25,
    "emailsSent": 24,
    "emailFailed": 1,
    "opened": 16,
    "clicked": 8,
    "openRate": 67,
    "clickRate": 33,
    "recentLeads": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "opened": true,
        "openedAt": "2024-06-26T11:15:00Z",
        "clicked": true,
        "clickedAt": "2024-06-26T11:20:00Z"
      }
    ]
  }
}
```

---

## Email Sent Sample

**Subject:** We've Received Your Request

**From:** parmodpatel2603@gmail.com

**HTML Content:**
- Professional gradient header with thank you message
- Lead's requirement in a highlighted box
- Call-to-action button: "Learn More About Our Services"
- Footer with company signature
- Invisible tracking pixel for open detection
- Click link tracked for engagement

---

## Tracking Flow Example

1. **Lead Created:** `POST /api/leads/`
   - Email sent with tracking ID
   - `emailSent` → `true`

2. **Email Opened:** (automatic when email client loads pixel)
   - Tracking pixel called: `GET /track/open/{trackingId}`
   - `opened` → `true`
   - `openedAt` → timestamp

3. **Link Clicked:** (when recipient clicks button)
   - Tracked link called: `GET /track/click/{trackingId}?redirect=...`
   - `clicked` → `true`
   - `clickedAt` → timestamp
   - Redirects to destination

4. **Analytics:** `GET /api/dashboard`
   - Shows open rate: `(16 opened / 24 sent) * 100 = 67%`
   - Shows click rate: `(8 clicked / 24 sent) * 100 = 33%`

---

## Common Error Responses

### Invalid Email Format
```json
{
  "success": false,
  "message": "Invalid email format."
}
```

### Lead Not Found
```json
{
  "success": false,
  "message": "Lead not found"
}
```

### Missing Required Fields
```json
{
  "success": false,
  "message": "Name, email, phone, and requirement are required."
}
```

### Email Send Failure
```json
{
  "success": false,
  "message": "Failed to send email: [specific error]"
}
```

---

## Console Output While Running

```
✅ Email transporter ready
✅ Email sent to john@example.com (Tracking ID: a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5)
✅ Lead created: 507f1f77bcf86cd799439011 with email sent
📧 Email opened by john@example.com at 2024-06-26T11:15:00Z
🔗 Email link clicked by john@example.com at 2024-06-26T11:20:00Z
```

---

## Key Environment Variables

- `EMAIL_USER` - Gmail address (example: parmodpatel2603@gmail.com)
- `EMAIL_PASS` - 16-character app password
- `BACKEND_URL` - Server URL (example: http://localhost:5001)
- `CLIENT_URL` - Frontend URL for redirect (example: http://localhost:3000)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5001)
