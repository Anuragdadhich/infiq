# InfiQ Quick Start Guide

Get up and running with InfiQ in 5 minutes.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- An API key (Gemini or OpenAI)
- A Resend account (for email)

## Installation

### 1. Clone and Install

```bash
git clone <repository-url>
cd infiq
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your_gemini_key_here
# OR
OPENAI_API_KEY=your_openai_key_here

RESEND_API_KEY=your_resend_key_here
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Features Overview

### Landing Page
- Hero section with CTA
- Feature highlights
- Workflow visualization
- Call-to-action sections

### Lead Submission Form (`/submit`)
- Real-time validation
- Step-by-step workflow tracking
- Company research
- AI audit generation
- Automatic email sending
- Google Sheets logging

### Success Page
- Report download
- Lead details summary
- Next steps
- Social sharing options

### Admin Dashboard (`/admin`)
- Lead management
- Report tracking
- Email status
- Search and filter
- Export capabilities

## How It Works

1. **User submits form** → Lead data captured
2. **System validates** → Email and URL verification
3. **Research phase** → Website scraped and analyzed
4. **AI audit generated** → Personalized insights created
5. **PDF created** → Professional report generated
6. **Email sent** → Report delivered to user
7. **Data logged** → Leads saved to Google Sheets
8. **File stored** → PDF uploaded to Google Drive

## Key Files

- `app/page.tsx` - Landing page
- `app/submit/page.tsx` - Lead form
- `app/success/[id]/page.tsx` - Success page
- `app/admin/page.tsx` - Admin dashboard
- `app/api/*` - Backend API routes

## API Endpoints

```
POST /api/leads          - Create/list leads
POST /api/research       - Research company
POST /api/audit          - Generate audit
POST /api/pdf            - Create PDF
POST /api/email          - Send email
POST /api/sheets         - Log to Sheets
POST /api/drive          - Upload to Drive
GET  /api/admin/stats    - Admin stats
GET  /api/health         - Health check
```

## Customization

### Branding

Edit `tailwind.config.ts` to change colors:

```typescript
colors: {
  primary: {
    500: '#your-color',
    // ...
  },
}
```

### Email Template

Edit `app/api/email/route.ts` to customize the email design.

### PDF Report

Edit `app/api/pdf/route.ts` to change PDF layout and styling.

### Industries

Add more industries in `app/submit/page.tsx`:

```typescript
const industries = [
  'Technology',
  'Finance',
  // Add more...
];
```

## Deployment

### Vercel (Easiest)

```bash
npm install -g vercel
vercel deploy --prod
```

### Docker

```bash
docker build -t infiq .
docker run -p 3000:3000 infiq
```

## Google API Setup (Optional)

### Google Sheets

1. Create Google Cloud project
2. Enable Sheets API
3. Create service account
4. Download JSON key
5. Share spreadsheet with service account email
6. Add to `.env.local`:

```env
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_SERVICE_ACCOUNT_JSON=your-json-key
```

### Google Drive

Similar process for Drive API and folder sharing.

## Troubleshooting

### Port 3000 Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### API Key Errors

1. Verify key is correct in `.env.local`
2. Check API quotas/limits
3. Restart development server

### PDF Generation Issues

Ensure `public/reports` directory exists:

```bash
mkdir -p public/reports
```

### Email Not Sending

1. Check Resend API key
2. Verify domain is verified in Resend
3. Check spam folder

## Environment Variables

Required:
- `GEMINI_API_KEY` or `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`

Optional:
- `GOOGLE_SHEETS_ID`
- `GOOGLE_DRIVE_FOLDER_ID`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `DATABASE_URL`

## Building for Production

```bash
npm run build
npm run type-check
npm start
```

## Performance Tips

1. Use production build: `npm run build`
2. Enable image optimization
3. Minify CSS/JavaScript
4. Use CDN for static assets
5. Enable compression

## Security

- Never commit `.env` files
- Rotate API keys regularly
- Use HTTPS in production
- Validate inputs server-side
- Keep dependencies updated

## Next Steps

1. ✅ Get the app running
2. 🔧 Configure your API keys
3. 🎨 Customize branding
4. 🚀 Deploy to production
5. 📊 Monitor with admin dashboard

## Support

- 📖 Full documentation: See README.md
- 🐛 Report issues on GitHub
- 💬 Discussions for questions
- 📧 Contact: support@infiq.io

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Resend Docs](https://resend.com/docs)

---

Happy building! 🚀
