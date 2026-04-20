# Diaspora Node.js - Migration Guide

## Overview

This document outlines the migration from the original WordPress Diaspora theme to a modern Node.js/Express application.

## What Changed

### Architecture
- **Before**: PHP WordPress plugin/theme
- **After**: Node.js Express app with markdown-based content

### Data Storage
- **Before**: WordPress database (posts, categories, tags in MySQL)
- **After**: Markdown files in `data/posts/` directory with YAML frontmatter

### Template Engine
- **Before**: PHP templates
- **After**: EJS templates (similar syntax for familiarity)

### Content Format
- **Before**: WordPress Post Editor
- **After**: Markdown with YAML frontmatter

## Migration Steps for Existing Content

### From WordPress to Markdown

If you have existing WordPress posts, follow these steps:

1. **Export Posts**
   - Use WordPress export tool (Tools → Export → All Content)
   - Or use a WordPress to Markdown plugin

2. **Convert to Markdown**
   - Run the WordPress XML through a converter
   - Extract post content, metadata, and featured images

3. **Format for Diaspora**
   ```
   data/posts/2024-01-15-post-title.md
   ```

4. **Add YAML Frontmatter**
   ```yaml
   ---
   title: Post Title
   date: 2024-01-15 10:30:00
   categories:
     - Category1
   tags:
     - tag1
     - tag2
   cover: /img/featured-image.jpg
   ---
   
   # Post Content
   ...
   ```

5. **Copy Images**
   - Place images in `public/img/`
   - Update cover URLs to match

### From Hexo to Markdown

If migrating from Hexo theme:

1. Copy posts from `source/_posts/` to `data/posts/`
2. Verify YAML frontmatter format matches
3. Adjust category/tag structure if needed

## Features Preserved

✅ Homepage with post list
✅ Single post pages
✅ Archive page (year/month grouping)
✅ Category pages
✅ Tag pages
✅ AJAX preview mode
✅ Audio player
✅ Mathematics support (MathJax)
✅ Gitalk comments
✅ SEO meta tags
✅ Responsive design
✅ Social links
✅ Custom navigation menu

## New Features

🆕 File-based content (easier version control)
🆕 Built-in search API
🆕 JSON API endpoints
🆕 Simplified deployment
🆕 Modern Node.js stack
🆕 Markdown support with plugins

## Breaking Changes

⚠️ **Static Site**: No longer static HTML, requires Node.js runtime
⚠️ **Admin Panel**: No built-in admin panel, edit markdown files directly
⚠️ **Database**: No database support, file-based only
⚠️ **Plugins**: No plugin ecosystem, features are hard-coded
⚠️ **Theme Switching**: Theme is compiled in, no runtime switching

## File Structure Mapping

### Old (WordPress/Hexo)
```
wp-content/themes/diaspora/  OR  hexo-theme-diaspora/
├── header.php / layout/
├── footer.php
├── functions.php / lib/
├── style.css
└── js/
```

### New (Node.js)
```
diaspora-node/
├── views/
│   ├── layout.ejs
│   └── partials/
├── public/
│   ├── css/
│   └── js/
├── config.js
└── data/posts/
```

## Configuration Migration

### WordPress config.php
```php
<?php
define('USE_TIMTHUMB', false);
?>
```

### Node.js config/config.yml
```yaml
title: My Blog
subtitle: Subtitle
pagination:
  postsPerPage: 10
```

## Deployment Migration

### Before (Static/PHP)
- Push to GitHub Pages / static host
- Or deploy to PHP server (shared hosting, cPanel)

### After (Node.js)
- Deploy to Node.js host (Heroku, Railway, Fly.io, VPS)
- Or Docker container
- PM2 for process management

Example PM2 config:
```javascript
module.exports = {
  apps: [{
    name: 'diaspora',
    script: './app.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

## API Changes

### Old Routes (WordPress)
```
/                          # Homepage
/?paged=2                  # Pagination
/2024/01/15/post-slug/    # Post
/category/category-name/   # Category
/tag/tag-name/            # Tag
```

### New Routes (Express)
```
/                          # Homepage
/?page=2                   # Pagination
/post/post-slug           # Post
/category/category-name    # Category
/tag/tag-name             # Tag
/api/posts                # JSON API
/search?q=keyword         # Search
```

## Performance Considerations

### Database Queries → File Scanning
- First startup scans all markdown files
- Results cached in memory
- Cache updates on interval or file changes
- Suitable for < 1000 posts

### For Large Sites (1000+ posts)
- Consider adding database layer
- Implement incremental file scanning
- Use Redis for caching

## Troubleshooting Migration

**Posts not showing**
- Verify file location: `data/posts/YYYY-MM-DD-slug.md`
- Check YAML frontmatter format
- Run `npm run validate-posts` to check syntax

**Images not loading**
- Copy images to `public/img/`
- Update cover URLs to `/img/filename.jpg`
- Check file permissions

**Site not starting**
- Run `npm install` to ensure dependencies installed
- Check Node.js version (14+ required)
- Check for port conflicts (default 3000)
- Review console logs for errors

**SEO issues**
- Verify sitemap generation
- Check meta tags in head.ejs
- Submit sitemap to search engines
- Update robots.txt if needed

## Rollback Plan

Keep backup of original content:
```bash
# Backup before migration
cp -r original/posts backup/

# If needed, restore
cp -r backup/posts original/
```

Markdown files are version-controlled, so you can always revert in git.

## Next Steps

1. ✅ Extract content from old system
2. ✅ Convert to markdown format
3. ✅ Place in `data/posts/`
4. ✅ Test locally
5. ✅ Configure `config.yml`
6. ✅ Deploy to Node.js host
7. ✅ Setup redirects (if migrating from old URL structure)
8. ✅ Monitor and optimize

---

For questions or issues, refer to the main README.md or check the configuration examples.
