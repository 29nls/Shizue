const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const slugify = require('slugify');
const config = require('../config');
const markdownService = require('./markdownService');

class PostService {
  constructor() {
    this.cache = {};
    this.postsList = null;
    this.lastScanTime = 0;
    this.scanInterval = 5000; // Rescan every 5 seconds in dev, less in prod
  }

  /**
   * Get all posts with optional filtering
   */
  async getAllPosts(options = {}) {
    const { sortBy = 'date', order = 'desc', limit = null, offset = 0 } = options;
    
    await this.scanPosts();
    
    let posts = [...this.postsList];

    // Sort
    if (sortBy === 'date') {
      posts.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }

    // Paginate
    if (limit) {
      posts = posts.slice(offset, offset + limit);
    }

    return posts;
  }

  /**
   * Get post by slug
   */
  async getPostBySlug(slug) {
    await this.scanPosts();
    
    const cacheKey = `post:${slug}`;
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    const post = this.postsList.find(p => p.slug === slug);
    
    if (!post) {
      return null;
    }

    // Read full content
    const fullPost = await this.readPostFile(post.filePath);
    this.cache[cacheKey] = fullPost;

    return fullPost;
  }

  /**
   * Get posts for a category
   */
  async getPostsByCategory(category) {
    const posts = await this.getAllPosts();
    return posts.filter(p => p.categories && p.categories.includes(category));
  }

  /**
   * Get posts for a tag
   */
  async getPostsByTag(tag) {
    const posts = await this.getAllPosts();
    return posts.filter(p => p.tags && p.tags.includes(tag));
  }

  /**
   * Get all categories
   */
  async getCategories() {
    const posts = await this.getAllPosts();
    const categories = new Set();
    
    posts.forEach(post => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach(cat => categories.add(cat));
      }
    });

    return Array.from(categories).sort();
  }

  /**
   * Get all tags
   */
  async getTags() {
    const posts = await this.getAllPosts();
    const tags = new Set();
    
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });

    return Array.from(tags).sort();
  }

  /**
   * Scan posts directory and cache metadata
   */
  async scanPosts() {
    const now = Date.now();
    
    // Use cached list if recently scanned
    if (this.postsList && now - this.lastScanTime < this.scanInterval) {
      return;
    }

    const postsDir = config.paths.postsDir;
    
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
      this.postsList = [];
      this.lastScanTime = now;
      return;
    }

    const files = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();

    this.postsList = [];

    for (const file of files) {
      try {
        const filePath = path.join(postsDir, file);
        const metadata = await this.extractMetadata(filePath);
        this.postsList.push(metadata);
      } catch (error) {
        console.error(`Error scanning post ${file}:`, error);
      }
    }

    this.lastScanTime = now;
  }

  /**
   * Extract metadata from a post file (without full content)
   */
  async extractMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = this.parseFrontmatter(content);

    const slug = frontmatter.slug || this.generateSlugFromFilename(path.basename(filePath));
    const title = frontmatter.title || 'Untitled';
    const date = frontmatter.date ? new Date(frontmatter.date) : new Date(fs.statSync(filePath).birthtimeMs);
    const excerpt = frontmatter.excerpt || this.extractExcerpt(body);

    return {
      slug,
      title,
      date,
      updated: frontmatter.updated ? new Date(frontmatter.updated) : date,
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      cover: frontmatter.cover || config.theme.welcomeCover,
      mp3: frontmatter.mp3 || null,
      autoplay: frontmatter.autoplay || false,
      keywords: frontmatter.keywords || '',
      excerpt,
      filePath,
      filename: path.basename(filePath),
    };
  }

  /**
   * Read full post file and render markdown
   */
  async readPostFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = this.parseFrontmatter(content);

    const slug = frontmatter.slug || this.generateSlugFromFilename(path.basename(filePath));
    const rendered = await markdownService.render(body);

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date ? new Date(frontmatter.date) : new Date(),
      updated: frontmatter.updated ? new Date(frontmatter.updated) : null,
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      cover: frontmatter.cover || config.theme.welcomeCover,
      mp3: frontmatter.mp3 || null,
      autoplay: frontmatter.autoplay || false,
      keywords: frontmatter.keywords || '',
      content: rendered.html,
      toc: rendered.toc,
      excerpt: frontmatter.excerpt || this.extractExcerpt(body),
      filePath,
    };
  }

  /**
   * Parse YAML frontmatter from markdown
   */
  parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    
    if (!match) {
      return {
        frontmatter: {},
        body: content,
      };
    }

    let frontmatter = {};
    try {
      frontmatter = YAML.parse(match[1]) || {};
    } catch (error) {
      console.error('Error parsing frontmatter:', error);
    }

    return {
      frontmatter,
      body: match[2],
    };
  }

  /**
   * Generate slug from filename (e.g., 2024-01-15-my-post.md -> my-post)
   */
  generateSlugFromFilename(filename) {
    // Remove .md extension and date prefix if present
    let slug = filename.replace(/\.md$/, '');
    slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return slug;
  }

  /**
   * Extract excerpt from markdown (first paragraph or 200 chars)
   */
  extractExcerpt(content) {
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    let excerpt = lines.join(' ').substring(0, 200);
    
    // Remove markdown syntax
    excerpt = excerpt
      .replace(/[*_~`\[\]()]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .trim();

    return excerpt + (excerpt.length === 200 ? '...' : '');
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }
}

module.exports = new PostService();
