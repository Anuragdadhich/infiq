# Setup Guides

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation Steps

1. **Clone repository**
```bash
git clone <repository-url>
cd infiq
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
- `GEMINI_API_KEY` or `OPENAI_API_KEY`
- `RESEND_API_KEY`
- `FROM_EMAIL`

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to `http://localhost:3000`

## Database Setup

### Supabase (Recommended)

1. Create account at https://supabase.com
2. Create new project
3. Get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Add to `.env.local`

### PostgreSQL Local

```bash
# Install PostgreSQL
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql

# Start service
brew services start postgresql

# Create database
createdb infiq

# Connect
psql -d infiq
```

Create tables:
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  company VARCHAR(255),
  website VARCHAR(255),
  industry VARCHAR(100),
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Google APIs Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable these APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create Service Account

1. IAM & Admin > Service Accounts
2. Create New Service Account
3. Create JSON Key
4. Download and save securely

### 3. Share Resources

1. Share Google Sheet with service account email
2. Share Google Drive folder with service account email

### 4. Configure Environment

```env
GOOGLE_SHEETS_ID=your-sheet-id
GOOGLE_DRIVE_FOLDER_ID=your-folder-id
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

## Gmail/Resend Setup

### Resend Configuration

1. Create account at https://resend.com
2. Get API key
3. Verify your domain
4. Add to `.env.local`:

```env
RESEND_API_KEY=your-api-key
FROM_EMAIL=noreply@yourdomain.com
```

## AI API Setup

### Google Gemini

1. Go to https://ai.google.dev
2. Create API key
3. Add to `.env.local`:

```env
GEMINI_API_KEY=your-api-key
```

### OpenAI

1. Go to https://platform.openai.com
2. Create API key
3. Add to `.env.local`:

```env
OPENAI_API_KEY=your-api-key
```

## Docker Setup

### Using Docker Compose

```bash
# Build and run
docker-compose up -d

# Access application
# Open http://localhost:3000

# Stop containers
docker-compose down
```

### Manual Docker Build

```bash
# Build image
docker build -t infiq .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your-key infiq

# Stop container
docker stop <container-id>
```

## Production Setup

### Prerequisites

- VPS/Server with Linux (Ubuntu 22.04 LTS recommended)
- Domain name
- SSL certificate

### Steps

1. **SSH into server**
```bash
ssh user@your-server.com
```

2. **Update system**
```bash
sudo apt update && sudo apt upgrade -y
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

4. **Install PM2**
```bash
sudo npm install -g pm2
```

5. **Clone repository**
```bash
git clone <repository-url>
cd infiq
```

6. **Install dependencies**
```bash
npm ci --production
```

7. **Build application**
```bash
npm run build
```

8. **Start with PM2**
```bash
pm2 start npm --name "infiq" -- start
pm2 save
pm2 startup
```

9. **Set up Nginx**
```bash
sudo apt install nginx
```

Create `/etc/nginx/sites-available/infiq`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/infiq /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

10. **Set up SSL**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### API Key Issues

1. Verify key is correct
2. Check API quotas
3. Check API isn't rate limited
4. Restart dev server

### Database Connection Issues

```bash
# Test connection
psql -d infiq -c "SELECT 1"

# Check logs
pm2 logs
```

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

## Deployment Checklist

- [ ] Environment variables set
- [ ] Database configured
- [ ] API keys working
- [ ] Build succeeds
- [ ] Type checking passes
- [ ] All endpoints tested
- [ ] Email sending works
- [ ] PDF generation works
- [ ] Google APIs configured
- [ ] SSL certificate valid
- [ ] Monitoring set up
- [ ] Backups configured

## Next Steps

1. Follow QUICKSTART.md
2. Configure all environment variables
3. Test lead submission flow
4. Test all API endpoints
5. Review admin dashboard
6. Deploy to production

---

For more help, see README.md and other documentation files.
