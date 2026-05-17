# InfiQ - AI Lead Automation Platform

## 📊 Project Overview

InfiQ is a production-grade SaaS platform that automates lead enrichment through AI-powered business audits. The system:

- Captures lead data through a beautiful web form
- Researches company information automatically
- Generates personalized AI business audits
- Creates professional PDF reports
- Sends automated emails with attachments
- Logs data to Google Sheets
- Archives PDFs to Google Drive
- Provides an admin dashboard for tracking

## 🎯 Current Status

✅ **Complete and Production Ready**

- Frontend: Fully styled with Tailwind + Framer Motion
- Backend: All API routes implemented
- AI Integration: Gemini & OpenAI support
- Email: Resend integration
- PDF: Dynamic generation
- Google APIs: Sheets and Drive ready
- Database: Supabase/PostgreSQL ready
- Documentation: Comprehensive

## 📂 Project Structure

```
infiq/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── submit/page.tsx          # Lead form
│   ├── success/[id]/page.tsx    # Success page
│   ├── admin/page.tsx           # Admin dashboard
│   ├── api/                     # API routes
│   │   ├── leads/               # Lead management
│   │   ├── research/            # Company research
│   │   ├── audit/               # AI audit generation
│   │   ├── pdf/                 # PDF generation
│   │   ├── email/               # Email sending
│   │   ├── sheets/              # Google Sheets
│   │   ├── drive/               # Google Drive
│   │   ├── health/              # Health check
│   │   └── admin/stats/         # Admin stats
│   └── globals.css              # Global styles
├── components/                   # React components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── services/                    # API services
├── types/                       # TypeScript types
├── utils/                       # Helper utilities
├── templates/                   # Email templates
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.ts          # Tailwind config
├── next.config.js              # Next.js config
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker compose
├── .env.example               # Environment template
├── .gitignore                 # Git ignore
├── README.md                  # Main documentation
├── QUICKSTART.md             # Quick start guide
├── DEPLOYMENT.md             # Deployment guide
├── API_DOCS.md               # API documentation
├── CONTRIBUTING.md           # Contributing guide
└── vercel.json              # Vercel config
```

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repo>
cd infiq
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## 🔑 Key Features

### Frontend
- ✨ Modern landing page with animations
- 📝 Real-time form validation
- 🔄 Live workflow tracking
- 📊 Admin dashboard
- 📱 Fully responsive
- 🌙 Dark mode support

### Backend
- 🤖 AI audit generation (Gemini/OpenAI)
- 🕷️ Company website research
- 📄 PDF report generation
- 📧 Automated email delivery
- 📊 Google Sheets logging
- 💾 Google Drive storage
- ⚡ Error handling & retries

### APIs
- RESTful design
- Consistent error responses
- Rate limiting ready
- Webhook support

## 📖 Documentation

- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [API_DOCS.md](API_DOCS.md) - API reference
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guide

## 🛠️ Technology Stack

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod validation

**Backend:**
- Next.js API Routes
- Node.js
- jsPDF
- Cheerio (web scraping)
- Axios

**AI:**
- Google Gemini API
- OpenAI GPT-4

**Email:**
- Resend

**Database:**
- Supabase (PostgreSQL)
- Optional: PostgreSQL

**Google APIs:**
- Google Sheets API
- Google Drive API

**Deployment:**
- Vercel
- Railway
- Docker
- Self-hosted

## 🔐 Security

- ✅ Environment variable protection
- ✅ Input validation & sanitization
- ✅ Error boundary handling
- ✅ Secure API key management
- ✅ CORS configuration
- ✅ Rate limiting support

## 📊 Performance

- ✅ Optimized Next.js build
- ✅ Image optimization with Sharp
- ✅ CSS minification
- ✅ JavaScript code splitting
- ✅ Caching strategies

## 🧪 Testing & Quality

- ✅ TypeScript strict mode
- ✅ Type-safe components
- ✅ Error handling
- ✅ Input validation
- ✅ API error responses

## 🚀 Deployment Ready

### Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

### Docker
```bash
docker build -t infiq .
docker run -p 3000:3000 infiq
```

### Railway
```bash
railway link
railway up
```

## 📋 Checklist for Production

- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] Google APIs configured
- [ ] Email sending tested
- [ ] PDF generation tested
- [ ] Build passes: `npm run build`
- [ ] Type checking passes: `npm run type-check`
- [ ] All endpoints tested
- [ ] Admin dashboard working
- [ ] SSL certificate configured
- [ ] Monitoring set up
- [ ] Backups configured

## 💡 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#your-color',
  },
}
```

### Customize Email
Edit `app/api/email/route.ts`

### Customize PDF
Edit `app/api/pdf/route.ts`

### Add More Industries
Edit `app/submit/page.tsx`

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>
```

**API Key errors:**
- Verify key is correct
- Check API quotas
- Restart dev server

**Email not sending:**
- Check Resend API key
- Verify domain verified
- Check spam folder

See [README.md](README.md) for more troubleshooting.

## 📞 Support

- 📖 Documentation: See README.md
- 🐛 Issues: Report on GitHub
- 💬 Discussions: Ask on GitHub
- 📧 Email: support@infiq.io

## 📜 License

MIT License - See LICENSE file

## 🙌 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Google Gemini](https://ai.google.dev/)
- [Resend](https://resend.com/)

---

**Ready to launch your lead automation?** Start with [QUICKSTART.md](QUICKSTART.md)

Built with ❤️ by the InfiQ team. Production-grade. Built to impress. 🚀
