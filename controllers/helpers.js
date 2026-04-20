const moment = require('moment');
const config = require('../config');

/**
 * Normalize URL paths
 */
const urlFor = (path = '/', root = config.site.root) => {
  if (!path) return root;
  if (path.startsWith('http')) return path; // Absolute URL
  if (path.startsWith('/')) return root.replace(/\/$/, '') + path;
  return root.replace(/\/$/, '') + '/' + path;
};

/**
 * Generate page title
 */
const pageTitle = (page) => {
  const siteName = config.site.title;

  if (!page || !page.title) {
    return siteName;
  }

  if (page.type === 'index') {
    return siteName;
  }

  if (page.type === 'archive') {
    return `Archive - ${siteName}`;
  }

  if (page.type === 'category') {
    return `Category: ${page.name} - ${siteName}`;
  }

  if (page.type === 'tag') {
    return `Tag: ${page.name} - ${siteName}`;
  }

  return `${page.title} - ${siteName}`;
};

/**
 * Truncate HTML content
 */
const truncate = (html, length = 200, suffix = '...') => {
  const plain = stripHtml(html);
  if (plain.length <= length) return plain;
  return plain.substring(0, length) + suffix;
};

/**
 * Strip HTML tags
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
};

/**
 * Format date
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '';
  return moment(date).format(format);
};

/**
 * Get related posts (posts with common tags)
 */
const getRelatedPosts = (post, allPosts, limit = 5) => {
  if (!post.tags || post.tags.length === 0) {
    return allPosts.filter(p => p.slug !== post.slug).slice(0, limit);
  }

  const related = allPosts
    .filter(p => p.slug !== post.slug)
    .map(p => {
      const commonTags = p.tags.filter(t => post.tags.includes(t)).length;
      return { ...p, score: commonTags };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(p => {
      const { score, ...rest } = p;
      return rest;
    });

  return related;
};

/**
 * Humanize time difference (e.g., "2 hours ago")
 */
const timeAgo = (date) => {
  if (!date) return '';
  return moment(date).fromNow();
};

/**
 * Get first N words from text
 */
const words = (text, count = 50) => {
  if (!text) return '';
  const wordArray = text.split(/\s+/);
  return wordArray.slice(0, count).join(' ') + (wordArray.length > count ? '...' : '');
};

/**
 * Escape HTML special characters
 */
const escape = (str) => {
  if (!str) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, m => map[m]);
};

module.exports = {
  urlFor,
  pageTitle,
  truncate,
  stripHtml,
  formatDate,
  getRelatedPosts,
  timeAgo,
  words,
  escape,
};
