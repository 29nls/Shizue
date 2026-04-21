# 🚀 Quick Start Guide - Diaspora Nuxt

Get your Genshin-inspired blog running in **5 minutes**!

---

## Step 1: Install Dependencies (2 min)

```bash
cd c:\Users\Admin\Downloads\Shizue
npm install
```

This installs all required packages:
- Nuxt 3
- Vue 3
- TypeScript
- Markdown-it
- And more...

---

## Step 2: Start Development Server (1 min)

```bash
npm run dev
```

**Output:**
```
✔ Ready on http://localhost:3000
```

Open your browser and visit: **http://localhost:3000** ✨

---

## Step 3: See It Working! (2 min)

You'll see:
- ✨ Beautiful Genshin loading animation
- 🎨 Modern homepage with hero section
- 📰 Featured posts carousel
- 📊 Stats section
- 🏷️ Category grid
- 📱 Fully responsive design

---

## 📝 Add Your First Post

Create a new markdown file: `data/posts/my-post.md`

```markdown
---
title: "My First Post"
date: "2024-01-20"
author: "Your Name"
excerpt: "This is my first post!"
categories:
  - "Hello"
tags:
  - "first"
cover: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=800&q=80"
---

# Hello World!

This is my first blog post. I can write **bold**, *italic*, and even `code`!

## Subheading

More content here...
```

**Save the file** → Post automatically appears on homepage! 🎉

---

## 🌐 View Your Posts

- **Homepage**: http://localhost:3000
- **Single post**: http://localhost:3000/post/my-post
- **Categories**: http://localhost:3000/category/hello
- **Tags**: http://localhost:3000/tag/first

---

## 🎨 Customize Colors

Edit `nuxt.config.ts` to change site title:

```typescript
runtimeConfig: {
  public: {
    siteTitle: 'My Awesome Blog',  // Change this!
    siteSubtitle: 'My thoughts on...',
    siteDescription: 'A personal blog'
  }
}
```

Restart server: `Ctrl+C` then `npm run dev`

---

## 🚀 Deploy to Production

### Build for production:
```bash
npm run build
```

### Generate static site:
```bash
npm run generate
```

### Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

---

## 📚 File Structure

```
c:\Users\Admin\Downloads\Shizue\
├── data/posts/                    # Your blog posts
├── pages/index.vue                # Homepage
├── nuxt.config.ts                 # Configuration
├── package.json                   # Dependencies
└── NUXT_SETUP.md                  # Full documentation
```

---

## 🔧 Available Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run generate      # Generate static site
```

---

## 💡 Next Steps

1. ✅ Add more posts to `/data/posts/`
2. ✅ Customize colors and fonts
3. ✅ Add your own logo
4. ✅ Deploy to production
5. ✅ Share with the world! 🎉

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- --port 3001` |
| Posts not showing | Check `/data/posts/` directory exists |
| Styles not loading | Restart dev server |
| Component error | Clear `.nuxt/` folder and restart |

---

## 📖 Learn More

- Read [NUXT_SETUP.md](./NUXT_SETUP.md) for detailed guide
- Check [Nuxt 3 Docs](https://nuxt.com)
- View [Vue 3 Docs](https://vuejs.org)

---

**Happy blogging!** 🎨✨
