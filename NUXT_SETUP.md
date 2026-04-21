# 🚀 Nuxt 3 Migration - Complete Setup Guide

This is the **Phase 2: Full Nuxt.js Migration** of the Diaspora blog platform. Complete rewrite from Express.js + EJS to Nuxt 3 with Vue 3 Composition API and Genshin-inspired UI.

---

## 📋 Project Overview

**What's New:**
- ✅ Full Nuxt 3 framework with Vue 3 Composition API
- ✅ TypeScript for type safety
- ✅ Server-side rendering (SSR) ready
- ✅ Automatic code splitting and lazy loading
- ✅ Advanced Genshin-inspired UI with animations
- ✅ Multi-language routing system (10 languages)
- ✅ Automatic mobile detection with `/m/` routing
- ✅ Complete markdown + YAML frontmatter support
- ✅ File-based routing (no manual routing needed)
- ✅ Auto-registered components
- ✅ Composables for shared logic

**Stack:**
- **Framework:** Nuxt 3.9.0 + Vue 3.4.0
- **Runtime:** Nitro (for SSR & API routes)
- **Language:** TypeScript 5.3.0
- **Content:** Markdown-it + YAML
- **Styling:** CSS3 with animations & gradients
- **Build:** Vite (automatic)

---

## 🛠️ Installation & Setup

### Step 1: Install Dependencies

```bash
cd c:\Users\Admin\Downloads\Shizue

# Clean install
npm install

# Or with yarn
yarn install
```

### Step 2: Create Data Directory

Nuxt looks for markdown posts in `/data/posts/`. Create sample posts:

```bash
# Create directory
mkdir data
mkdir data/posts

# Create sample post: data/posts/hello-world.md
```

**Sample Post Format:**

```markdown
---
title: "Hello World"
date: "2024-01-15"
author: "Your Name"
excerpt: "This is the first post on our Genshin-inspired blog"
categories:
  - "Announcements"
tags:
  - "welcome"
  - "first-post"
cover: "/images/sample-cover.jpg"
---

# Welcome to Diaspora Nuxt!

This is your first blog post. You can write markdown content here with full support for:

- Lists
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- `code snippets`
- And more!

## Subheading

Start writing your amazing content!
```

### Step 3: Development Server

```bash
npm run dev
# Server runs at http://localhost:3000
```

Visit `http://localhost:3000` in your browser. You should see:
- ✨ Genshin loading animation
- 🎨 Modern gradient UI
- 📱 Responsive design
- ⚡ Hot module replacement (HMR)

---

## 📁 Project Structure

```
c:\Users\Admin\Downloads\Shizue\
├── nuxt.config.ts              # Nuxt configuration
├── app.vue                      # Root component
├── package.json                 # Dependencies

├── pages/                       # Auto-routed pages
│   ├── index.vue               # Homepage
│   ├── 404.vue                 # 404 page
│   ├── post/
│   │   └── [slug].vue          # Single post
│   ├── category/
│   │   └── [category].vue      # Category posts
│   └── tag/
│       └── [tag].vue           # Tagged posts

├── components/                  # Auto-registered components
│   └── GenshinLoader.vue        # Loading animation

├── composables/                 # Logic sharing
│   ├── useLanguageDetection.ts
│   ├── useMobileDetection.ts
│   └── usePostFetching.ts

├── layouts/
│   └── default.vue             # Main layout (header/nav/footer)

├── server/
│   └── routes/
│       └── api/
│           ├── posts.ts        # Get all posts
│           ├── categories.ts   # Get all categories
│           ├── tags.ts         # Get all tags
│           ├── posts/
│           │   └── [slug].ts   # Get single post
│           ├── categories/
│           │   └── [category].ts # Posts by category
│           └── tags/
│               └── [tag].ts    # Posts by tag

├── assets/
│   └── css/
│       ├── genshin-loader.css
│       ├── genshin-polish.css
│       ├── diaspora.css
│       └── global.css

├── middleware/                  # Client middleware (optional)
└── utils/                      # Utility functions (optional)

├── data/
│   └── posts/                  # Your markdown posts go here
│       ├── hello-world.md
│       └── another-post.md

└── NUXT_SETUP.md              # This file
```

---

## 🔧 Configuration Files

### nuxt.config.ts

Central configuration for Nuxt. Already pre-configured with:

