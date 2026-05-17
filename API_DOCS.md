# API Documentation

## Base URL
- Development: `http://localhost:3000`
- Production: `https://infiq.io`

## Authentication
All endpoints currently support public access. In production, implement:
- API Key authentication
- JWT tokens
- Rate limiting

## Endpoints

### 1. Lead Management

#### Create Lead
```
POST /api/leads
Content-Type: application/json

{
  "lead": {
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "website": "https://acme.com",
    "industry": "Technology",
    "additionalNotes": "Optional notes"
  },
  "pdfUrl": "https://example.com/report.pdf",
  "auditData": { ... }
}

Response:
{
  "success": true,
  "data": {
    "id": "abc123",
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### List Leads
```
GET /api/leads

Response:
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "fullName": "John Doe",
      "email": "john@company.com",
      "company": "Acme Corp",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Get Lead Details
```
GET /api/leads/:id

Response:
{
  "success": true,
  "data": {
    "id": "abc123",
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "pdfUrl": "https://example.com/report.pdf",
    "auditData": { ... }
  }
}
```

### 2. Company Research

#### Research Company
```
POST /api/research
Content-Type: application/json

{
  "website": "https://example.com",
  "company": "Acme Corp"
}

Response:
{
  "success": true,
  "data": {
    "name": "Acme Corp",
    "description": "We build great products",
    "websiteTitle": "Acme - The Best Products",
    "metaDescription": "...",
    "headings": ["About Us", "Services", "Contact"],
    "services": ["Service 1", "Service 2"],
    "technologies": ["React", "Node.js", "AWS"],
    "socialLinks": {
      "linkedin": "https://linkedin.com/company/acme",
      "twitter": "https://twitter.com/acme"
    },
    "performance": {
      "mobileFriendly": true
    }
  }
}
```

### 3. AI Audit Generation

#### Generate Audit
```
POST /api/audit
Content-Type: application/json

{
  "lead": {
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "website": "https://acme.com",
    "industry": "Technology",
    "additionalNotes": "..."
  },
  "research": {
    "name": "Acme Corp",
    "description": "...",
    "websiteTitle": "...",
    "services": [...],
    "technologies": [...]
  }
}

Response:
{
  "success": true,
  "data": {
    "businessOverview": "Acme Corp is a technology company...",
    "websiteAudit": {
      "strengths": ["Good design", "Fast loading"],
      "weaknesses": ["Poor SEO", "Limited mobile"],
      "recommendations": ["Improve SEO", "Mobile optimization"]
    },
    "uxAnalysis": {
      "usability": "Good",
      "designQuality": "Professional",
      "improvements": ["Add more CTA", "Better navigation"]
    },
    "seoAnalysis": {
      "score": 72,
      "keywords": ["acme", "technology", "products"],
      "opportunities": ["Target long-tail keywords"]
    },
    "aiOpportunities": [
      "Implement chatbot",
      "Personalization engine"
    ],
    "growthSuggestions": [
      "Expand to new markets",
      "Add new product lines"
    ],
    "technicalSuggestions": [
      "Upgrade to latest framework",
      "Implement CDN"
    ],
    "personalizedOutreach": "Based on analysis, we recommend..."
  }
}
```

### 4. PDF Generation

#### Generate PDF Report
```
POST /api/pdf
Content-Type: application/json

{
  "lead": { ... },
  "audit": { ... }
}

Response:
{
  "success": true,
  "data": {
    "pdfUrl": "/reports/acme_corp_audit_1234567890.pdf",
    "fileId": "acme_corp_audit_1234567890.pdf",
    "fileName": "acme_corp_audit_1234567890.pdf"
  }
}
```

### 5. Email Sending

#### Send Report Email
```
POST /api/email
Content-Type: application/json

{
  "to": "john@company.com",
  "name": "John Doe",
  "company": "Acme Corp",
  "pdfUrl": "https://example.com/report.pdf"
}

Response:
{
  "success": true,
  "data": {
    "id": "email_123",
    "from": "noreply@infiq.io",
    "to": "john@company.com",
    "status": "sent"
  }
}
```

### 6. Google Sheets Logging

#### Log to Google Sheets
```
POST /api/sheets
Content-Type: application/json

{
  "lead": {
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "industry": "Technology"
  },
  "pdfUrl": "https://example.com/report.pdf"
}

Response:
{
  "success": true,
  "message": "Data logged to Google Sheets"
}
```

### 7. Google Drive Upload

#### Upload to Google Drive
```
POST /api/drive
Content-Type: application/json

{
  "fileId": "acme_corp_audit_1234567890.pdf",
  "company": "Acme Corp"
}

Response:
{
  "success": true,
  "data": {
    "fileId": "acme_corp_audit_1234567890.pdf",
    "publicUrl": "https://drive.google.com/file/d/..."
  }
}
```

### 8. Admin Statistics

#### Get Dashboard Stats
```
GET /api/admin/stats

Response:
{
  "success": true,
  "data": {
    "totalLeads": 24,
    "emailsSent": 22,
    "reportsGenerated": 24,
    "conversionRate": 85
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional context"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid input)
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Server Error

## Rate Limiting

Current limits (can be configured):
- 100 requests per minute per IP
- 1000 requests per hour per API key

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

## Webhooks (Future)

Notify external systems of events:

```
POST https://your-webhook.com/webhooks/leads

{
  "event": "lead.created",
  "data": {
    "leadId": "abc123",
    "company": "Acme Corp",
    "email": "john@company.com"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Example Integration

### cURL
```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "lead": {
      "fullName": "John Doe",
      "email": "john@company.com",
      "company": "Acme Corp",
      "website": "https://acme.com",
      "industry": "Technology"
    },
    "pdfUrl": "https://example.com/report.pdf"
  }'
```

### JavaScript/TypeScript
```typescript
const response = await fetch('/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lead: {
      fullName: 'John Doe',
      email: 'john@company.com',
      company: 'Acme Corp',
      website: 'https://acme.com',
      industry: 'Technology',
    },
    pdfUrl: 'https://example.com/report.pdf',
  }),
});

const data = await response.json();
console.log(data);
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/leads', json={
    'lead': {
        'fullName': 'John Doe',
        'email': 'john@company.com',
        'company': 'Acme Corp',
        'website': 'https://acme.com',
        'industry': 'Technology'
    },
    'pdfUrl': 'https://example.com/report.pdf'
})

print(response.json())
```

## Response Examples

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "lead_abc123",
    "fullName": "John Doe",
    "email": "john@company.com",
    "company": "Acme Corp",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid email address",
  "message": "Please provide a valid email"
}
```

## Testing Endpoints

### Using Postman
1. Import the collection
2. Set environment variables
3. Run requests

### Using curl
```bash
# Test health
curl http://localhost:3000/api/health

# Create lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '...'
```

## Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Versioning

Current API version: `v1`

Future versions will be available at:
- `/api/v1/...`
- `/api/v2/...`

---

For more information, visit https://infiq.io/docs
