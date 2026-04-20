# Diaspora Node.js - Modern Blog Platform

A beautiful, minimal blog platform built with Node.js and Express. Migrated from the classic Diaspora WordPress theme to a modern, standalone Node.js application.

## 🌟 Features

- **Markdown-based Content**: Write posts in clean Markdown with YAML frontmatter
- **Tags & Categories**: Organize posts with flexible taxonomy
- **Full-Text Search**: Built-in search functionality
- **Responsive Design**: Beautiful UI that works on all devices
- **Fast Performance**: Server-side rendering with intelligent caching
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards
- **AJAX Navigation**: Smooth preview loading without page refresh
- **Audio Player**: Embed music in posts
- **Math Support**: Optional MathJax rendering
- **Comments**: Gitalk integration for discussions
- **Customizable**: Easy to modify and extend

## 📋 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd diaspora-node

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Create sample posts (already included)
# Posts go in data/posts/

# Start the server
npm start
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
diaspora-node/
├── app.js                          # Express app entry point
├── config.js                       # Configuration loader
├── config/
│   └── config.yml                 # Site configuration
├── routes/                         # Express routes
├── controllers/                    # Business logic
├── services/                       # Data layer
│   ├── postService.js             # Post management
│   ├── markdownService.js         # Markdown rendering
│   └── metadataService.js         # Archives, tags, categories
├── middleware/                     # Custom middleware
├── views/                          # EJS templates
│   ├── layout.ejs                 # Main layout
│   ├── index.ejs                  # Homepage
│   ├── post.ejs                   # Single post
│   ├── archive.ejs                # Archive page
│   ├── category.ejs               # Category page
│   ├── tag.ejs                    # Tag page
│   └── partials/                  # Reusable components
├── public/                         # Static assets
│   ├── css/
│   ├── js/
│   └── img/
├── data/
│   ├── posts/                     # Markdown blog posts
│   └── pages/                     # Static pages
├── scripts/                        # Utility scripts
└── tests/                          # Test suites
```

## 📝 Creating Posts

Create markdown files in `data/posts/` with the naming convention: `YYYY-MM-DD-slug.md`

### Post Format

```markdown
---
title: My Awesome Post
date: 2024-01-15 10:30:00
updated: 2024-01-16 14:20:00
categories:
  - Technology
  - Tutorial
tags:
  - nodejs
  - javascript
  - express
cover: /img/post-cover.jpg
mp3: /audio/background-music.mp3
autoplay: false
excerpt: A short excerpt of the post
keywords: keyword1, keyword2
---

# Your post content here

Write your post using Markdown syntax.

## Features

- Lists
- **Bold** and *italic*
- `Code`
- [Links](https://example.com)

```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| title | Yes | Post title |
| date | Yes | Publication date (ISO format) |
| updated | No | Last update date |
| categories | No | Array of categories |
| tags | No | Array of tags |
| cover | No | Featured image URL |
| mp3 | No | Audio file URL for player |
| autoplay | No | Auto-play audio (default: false) |
| excerpt | No | Short summary (auto-generated if omitted) |
| keywords | No | SEO keywords |

## ⚙️ Configuration

Edit `config/config.yml` to customize your blog:

```yaml
# Site
title: My Blog
subtitle: A subtitle
description: Blog description
author: Your Name

# URLs
url: https://example.com
root: /

# Menu
menu:
  首页: /
  分类: /categories
  标签: /tags
  归档: /archives

# Features
local_search:
  enable: false

hitokoto: true
mathjax: false

# Pagination
pagination:
  postsPerPage: 10

# External Services
gitalk:
  enable: false
  clientID: ''
  clientSecret: ''
  repo: ''
  owner: ''

# Beian (Chinese ICP License)
beian:
  enable: false
  beianInfo: ''
```

Also configure runtime settings in `.env`:

```bash
PORT=3000
NODE_ENV=development
SITE_TITLE=My Blog
SITE_AUTHOR=Your Name
GOOGLE_ANALYTICS_ID=UA-XXXXX-X
```

## 🚀 Running the Server

### Development

```bash
npm run dev    # With auto-reload (requires nodemon)
npm start      # Standard start
```

### Production

```bash
NODE_ENV=production npm start
```

For production deployments, consider using PM2:

```bash
npm install -g pm2

# Start with PM2
pm2 start app.js --name "diaspora"
pm2 save
pm2 startup
```

## 📚 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with post list |
| `/post/:slug` | Single post page |
| `/archive` | Archive page |
| `/category/:name` | Posts in category |
| `/tag/:name` | Posts with tag |
| `/search?q=...` | Search API |
| `/api/posts` | All posts (JSON) |
| `/api/posts/:slug` | Single post (JSON/HTML) |
| `/api/meta` | Metadata (categories, tags, archives) |

## 🔍 Search

Two search modes are available:

### Server-side Search
```
GET /search?q=keyword
```

Returns JSON with matching posts.

### Client-side Search
Include the search JavaScript library and use the local search index at `/api/search/index`.

## 🎨 Customization

### Styling

Edit `public/css/diaspora.css` to customize colors and layout.

### Templates

Modify EJS templates in `views/` to change HTML structure:
- `layout.ejs` - Main wrapper
- `index.ejs` - Homepage
- `post.ejs` - Single post
- `partials/` - Reusable components

### JavaScript

Enhance frontend interactivity in `public/js/diaspora.js`:
- AJAX preview loading
- History API integration
- Audio player initialization
- MathJax rendering

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
```

## 📦 Dependencies

- **Express.js** - Web framework
- **EJS** - Template engine
- **markdown-it** - Markdown parser
- **YAML** - Configuration format
- **Moment.js** - Date formatting
- **Lodash** - Utility functions
- **Helmet** - Security headers
- **Morgan** - Request logging
- **Compression** - Response compression

## 🔧 Utility Scripts

### Generate Search Index
```bash
node scripts/generate-index.js
```

Creates a JSON search index from all posts.

### Validate Posts
```bash
node scripts/validate-posts.js
```

Checks all markdown files for proper frontmatter and structure.

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to Other Platforms

1. Push code to GitHub/GitLab
2. Connect to deployment service (Vercel, Railway, Fly.io, etc.)
3. Set environment variables
4. Deploy!

## 📝 License

MIT License - feel free to use and modify.

## 🤝 Contributing

Contributions welcome! Please submit issues and pull requests.

## 💡 Tips & Tricks

### Custom Domain
Configure your domain in the hosting provider and update `config.yml` with the correct URL.

### Static Assets
Place images, PDFs, and other files in `public/img/` and reference them as `/img/filename`.

### Social Links
Configure social links in `config.yml` under the `links` section.

### Analytics
Add Google Analytics ID in `.env` to track visitors.

### SEO
- Fill in site description and keywords
- Use meaningful post titles and excerpts
- Add cover images to posts
- Create proper category and tag structure

## 🐛 Troubleshooting

### Posts not showing?
- Check that files are in `data/posts/`
- Verify YAML frontmatter format
- Check file naming convention: `YYYY-MM-DD-slug.md`

### Styles not loading?
- Check that `diaspora.css` exists in `public/css/`
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors

### Search not working?
- Enable in `config.yml` under `local_search`
- Run `npm run generate-index` to create search index
- Check that posts have proper frontmatter

### Audio player not working?
- Verify file paths are correct and accessible
- Check browser console for CORS errors
- Use absolute URLs for external audio files

## 📞 Support

For questions and support:
- Check the documentation
- Review example posts in `data/posts/`
- Check configuration examples
- Submit GitHub issues

---

**Built with ❤️ using Node.js and Express**

Happy blogging! 🎉
