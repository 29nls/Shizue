# 🚀 Deployment Guide - Diaspora Nuxt

Complete guide to deploying your Nuxt 3 blog to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All posts in `/data/posts/` with correct YAML frontmatter
- [ ] `.nuxt/` and `node_modules/` deleted
- [ ] `npm run build` completes without errors
- [ ] `npm run preview` shows expected output
- [ ] All links work correctly
- [ ] Images load properly
- [ ] Mobile version responsive
- [ ] No console errors

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best for:** Auto-deployment, fast, free tier

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
# First time
vercel

# Follow prompts:
# ? Project name: diaspora-nuxt
# ? Project type: Other
# ? Root directory: ./
# ? Command override: npm run build
# ? Output directory: .output/public
```

#### Step 3: Configure
```bash
# For subsequent deploys
vercel --prod
```

**Result:** Your site is live at `https://diaspora-nuxt.vercel.app`

#### Environment Variables (if needed)
```bash
vercel env add <NAME> <VALUE>
```

---

### Option 2: Netlify

**Best for:** Easy setup, good performance

#### Step 1: Build Locally
```bash
npm run generate
```

#### Step 2: Connect GitHub
1. Push code to GitHub
2. Visit https://app.netlify.com
3. Click "New site from Git"
4. Select GitHub repo

#### Step 3: Configure Build
```
Build command: npm run generate
Publish directory: dist
```

#### Step 4: Deploy
Netlify auto-deploys on push to main branch

**Result:** Your site is live at `https://your-site.netlify.app`

---

### Option 3: Railway

**Best for:** Simplicity, generous free tier

#### Step 1: Create Railway Account
Visit https://railway.app

#### Step 2: Deploy
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

#### Step 3: Configure
Railway auto-detects Nuxt and configures everything

---

### Option 4: Self-Hosted (VPS/Dedicated Server)

**Best for:** Full control, custom domain

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Upload to Server
```bash
# Upload .output/ directory to server
scp -r .output/ user@yourserver.com:/var/www/diaspora/
```

#### Step 3: Install Node.js on Server
```bash
# On your server
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 4: Run with PM2
```bash
# Install PM2
npm install -g pm2

# Start app
cd /var/www/diaspora
pm2 start "node .output/server/index.mjs" --name "diaspora"

# Save PM2 config
pm2 startup
pm2 save
```

#### Step 5: Configure Nginx
```nginx
# /etc/nginx/sites-available/diaspora
server {
    listen 80;
    server_name yourdomain.com;

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

#### Step 6: Enable SSL
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

---

## 📦 Environment Variables

Create `.env` or `.env.production`:

```env
# Site Configuration
NUXT_PUBLIC_SITE_TITLE=Diaspora
NUXT_PUBLIC_SITE_SUBTITLE=My Blog
NUXT_PUBLIC_SITE_DESCRIPTION=A beautiful blog

# Optional
NITRO_PRERENDER_ROUTES=/sitemap.xml
```

---

## 🔍 Post-Deployment Verification

After deployment, verify:

1. **Homepage loads** - Visit your domain
2. **Posts display** - Check sample posts
3. **Navigation works** - Click links
4. **Mobile responsive** - Test on phone
5. **Categories/tags work** - Navigate through them
6. **No 404 errors** - Check browser console
7. **Performance** - Check Google PageSpeed
8. **SSL works** - Should show 🔒

---

## 📊 Performance Optimization

### Enable Compression
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml']
    },
    compressPublicAssets: true,
  }
})
```

### Image Optimization
```bash
# Install image optimizer
npm install -g imagemin imagemin-mozjpeg imagemin-pngquant
```

### Cache Configuration
```javascript
// For Vercel
export default defineNuxtConfig({
  routeRules: {
    '/api/**': { cache: { maxAge: 60 * 10 } },
    '/public/**': { cache: { maxAge: 60 * 60 * 24 * 365 } },
  }
})
```

---

## 🔐 Security Best Practices

### 1. Environment Variables
Never commit secrets to git:
```bash
# .gitignore
.env
.env.*.local
node_modules/
.nuxt/
dist/
```

### 2. Headers
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})
```

### 3. HTTPS Only
Redirect HTTP to HTTPS on your server

### 4. Rate Limiting
```javascript
// server/api/posts.ts
export default defineEventHandler(async (event) => {
  // Add rate limiting middleware
  const ip = getHeader(event, 'x-forwarded-for')
  // ... rate limit logic
})
```

---

## 🔄 Continuous Deployment (CD)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 📈 Monitoring

### Google Analytics
```javascript
// nuxt.config.ts
modules: [
  ['@nuxtjs/google-analytics', {
    id: 'UA-XXXXXXXXX-X'
  }]
]
```

### Sentry (Error Tracking)
```bash
npm install @sentry/nuxt
```

```javascript
// nuxt.config.ts
modules: [
  ['@sentry/nuxt/module', {
    dsn: 'YOUR_SENTRY_DSN',
    release: '1.0.0'
  }]
]
```

---

## 🆘 Troubleshooting

### 404 on Custom Routes
```javascript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Prerender all posts
    '/post/**': { prerender: true },
    '/category/**': { prerender: true },
  }
})
```

### Images Not Loading
```bash
# Ensure public folder exists
mkdir public/images

# Add images before build
npm run build
```

### Build Size Too Large
```bash
# Analyze bundle
npm install -D @nuxt/bundle-analyzer

# Then check with
npm run build -- --analyze
```

### Slow First Load
- Enable SSR for better performance
- Prerender static routes
- Use CDN for static assets
- Optimize images

---

## 🎯 Domain Setup

### Add Custom Domain on Vercel
```bash
# CLI
vercel domain add yourdomain.com

# Or use Vercel Dashboard
# Project → Settings → Domains → Add
```

### Update DNS
Add these records to your DNS provider:

```
Type    Name              Value
A       yourdomain.com    76.76.19.21
CNAME   www               cname.vercel-dns.com
```

---

## 📝 Post-Launch Checklist

- [ ] Domain configured
- [ ] SSL certificate installed (🔒 showing)
- [ ] Sitemap generated (`/sitemap.xml`)
- [ ] Robots.txt created
- [ ] Google Search Console linked
- [ ] Social media previews working
- [ ] Analytics installed
- [ ] Backups configured
- [ ] Error monitoring enabled
- [ ] Performance monitoring enabled

---

## 🎉 You're Live!

Your Nuxt 3 blog is now deployed and accessible globally. 

### Next Steps:
1. Share your blog on social media
2. Add your blog to search engines
3. Write more amazing posts
4. Promote your content
5. Monitor analytics

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Nuxt Deployment: https://nuxt.com/docs/guide/deploy
- Railway Docs: https://docs.railway.app

---

**Congratulations on launching your blog!** 🚀✨
