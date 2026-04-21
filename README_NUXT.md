# 🎨 Diaspora Nuxt 3 - Modern Blog Platform

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.9.0-00DC82)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3.4.0-4FC08D)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-3178C6)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)]()

A **modern, high-performance blog platform** built with Nuxt 3, Vue 3, and TypeScript. Features a beautiful Genshin Impact-inspired design with full multi-language support.

---

## ✨ Features

### 🎨 **Beautiful Design**
- Genshin Impact-inspired UI with gradients
- Dark theme optimized for reading
- Smooth animations and transitions
- Fully responsive (mobile-first)
- Glassmorphism effects

### ⚡ **High Performance**
- Server-side rendering (SSR)
- Automatic code splitting
- Instant hot reload (HMR)
- Optimized production builds
- Image optimization ready

### 🌍 **Multi-Language**
- 10 languages built-in
- Auto-detect browser language
- Easy language switching
- URL-based routing

### 📱 **Mobile First**
- Automatic mobile detection
- Touch-friendly interface
- Responsive layouts
- Mobile-optimized images

### 📝 **Content Management**
- Markdown with full formatting
- YAML frontmatter support
- Categories & tags
- Related posts
- Search functionality

### 🔐 **Type-Safe**
- Full TypeScript support
- IDE autocomplete
- Runtime type checking
- Better error messages

### 🚀 **Developer Friendly**
- Auto-imports & auto-routing
- Composables pattern
- Well-documented
- Easy to customize
- Production-ready

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Visit http://localhost:3000
```

Done! Your blog is running. 🎉

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| [INDEX.md](./INDEX.md) | Main entry point - Start here! |
| [QUICK_START.md](./QUICK_START.md) | 5-minute quick setup |
| [NUXT_SETUP.md](./NUXT_SETUP.md) | Comprehensive setup guide |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |
| [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) | What's included & features |
| [FILE_INVENTORY.md](./FILE_INVENTORY.md) | Complete file listing |

---

## 🎯 What's Included

### Pages (5)
- Homepage with hero, carousel, stats
- Single post with full content
- Category & tag filtering
- Beautiful 404 error page

### API Endpoints (7)
- Get all posts
- Get single post
- List categories
- Filter by category
- List tags
- Filter by tag

### Components
- Animated Genshin loader
- Responsive layout system
- Styled cards and grids

### Features
- Multi-language support (10 languages)
- Mobile device detection
- Smooth animations
- SEO meta tags
- Related posts

---

## 📝 Creating Posts

Create a markdown file in `data/posts/`:

```markdown
---
title: "My First Post"
date: "2024-01-20"
author: "Your Name"
excerpt: "Short description"
categories:
  - "Technology"
tags:
  - "nuxt"
  - "vue"
cover: "/images/cover.jpg"
---

# Your Content

Write your amazing content in markdown!
```

Post automatically appears on homepage! ✨

---

## 🛠️ Technology Stack

```
Frontend:
  ✓ Nuxt 3.9.0 - Full-stack Vue framework
  ✓ Vue 3.4.0 - Progressive UI framework
  ✓ TypeScript 5.3.0 - Type-safe JavaScript
  ✓ Vite - Lightning-fast build tool

Content:
  ✓ Markdown-it 13.0.0 - Markdown parser
  ✓ YAML 2.4.0 - Frontmatter parsing

Utilities:
  ✓ @vueuse/core - Vue utilities
  ✓ Moment.js - Date formatting
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run generate
# Deploy .output/public/
```

### Self-Hosted
```bash
npm run build
# Copy .output/ to your server
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

---

## 📋 Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run generate  # Generate static site
```

---

## ✅ Project Status

- ✅ **5 Page Components** - All fully styled
- ✅ **7 API Endpoints** - Complete data layer
- ✅ **3 Composables** - Reusable logic
- ✅ **Multi-language** - 10 languages built-in
- ✅ **Mobile Support** - Automatic detection
- ✅ **Animations** - Smooth transitions
- ✅ **Documentation** - 1000+ lines
- ✅ **Production Ready** - Deploy immediately

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🎉 Getting Started

```bash
npm install && npm run dev
```

Visit **http://localhost:3000** ✨

---

**Version:** 2.0.0 | **Status:** ✅ Production Ready  
*Diaspora Nuxt - A modern blog platform for the web.*
