# Deployment Guide for InfiQ

## Quick Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Build successful (`npm run build`)
- [ ] Type checking passed (`npm run type-check`)
- [ ] All tests passing

## Vercel Deployment (Recommended)

### 1. Prerequisites
- Vercel account
- GitHub repository

### 2. Steps
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### 3. Configure Environment Variables in Vercel Dashboard
1. Go to Settings → Environment Variables
2. Add all `.env.local` variables
3. Redeploy

## Railway Deployment

### 1. Prerequisites
- Railway account
- GitHub repository connected

### 2. Steps
```bash
npm i -g @railway/cli
railway link
railway up
```

### 3. Configure
- Add environment variables in Railway dashboard
- Configure custom domain

## Docker Deployment

### 1. Build Docker Image
```bash
docker build -t infiq:latest .

docker tag infiq:latest your-registry/infiq:latest

docker push your-registry/infiq:latest
```

### 2. Run Container
```bash
docker run -p 3000:3000 \
  -e GEMINI_API_KEY=your-key \
  -e RESEND_API_KEY=your-key \
  your-registry/infiq:latest
```

## Self-Hosted (VPS/Server)

### 1. Setup Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 2. Deploy Application
```bash
# Clone repository
git clone <repository-url>
cd infiq

# Install dependencies
npm ci --production

# Build application
npm run build

# Start with PM2
pm2 start npm --name "infiq" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Setup Nginx (Reverse Proxy)
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

### 4. SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Database Setup

### Supabase (Recommended)

1. Create project at supabase.com
2. Run migrations:
```sql
-- Users/Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  industry VARCHAR(100),
  additional_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports Table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  pdf_url VARCHAR(255),
  google_drive_file_id VARCHAR(255),
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX leads_email_idx ON leads(email);
CREATE INDEX reports_lead_id_idx ON reports(lead_id);
```

3. Set `DATABASE_URL` in environment:
```
postgresql://user:password@host:5432/infiq
```

### PostgreSQL Self-Hosted

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE infiq;
CREATE USER infiq_user WITH PASSWORD 'secure_password';
ALTER ROLE infiq_user SET client_encoding TO 'utf8';
ALTER ROLE infiq_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE infiq_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE infiq TO infiq_user;
```

## Google APIs Setup

### 1. Create Google Cloud Project
1. Go to console.cloud.google.com
2. Create new project
3. Enable APIs:
   - Google Sheets API
   - Google Drive API

### 2. Create Service Account
1. IAM & Admin → Service Accounts
2. Create new service account
3. Create JSON key
4. Add to `.env` as `GOOGLE_SERVICE_ACCOUNT_JSON`

### 3. Share Resources
- Share Google Sheet with service account email
- Share Google Drive folder with service account email

## Monitoring & Logging

### Application Logs
```bash
# Vercel
vercel logs

# Railway
railway logs

# Docker
docker logs <container-id>

# PM2
pm2 logs infiq
```

### Error Tracking
Set up Sentry for error tracking:
```bash
npm install @sentry/nextjs
```

## Performance Optimization

### Image Optimization
```bash
npm install sharp

# Verify optimization
npm run build
```

### Build Analysis
```bash
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

## Backup Strategy

### Database Backups
```bash
# PostgreSQL
pg_dump infiq > backup.sql

# Restore
psql infiq < backup.sql
```

### Google Drive Backups
- Store export folder automatically with timestamps
- Implement retention policy in Google Drive

## Health Checks

### Implement Health Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date() });
}
```

### Configure Uptime Monitoring
Use services like:
- UptimeRobot
- Pingdom
- Better Uptime

## Scaling Considerations

- Use database connection pooling
- Implement caching layer (Redis)
- Set up CDN for static assets
- Use load balancing for multiple instances
- Implement rate limiting

## Security Hardening

1. **CORS**: Configure proper CORS headers
2. **Rate Limiting**: Implement rate limiting on APIs
3. **Input Validation**: Always validate inputs server-side
4. **API Keys**: Rotate keys regularly
5. **HTTPS**: Always use HTTPS
6. **WAF**: Consider AWS WAF or Cloudflare
7. **Secrets**: Never commit sensitive data

## Post-Deployment Checklist

- [ ] Application running
- [ ] Logs showing normal operation
- [ ] Emails sending correctly
- [ ] PDFs generating properly
- [ ] Google Sheets updating
- [ ] Admin dashboard accessible
- [ ] Database connection stable
- [ ] APIs responding correctly
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured

## Rollback Plan

### Vercel
```bash
vercel rollback
```

### Manual Rollback
```bash
git revert <commit-hash>
npm run build
npm start
```

## Support

For deployment issues:
- Check logs: `npm run dev`
- Verify environment variables
- Test API endpoints manually
- Check database connectivity
- Review error messages in Sentry

---

Happy deploying! 🚀
