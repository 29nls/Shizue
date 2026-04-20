const postService = require('../services/postService');
const metadataService = require('../services/metadataService');
const helpers = require('./helpers');
const config = require('../config');

/**
 * GET /archive - Archive page
 */
exports.getArchive = async (req, res, next) => {
  try {
    const archives = await metadataService.getArchives();

    res.render('archive', {
      config,
      helpers,
      archives,
      pageTitle: helpers.pageTitle({ type: 'archive' }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /category/:name - Category page
 */
exports.getCategory = async (req, res, next) => {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page || '1', 10);
    const postsPerPage = config.pagination.postsPerPage;

    const posts = await postService.getPostsByCategory(name);
    const offset = (page - 1) * postsPerPage;
    const paginatedPosts = posts.slice(offset, offset + postsPerPage);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (posts.length === 0 || (page > totalPages && totalPages > 0)) {
      return res.status(404).render('error', {
        config,
        status: 404,
        message: `Category "${name}" not found`,
      });
    }

    res.render('category', {
      config,
      helpers,
      category: name,
      posts: paginatedPosts,
      currentPage: page,
      totalPages,
      totalPosts: posts.length,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextLink: page < totalPages ? `/category/${name}?page=${page + 1}` : null,
      prevLink: page > 1 ? `/category/${name}?page=${page - 1}` : null,
      pageTitle: helpers.pageTitle({ type: 'category', name }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tag/:name - Tag page
 */
exports.getTag = async (req, res, next) => {
  try {
    const { name } = req.params;
    const page = parseInt(req.query.page || '1', 10);
    const postsPerPage = config.pagination.postsPerPage;

    const posts = await postService.getPostsByTag(name);
    const offset = (page - 1) * postsPerPage;
    const paginatedPosts = posts.slice(offset, offset + postsPerPage);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    if (posts.length === 0 || (page > totalPages && totalPages > 0)) {
      return res.status(404).render('error', {
        config,
        status: 404,
        message: `Tag "${name}" not found`,
      });
    }

    res.render('tag', {
      config,
      helpers,
      tag: name,
      posts: paginatedPosts,
      currentPage: page,
      totalPages,
      totalPosts: posts.length,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      nextLink: page < totalPages ? `/tag/${name}?page=${page + 1}` : null,
      prevLink: page > 1 ? `/tag/${name}?page=${page - 1}` : null,
      pageTitle: helpers.pageTitle({ type: 'tag', name }),
    });
  } catch (error) {
    next(error);
  }
};
