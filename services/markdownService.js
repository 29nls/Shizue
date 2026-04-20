const MarkdownIt = require('markdown-it');
const markdownItMathjax3 = require('markdown-it-mathjax3');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');
const config = require('../config');

class MarkdownService {
  constructor() {
    this.md = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      breaks: false,
    });

    // Add plugins
    if (config.features.mathjax) {
      this.md.use(markdownItMathjax3);
    }

    this.md.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink(),
      slugify: this.slugify,
    });

    this.md.use(markdownItTocDoneRight, {
      slugify: this.slugify,
    });
  }

  /**
   * Render markdown to HTML
   */
  async render(markdown) {
    try {
      const html = this.md.render(markdown);
      
      // Extract TOC if available
      const toc = this.extractToc(markdown);

      return {
        html,
        toc,
      };
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return {
        html: `<p>Error rendering content: ${error.message}</p>`,
        toc: [],
      };
    }
  }

  /**
   * Extract table of contents from markdown
   */
  extractToc(markdown) {
    const lines = markdown.split('\n');
    const toc = [];

    for (const line of lines) {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2];
        const id = this.slugify(title);

        toc.push({
          level,
          title,
          id,
        });
      }
    }

    return toc;
  }

  /**
   * Simple slugify function (compatible with markdown-it-anchor)
   */
  slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

module.exports = new MarkdownService();
