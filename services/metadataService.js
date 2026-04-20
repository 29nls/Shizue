const postService = require('./postService');

class MetadataService {
  constructor() {
    this.cache = {
      categories: null,
      tags: null,
      archives: null,
    };
    this.lastUpdateTime = 0;
    this.updateInterval = 30000; // 30 seconds
  }

  /**
   * Get all categories with post counts
   */
  async getCategories() {
    if (this.cache.categories && Date.now() - this.lastUpdateTime < this.updateInterval) {
      return this.cache.categories;
    }

    const posts = await postService.getAllPosts();
    const categoryMap = new Map();

    posts.forEach(post => {
      if (post.categories && Array.isArray(post.categories)) {
        post.categories.forEach(cat => {
          if (!categoryMap.has(cat)) {
            categoryMap.set(cat, 0);
          }
          categoryMap.set(cat, categoryMap.get(cat) + 1);
        });
      }
    });

    const categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.cache.categories = categories;
    this.lastUpdateTime = Date.now();

    return categories;
  }

  /**
   * Get all tags with post counts
   */
  async getTags() {
    if (this.cache.tags && Date.now() - this.lastUpdateTime < this.updateInterval) {
      return this.cache.tags;
    }

    const posts = await postService.getAllPosts();
    const tagMap = new Map();

    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, 0);
          }
          tagMap.set(tag, tagMap.get(tag) + 1);
        });
      }
    });

    const tags = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.cache.tags = tags;
    this.lastUpdateTime = Date.now();

    return tags;
  }

  /**
   * Get archives grouped by year and month
   */
  async getArchives() {
    if (this.cache.archives && Date.now() - this.lastUpdateTime < this.updateInterval) {
      return this.cache.archives;
    }

    const posts = await postService.getAllPosts();
    const archiveMap = new Map();

    posts.forEach(post => {
      const year = post.date.getFullYear();
      const month = String(post.date.getMonth() + 1).padStart(2, '0');
      const key = `${year}-${month}`;

      if (!archiveMap.has(key)) {
        archiveMap.set(key, {
          year,
          month,
          posts: [],
        });
      }

      archiveMap.get(key).posts.push({
        title: post.title,
        slug: post.slug,
        date: post.date,
      });
    });

    const archives = Array.from(archiveMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });

    this.cache.archives = archives;
    this.lastUpdateTime = Date.now();

    return archives;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {
      categories: null,
      tags: null,
      archives: null,
    };
  }
}

module.exports = new MetadataService();