```typescript
export default defineNuxtConfig({
  // Metadata
  app: {
    head: {
      title: 'Diaspora - Genshin Inspired Blog',
      meta: [
        { charset: 'utf-8' },
        { viewport: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // Modules
  modules: [
    '@nuxt/content',
    '@vueuse/nuxt',
  ],

  // CSS imports
  css: [
    '~/assets/css/genshin-loader.css',
    '~/assets/css/genshin-polish.css',
    '~/assets/css/diaspora.css',
    '~/assets/css/global.css',
  ],

  // Runtime config (environment variables)
  runtimeConfig: {
    public: {
      siteTitle: 'Diaspora',
      siteSubtitle: 'A Modern Blog Platform',
      siteDescription: 'Experience the beauty of content with Genshin-inspired design',
      siteKeywords: 'blog, diaspora, genshin',
    },
  },

  // Dev server
  devServer: {
    host: 'localhost',
    port: 3000,
  },
})
```

**To customize:**
1. Edit `runtimeConfig.public` for site settings
2. Add CSS imports for new stylesheets
3. Add modules for extra functionality

---

## 📝 Adding Blog Posts

Posts are markdown files in `/data/posts/`. Each post needs YAML frontmatter:

### Create New Post

```bash
# Create file: data/posts/my-awesome-post.md
```

```markdown
---
title: "My Awesome Post"
date: "2024-01-20"
author: "Author Name"
excerpt: "A brief description of this post"
categories:
  - "Technology"
  - "Web Development"
tags:
  - "nuxt"
  - "vue"
  - "blog"
cover: "/images/my-cover.jpg"
---

# Your Content Here

Your markdown content with full support for all markdown features.
```

### Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Post title |
| date | string (YYYY-MM-DD) | Yes | Publication date |
| author | string | Yes | Author name |
| excerpt | string | No | Short description |
| categories | string[] | No | Category names |
| tags | string[] | No | Tag names |
| cover | string | No | Cover image URL |
| content | markdown | Yes | Post content (after frontmatter) |

---

## 🎨 Styling & Customization

### CSS Files

Located in `/assets/css/`:

1. **genshin-loader.css** - Loading animation
2. **genshin-polish.css** - Genshin UI effects
3. **diaspora.css** - Original Diaspora styling
4. **global.css** - Global styles (create if needed)

### Color Palette

```css
--primary: #667eea      /* Purple */
--secondary: #764ba2    /* Darker purple */
--accent: #f093fb       /* Pink */
--dark-bg: #0a0e27      /* Dark background */
--card-bg: #1a1a3a      /* Card background */
--text: #ffffff         /* Main text */
--text-secondary: #a8a8a8 /* Secondary text */
```

### Customizing Colors

Edit `/assets/css/global.css` or modify inline styles in components:

```vue
<style scoped>
.element {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}
</style>
```

---

## 🔀 Routing System

### Automatic Routes

Routes are auto-generated from `/pages/` directory:

| File | URL |
|------|-----|
| `pages/index.vue` | `/` |
| `pages/404.vue` | `/404` |
| `pages/post/[slug].vue` | `/post/hello-world` |
| `pages/category/[category].vue` | `/category/Technology` |
| `pages/tag/[tag].vue` | `/tag/nuxt` |

### Creating New Routes

1. Create file in `/pages/` directory
2. Route is automatically available
3. Use `<NuxtLink>` for navigation

```vue
<!-- In components -->
<NuxtLink to="/">Home</NuxtLink>
<NuxtLink to="/post/hello-world">My Post</NuxtLink>
```

---

## 🌐 Multi-Language Support

### Supported Languages

- English (en)
- Japanese (ja)
- Korean (ko)
- Chinese (zh)
- French (fr)
- German (de)
- Spanish (es)
- Portuguese (pt)
- Russian (ru)
- Indonesian (id)

### How It Works

1. Language detected from URL: `/en/post/hello-world`
2. Falls back to browser language
3. Falls back to localStorage preference
4. Falls back to English

### Using Language Detection

```vue
<script setup>
import { useLanguageDetection } from '~/composables/useLanguageDetection'

const { getCurrentLanguage, setLanguage } = useLanguageDetection()

// Get current language
const lang = getCurrentLanguage() // 'en'

// Change language
setLanguage('ja') // Switches to Japanese
</script>
```

---

## 📱 Mobile Detection

### How It Works

1. Detects mobile devices automatically
2. Can redirect to `/m/` version (optional)
3. Uses user-agent + touch points + screen width

### Using Mobile Detection

