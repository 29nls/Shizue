# 🗄️ Database Setup Guide - Phase 3.1

**Status:** In Progress  
**Complexity:** High  
**Time Required:** 30-45 minutes  
**Prerequisites:** Node.js 18+, npm

---

## 📋 Quick Start (5 minutes)

### For Local Development (SQLite - Fastest)
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Set database (SQLite for dev)
# Edit .env.local and change:
# DATABASE_URL="file:./dev.db"

# 4. Push schema to database
npm run db:push

# 5. Migrate existing JSON data
npm run db:seed

# 6. View database (optional)
npm run db:studio
```

**Done!** Database ready in ~5 minutes.

---

## 🐘 Full Setup (PostgreSQL for Production)

### Option A: Vercel Postgres (Recommended)

**Best for:** Production deployments, automatic backups

**Steps:**

1. **Create Vercel Project**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add Postgres Database**
   - Go to Vercel Dashboard → Project Settings
   - Click "Storage" → "Create Database"
   - Select "PostgreSQL"
   - Copy the `DATABASE_URL`

3. **Update Environment**
   ```bash
   # .env.local
   DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
   ```

4. **Push Schema**
   ```bash
   npm run db:push
   ```

5. **Migrate Data**
   ```bash
   npm run db:seed
   ```

**Cost:** Free tier available (256MB storage)

---

### Option B: Docker PostgreSQL (Local Development)

**Best for:** Testing production database locally

**Prerequisites:** Docker installed

**Steps:**

1. **Start PostgreSQL Container**
   ```bash
   docker run --name diaspora-db \
     -e POSTGRES_USER=diaspora \
     -e POSTGRES_PASSWORD=secretpass \
     -e POSTGRES_DB=diaspora \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Update .env.local**
   ```bash
   DATABASE_URL="postgresql://diaspora:secretpass@localhost:5432/diaspora"
   ```

3. **Push Schema**
   ```bash
   npm run db:push
   ```

4. **Migrate Data**
   ```bash
   npm run db:seed
   ```

**Useful Commands:**
```bash
# View logs
docker logs diaspora-db

# Stop container
docker stop diaspora-db

# Start again
docker start diaspora-db

# Connect with psql
psql postgresql://diaspora:secretpass@localhost:5432/diaspora
```

---

### Option C: Neon (PostgreSQL Hosting)

**Best for:** Simple, free PostgreSQL hosting

**Steps:**

1. **Sign up at https://console.neon.tech**

2. **Create Project**
   - Project Name: "Diaspora"
   - Select "PostgreSQL 15"

3. **Copy Connection String**
   - Under "Connection details"
   - Copy the "Connection string"

4. **Update .env.local**
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.neon.tech/diaspora?sslmode=require"
   ```

5. **Push Schema**
   ```bash
   npm run db:push
   ```

6. **Migrate Data**
   ```bash
   npm run db:seed
   ```

**Cost:** Free tier includes 10GB storage, 5 projects

---

## 🔧 Database Management Commands

### Initialize/Reset

```bash
# Push schema to database (create tables)
npm run db:push

# Create a new migration (after schema changes)
npm run db:migrate

# Reset database (dangerous! deletes all data)
npm run db:reset
```

### View & Debug

```bash
# Open Prisma Studio (visual database browser)
npm run db:studio

# Generate Prisma client (run automatically)
npm run db:generate

# Seed database from JSON files
npm run db:seed
```

### From Command Line (psql)

```bash
# Connect to PostgreSQL
psql postgresql://user:password@localhost:5432/diaspora

# List tables
\dt

# View posts table
SELECT * FROM "Post";

# Count posts
SELECT COUNT(*) FROM "Post";

# View comments
SELECT * FROM "Comment";

