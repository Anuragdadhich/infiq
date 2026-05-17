# 🚀 InfiQ - Start Here!

Welcome to **InfiQ** - a complete, production-ready AI-powered lead automation platform.

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
# Choose one AI API
GEMINI_API_KEY=your_key_here
# OR
OPENAI_API_KEY=your_key_here

# Email sending
RESEND_API_KEY=your_key_here
FROM_EMAIL=noreply@yourdomain.com
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit **http://localhost:3000**

---

## 📚 Documentation

| Document | Purpose | Time |
|----------|---------|------|
| **[QUICKSTART.md](QUICKSTART.md)** | Setup guide | 5 min |
| **[README.md](README.md)** | Full documentation | 15 min |
| **[API_DOCS.md](API_DOCS.md)** | API reference | 10 min |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production setup | 15 min |
| **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** | All docs index | - |

**👉 Read [QUICKSTART.md](QUICKSTART.md) first!**

---

## 🎯 What's Included

### ✨ Features
- 🎨 Beautiful modern landing page
- 📝 Lead submission form with validation
- 🤖 AI-powered business audits (Gemini/OpenAI)
- 📄 Professional PDF report generation
- 📧 Automated email delivery (Resend)
- 📊 Google Sheets integration
- 💾 Google Drive storage
- 📈 Admin dashboard

### 🛠️ Technology
- Next.js 15 + React 19
- TypeScript
- Tailwind CSS
- Framer Motion animations
- jsPDF generation
- Cheerio web scraping

### 🔌 API Endpoints (11 total)
- Lead management
- Company research
- AI audit generation
- PDF creation
- Email sending
- Google integrations
- Admin statistics

---

## 🌐 Pages

1. **Landing Page** (`/`)
   - Hero section
   - Feature showcase
   - Workflow visualization
   - Call-to-action

2. **Lead Form** (`/submit`)
   - Real-time validation
   - Live progress tracking
   - Error handling

3. **Success Page** (`/success/[id]`)
   - Report download
   - Lead details
   - Next steps

4. **Admin Dashboard** (`/admin`)
   - Lead management
   - Statistics
   - Search & export

---

## 📋 Workflow

```
User Form Submission
  ↓
Data Validation
  ↓
Company Research (Web Scraping)
  ↓
AI Audit Generation
  ↓
PDF Report Creation
  ↓
Email Delivery
  ↓
Google Sheets Logging
  ↓
Google Drive Upload
  ↓
Success Page
```

---

## 🔐 Security & Production Ready

- ✅ Environment variable protection
- ✅ Input validation & sanitization
- ✅ Error handling & recovery
- ✅ Type-safe TypeScript
- ✅ Secure API design
- ✅ Rate limiting support

---

## 🚀 Deploy to Production

### Vercel (Easiest)
```bash
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

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🎓 Project Structure

```
infiq/
├── app/                 # Next.js app
│   ├── page.tsx        # Landing page
│   ├── submit/         # Form page
│   ├── success/        # Success page
│   ├── admin/          # Admin dashboard
│   └── api/            # 11 API endpoints
├── components/          # React components
├── services/            # Business logic
├── lib/                # Utilities
├── types/              # TypeScript types
└── public/             # Static assets
```

---

## 🔑 Key Features

### Frontend
- Responsive design
- Dark mode support
- Smooth animations
- Real-time validation
- Progress tracking

### Backend
- AI audit generation
- Web scraping
- PDF creation
- Email sending
- Google APIs integration
- Error handling

### Dashboard
- Lead management
- Statistics
- Search & filter
- Export data

---

## 💡 Customization

### Change Colors
Edit `tailwind.config.ts`

### Customize Email
Edit `app/api/email/route.ts`

### Modify PDF
Edit `app/api/pdf/route.ts`

### Add Industries
Edit `app/submit/page.tsx`

---

## ❓ Help & Support

### Issues?
1. Check [README.md](README.md) FAQ
2. See [SETUP_GUIDES.md](SETUP_GUIDES.md) troubleshooting
3. Review [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

### Want to Learn More?
- Read [README.md](README.md) - Full documentation
- Check [API_DOCS.md](API_DOCS.md) - API reference
- See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Project overview

---

## 📋 Configuration Checklist

- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add API keys to `.env.local`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test form submission
- [ ] Review pages
- [ ] Check admin dashboard

---

## 🎉 You're Ready!

1. ✅ Install: `npm install`
2. ✅ Configure: Edit `.env.local`
3. ✅ Run: `npm run dev`
4. ✅ Explore: http://localhost:3000

---

## 📞 Next Steps

### Development
- Explore the codebase
- Read API documentation
- Customize styling
- Test all features

### Deployment
- Read [DEPLOYMENT.md](DEPLOYMENT.md)
- Set up database
- Configure Google APIs
- Deploy to production

### Extensions
- Add more features
- Integrate with CRM
- Set up webhooks
- Add analytics

---

## 📚 Full Documentation

See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for complete documentation guide.

---

**Built with ❤️ for founders and developers.**

Production-ready. Built to impress. Ready to launch. 🚀

---

👉 **[Start with QUICKSTART.md](QUICKSTART.md)** for detailed setup instructions.
