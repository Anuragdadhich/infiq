# InfiQ - AI-Powered Lead Automation Platform

A production-grade SaaS platform that automatically enriches leads with AI-generated business audits, creates professional PDF reports, sends personalized emails, and integrates with Google Sheets and Drive.

## 🚀 Features

- **Lead Validation**: Real-time email and domain validation
- **Company Research**: Automatic website scraping and data enrichment
- **AI-Powered Audits**: Generate personalized business audits using Gemini or OpenAI
- **Professional PDFs**: Beautiful, dynamically generated audit reports
- **Automated Email**: Send personalized emails with PDF attachments via Resend
- **Google Sheets**: Automatic lead logging to Google Sheets
- **Google Drive**: Automatic PDF storage and sharing
- **Admin Dashboard**: Track leads, reports, and analytics
- **Responsive UI**: Modern, mobile-friendly interface with animations
- **Error Handling**: Graceful failure recovery and retry logic

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless backend
- **jsPDF** - PDF generation
- **Cheerio** - Web scraping
- **Axios** - HTTP client

### AI & APIs
- **Google Gemini API** - AI generation (preferred)
- **OpenAI GPT-4** - Fallback AI model
- **Resend** - Email delivery
- **Google Sheets API** - Data logging
- **Google Drive API** - File storage

### Database
- **Supabase** (PostgreSQL) - Lead and report storage
- Mock in-memory for development

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Google Cloud Account (for APIs)
- OpenAI or Gemini API key
- Resend account for email

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd infiq
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with your API keys:

```env
# AI API
GEMINI_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key

# Email
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@yourdomain.com

# Google APIs
GOOGLE_SHEETS_ID=your-sheets-id
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
GOOGLE_SERVICE_ACCOUNT_JSON=your-service-account-json

# Database
DATABASE_URL=postgresql://user:password@host:5432/infiq

# Supabase (Alternative)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
infiq/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── submit/page.tsx         # Lead submission form
│   ├── success/[id]/page.tsx   # Success page
│   ├── admin/page.tsx          # Admin dashboard
│   └── api/
│       ├── leads/              # Lead management
│       ├── research/           # Company research
│       ├── audit/              # AI audit generation
│       ├── pdf/                # PDF generation
│       ├── email/              # Email sending
│       ├── sheets/             # Google Sheets logging
│       ├── drive/              # Google Drive upload
│       └── admin/stats/        # Admin statistics
├── components/                  # React components
├── lib/                        # Utility functions
├── services/                   # Business logic
├── types/                      # TypeScript types
├── utils/                      # Helper functions
├── templates/                  # Email templates
└── public/                     # Static assets
```

## 🔄 Workflow

1. **Lead Submission**: User fills out form with company information
2. **Data Validation**: Real-time validation of inputs
3. **Company Research**: Website scraped for company data
4. **AI Audit Generation**: Personalized audit created by AI
5. **PDF Creation**: Professional report generated
6. **Email Delivery**: Beautiful email sent with PDF attachment
7. **Data Logging**: Lead data saved to Google Sheets
8. **File Storage**: PDF uploaded to Google Drive
9. **Success Page**: User directed to success page with report link

## 🎨 UI Components

### Pages
- **Landing Page**: Hero, features, workflow, CTA sections
- **Lead Submission Form**: Real-time validation, progress tracking
- **Success Page**: Report download, social sharing, next steps
- **Admin Dashboard**: Lead management, analytics, export

### Design System
- Modern glassmorphism cards
- Gradient animations
- Smooth Framer Motion transitions
- Responsive mobile-first layout
- Dark mode with accent colors
- Professional typography

## 🔐 Security

- Environment variable protection
- Input validation and sanitization
- Error boundary handling
- Rate limiting ready
- CORS configuration
- Secure API key management

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Railway
```bash
railway link
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Database Schema

### Leads Table
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  company VARCHAR(255),
  website VARCHAR(255),
  industry VARCHAR(100),
  additional_notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  pdf_url VARCHAR(255),
  google_drive_file_id VARCHAR(255),
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## 🔌 API Endpoints

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - List all leads
- `GET /api/leads/[id]` - Get lead details

### Research
- `POST /api/research` - Research company website

### Audit
- `POST /api/audit` - Generate AI business audit

### PDF
- `POST /api/pdf` - Generate PDF report

### Email
- `POST /api/email` - Send email with report

### Sheets
- `POST /api/sheets` - Log data to Google Sheets

### Drive
- `POST /api/drive` - Upload to Google Drive

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

## 🔄 Retry Logic

The system includes automatic retry logic for:
- Failed API calls (3 retries with exponential backoff)
- Email delivery (2 retries)
- File uploads (2 retries)
- Network timeouts

## ⚙️ Configuration

### AI Model Selection

The system automatically selects the best available AI:
1. **Gemini** (if `GEMINI_API_KEY` set) - Fast and cost-effective
2. **OpenAI** (if `OPENAI_API_KEY` set) - Most powerful
3. **Fallback** - Generates realistic-looking audit without API

### Email Configuration

Set up Resend for email delivery:
1. Create account at [resend.com](https://resend.com)
2. Get API key
3. Add verified domain
4. Update `FROM_EMAIL` in `.env.local`

## 📈 Analytics

The admin dashboard provides:
- Total leads submitted
- Reports generated
- Emails sent
- Conversion rates
- Lead search and filtering
- Export capabilities

## 🐛 Troubleshooting

### PDF Generation Issues
- Ensure `jsPDF` is installed: `npm install jspdf`
- Check file permissions for `/public/reports` directory

### Email Not Sending
- Verify `RESEND_API_KEY` is correct
- Check domain is verified in Resend
- Review spam folder

### AI Generation Failing
- Ensure API key is valid
- Check rate limits not exceeded
- Review API quotas

## 🧪 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables Checklist

- [ ] `GEMINI_API_KEY` or `OPENAI_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `FROM_EMAIL`
- [ ] `GOOGLE_SHEETS_ID`
- [ ] `GOOGLE_DRIVE_FOLDER_ID`
- [ ] `GOOGLE_SERVICE_ACCOUNT_JSON`
- [ ] `DATABASE_URL` or Supabase credentials

## 🎯 Future Enhancements

- [ ] Report regeneration from dashboard
- [ ] Custom report templates
- [ ] Scheduled lead imports
- [ ] Webhook integration
- [ ] CRM sync (Salesforce, HubSpot)
- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] A/B testing framework
- [ ] Lead scoring system
- [ ] Automated follow-up sequences

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

For support, email support@infiq.io or open an issue on GitHub.

## 🙌 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- AI powered by [Google Gemini](https://ai.google.dev/) and [OpenAI](https://openai.com/)

---

Built with ❤️ for modern SaaS companies. Ready for production. Built to impress.