# Exit
\q
```

---

## 📊 Database Schema

### Tables Created

| Table | Purpose | Records |
|-------|---------|---------|
| `Post` | Blog posts | Auto-migrated |
| `Comment` | Post comments | Auto-migrated |
| `Subscriber` | Newsletter subscribers | Auto-migrated |
| `Image` | Uploaded images | Empty |
| `Draft` | Auto-saved drafts | Empty |
| `Analytics` | Page views & events | Empty |
| `Settings` | Site configuration | 1 default |

### Fields Overview

**Post Table**
```typescript
{
  id: string          // Unique ID
  title: string       // Post title
  excerpt: string?    // Short description
  slug: string        // URL-friendly name
  content: string     // Full markdown/HTML
  categories: string[] // Category names
  tags: string[]      // Tag names
  author: string      // Author name
  coverImage: string? // Featured image URL
  published: boolean  // Published status
  publishedAt: date?  // Publication date
  createdAt: date     // Creation date
  updatedAt: date     // Last update
  views: number       // View count
  comments: Comment[] // Related comments
}
```

**Comment Table**
```typescript
{
  id: string        // Unique ID
  postId: string    // Parent post
  author: string    // Commenter name
  email: string     // Commenter email
  content: string   // Comment text
  approved: boolean // Moderation status
  isSpam: boolean   // Spam flag
  createdAt: date   // Creation date
}
```

**Subscriber Table**
```typescript
{
  id: string        // Unique ID
  email: string     // Email address
  verified: boolean // Email verified
  active: boolean   // Subscription active
  mailchimpId: string? // Mailchimp ID
  createdAt: date   // Signup date
}
```

---

## 🚀 Migration Process (Automatic)

When you run `npm run db:seed`, the script will:

1. **Read all posts** from `data/posts/*.md`
   - Parse YAML frontmatter
   - Extract markdown content
   - Create Post records

2. **Read comments** from `data/comments.json`
   - Link to parent posts
   - Preserve approval status
   - Keep timestamps

3. **Read subscribers** from `data/subscribers.json`
   - Create Subscriber records
   - Preserve verification status
   - Keep signup dates

4. **Create settings**
   - Default site configuration
   - Ready for customization

**Output:**
```
🚀 Starting JSON → Database Migration

==================================================

📝 Migrating posts...
✅ Post "Post Title" migrated
✅ Post "Another Post" migrated

📊 Posts: 5 created

💬 Migrating comments...
✅ Comment from "John Doe" migrated
⏭️  Post "unknown" not found for comment, skipping...

📊 Comments: 3 created

📧 Migrating subscribers...
✅ Subscriber "user@example.com" migrated

📊 Subscribers: 2 created

⚙️  Creating default settings...
✅ Default settings created

==================================================

✅ Migration completed successfully!

📌 Next steps:
   1. Verify data in database: npx prisma studio
   2. Update API endpoints to use Prisma
   3. Test all features
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `.env.local` file created with `DATABASE_URL`
- [ ] `npm run db:push` completes without errors
- [ ] `npm run db:seed` runs and shows migrated records
- [ ] `npm run db:studio` opens and shows data
- [ ] Posts table has your existing posts
- [ ] Comments table has your existing comments
- [ ] Subscribers table has your email subscribers
- [ ] Settings table has 1 default entry

---

## 🐛 Troubleshooting

### Error: "P1000: Authentication failed"
- **Cause:** Wrong database credentials
- **Fix:** Check DATABASE_URL in .env.local
  ```bash
  # Check connection with psql
  psql $DATABASE_URL
  ```

### Error: "ENOENT: no such file or directory"
- **Cause:** SQLite database file not found
- **Fix:** Prisma will create it automatically on first push
  ```bash
  npm run db:push
  ```

### Error: "Prisma Client generation failed"
- **Cause:** Invalid schema
- **Fix:** Check schema.prisma syntax
  ```bash
  npm run db:generate
  ```

### Migration Script Not Running
- **Cause:** Missing dependencies
- **Fix:** Install tsx for running TypeScript
  ```bash
  npm install -D tsx
  npm run db:seed
  ```

### Data Not Migrating
- **Cause:** JSON files not found
- **Fix:** Check file paths:
  ```bash
  ls data/posts/
  ls data/comments.json
  ls data/subscribers.json
  ```

---

## 🔐 Security Best Practices

### Never Commit Secrets
```bash
# .gitignore (add these lines)
.env
.env.local
.env*.local
dev.db
```

### Protect Production Database
- ✅ Use strong passwords
- ✅ Enable SSL/TLS encryption
- ✅ Restrict IP access
- ✅ Enable database backups
- ✅ Use read-only replicas for analytics

### Vercel Postgres
- ✅ Already encrypted
- ✅ Automatic daily backups
- ✅ IP whitelisting available
- ✅ Connection pooling built-in

---

## 📈 Next Steps

After database is set up:

1. **Update API Endpoints** (Phase 3.2)
   - Replace JSON reads with Prisma queries
   - Update endpoints in `server/routes/api/*`

2. **Test All Features** (Phase 3.2)
   - Create posts via admin
   - Submit comments
   - Subscribe to newsletter

3. **Deploy** (Phase 3.6)
   - Set DATABASE_URL in Vercel
   - Deploy your app
   - Run migration in production

---

## 📚 Useful Resources

- **Prisma Docs:** https://www.prisma.io/docs/
- **Prisma Studio:** https://www.prisma.io/studio
- **Vercel Postgres:** https://vercel.com/docs/postgres
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Docker Postgres:** https://hub.docker.com/_/postgres
- **Neon Docs:** https://neon.tech/docs

---

## 🎯 Success Criteria

✅ Database connected and tables created  
✅ All existing data migrated  
✅ Prisma Studio shows correct data  
✅ Ready for Phase 3.2 (API updates)  

---

**Status:** Ready to configure  
**Next:** Run `npm install && npm run db:push && npm run db:seed`