```vue
<script setup>
import { useMobileDetection } from '~/composables/useMobileDetection'

const { detectMobileDevice } = useMobileDetection()

const isMobile = detectMobileDevice() // true/false
</script>
```

---

## 🔌 API Endpoints

All API endpoints are in `/server/routes/api/`:

### Available Endpoints

```
GET  /api/posts                    # Get all posts
GET  /api/posts/[slug]             # Get single post
GET  /api/categories               # Get all categories
GET  /api/categories/[category]    # Get posts by category
GET  /api/tags                     # Get all tags
GET  /api/tags/[tag]               # Get posts by tag
GET  /api/search?q=query           # Search posts (optional)
```

### Response Format

```json
{
  "slug": "hello-world",
  "title": "Hello World",
  "date": "2024-01-15",
  "author": "Author Name",
  "categories": ["Announcements"],
  "tags": ["welcome"],
  "excerpt": "Post excerpt...",
  "content": "<h1>HTML content</h1>...",
  "cover": "/images/cover.jpg"
}
```

### Using API in Components

```vue
<script setup>
import { usePostFetching } from '~/composables/usePostFetching'

const { posts, fetchPosts } = usePostFetching()

onMounted(async () => {
  await fetchPosts()
  console.log(posts.value) // Array of posts
})
</script>
```

---

## 🎯 Composables

Composables are reusable logic functions in `/composables/`:

### usePostFetching.ts

Data fetching for posts, categories, and tags:

```typescript
// Fetch all posts
const { posts } = await fetchPosts()

// Fetch single post
const post = await fetchPost('hello-world')

// Fetch categories
const categories = await fetchCategories()

// Filter by category
const catPosts = await fetchPostsByCategory('Technology')

// Filter by tag
const tagPosts = await fetchPostsByTag('nuxt')

// Search
const results = await searchPosts('query')
```

### useLanguageDetection.ts

Multi-language support:

```typescript
// Get current language
const lang = getCurrentLanguage()

// Change language
setLanguage('ja')

// Detect browser language
const browserLang = detectBrowserLanguage()
```

### useMobileDetection.ts

Mobile device detection:

```typescript
// Check if mobile
const isMobile = detectMobileDevice()

// Handle mobile redirect
handleMobileRedirect()
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
# Generates .output/ directory
```

### Generate Static Site (Prerendering)

```bash
npm run generate
# Creates static files in .output/public/
```

### Preview Production Build

```bash
npm run preview
# Test production build locally
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build
npm run generate

# Deploy .output/public/ directory
# Or connect GitHub repo for auto-deploy
```

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

```bash
# Use different port
npm run dev -- --port 3001
```

### Issue: Posts not loading

1. Check `/data/posts/` directory exists
2. Verify markdown files have `.md` extension
3. Check YAML frontmatter format
4. Check console for errors: `npm run dev`

### Issue: Images not loading

1. Place images in `/public/` directory
2. Reference as `/images/my-image.jpg`
3. Or use full URLs: `https://example.com/image.jpg`

### Issue: Styles not applying

1. Check CSS file is imported in `nuxt.config.ts`
2. Use `scoped` attribute for component styles
3. Clear `.nuxt/` folder: `rm -rf .nuxt/`
4. Restart dev server

### Issue: Components not found

- Auto-registered components must be in `/components/`
- Use PascalCase file names: `MyComponent.vue`
- Reference in templates without imports

---

## 📚 Key Files to Know

### app.vue
Root component - loads GenshinLoader and initializes language/mobile detection

### layouts/default.vue
Main layout with header, navigation, footer - wraps all pages

### pages/index.vue
Homepage with hero, carousel, posts grid, categories

### nuxt.config.ts
Central configuration for entire app

### composables/*.ts
Reusable logic for data fetching, language detection, mobile detection

---

## 🎓 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Create sample posts in `/data/posts/`
3. ✅ Run development server: `npm run dev`
4. ✅ Customize colors and fonts
5. ✅ Add your own markdown posts
6. ✅ Deploy to production

---

## 📖 Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [Markdown-it Documentation](https://github.com/markdown-it/markdown-it)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

## ❓ Need Help?

Check the following:
1. Error console in browser (F12)
2. Terminal output from `npm run dev`
3. File paths and spelling
4. YAML frontmatter formatting
5. Image paths and URLs

---

**Version:** 2.0.0 (Nuxt 3 Migration)  
**Last Updated:** 2024-01-20  
**License:** MIT
