const postService = require('../services/postService');
const helpers = require('./helpers');
const config = require('../config');

/**
 * GET /search - Search API
 */
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ results: [] });
    }

    const query = q.toLowerCase();
    const posts = await postService.getAllPosts();

    const results = posts
      .filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt.toLowerCase().includes(query);
        const tagsMatch = post.tags.some(tag => tag.toLowerCase().includes(query));
        const categoriesMatch = post.categories.some(cat => cat.toLowerCase().includes(query));

        return titleMatch || excerptMatch || tagsMatch || categoriesMatch;
      })
      .map(post => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: post.date,
        tags: post.tags,
        url: `/post/${post.slug}`,
      }));

    res.json({
      query,
      results,
      total: results.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /search-index - Generate search index for client-side search
 */
exports.getSearchIndex = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();

    const index = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.excerpt, // Use excerpt for search
      date: post.date,
      tags: post.tags,
      categories: post.categories,
      url: `/post/${post.slug}`,
    }));

    res.json({ index });
  } catch (error) {
    next(error);
  }
};
