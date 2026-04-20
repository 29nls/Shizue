const postService = require('../services/postService');
const metadataService = require('../services/metadataService');
const helpers = require('./helpers');
const config = require('../config');

/**
 * GET / - Homepage with post list
 */
exports.getHome = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const postsPerPage = config.pagination.postsPerPage;
    const offset = (page - 1) * postsPerPage;
    const modernMode = req.query.modern === '1' || config.theme.modernHomepage === true;

    // Get paginated posts
    const posts = await postService.getAllPosts({
      sortBy: 'date',
      order: 'desc',
      limit: postsPerPage,
      offset,
    });

    // Get all posts for modern homepage
    const allPosts = await postService.getAllPosts();
    
    // Get categories
    const categories = await postService.getCategories();

    // Get total count for pagination
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    if (page > totalPages && totalPages > 0) {
      return res.status(404).render('error', {
        config,
        status: 404,
        message: 'Page not found',
      });
    }

    const templateName = modernMode ? 'index-modern' : 'index';

    res.render(templateName, {
      config,
      helpers,
      posts: modernMode ? allPosts : posts,
      categories: modernMode ? categories : undefined,
      currentPage: modernMode ? undefined : page,
      totalPages: modernMode ? undefined : totalPages,
      totalPosts: modernMode ? undefined : totalPosts,
      hasNext: modernMode ? undefined : (page < totalPages),
      hasPrev: modernMode ? undefined : (page > 1),
      nextPage: modernMode ? undefined : (page + 1),
      prevPage: modernMode ? undefined : (page - 1),
      nextLink: modernMode ? undefined : (page < totalPages ? `/?page=${page + 1}` : null),
      prevLink: modernMode ? undefined : (page > 1 ? `/?page=${page - 1}` : null),
      pageTitle: helpers.pageTitle({ type: 'index' }),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /post/:slug - Single post page
 */
exports.getPost = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug);

    if (!post) {
      return res.status(404).render('error', {
        config,
        status: 404,
        message: 'Post not found',
      });
    }

    // Get all posts for navigation
    const allPosts = await postService.getAllPosts();
    const currentIndex = allPosts.findIndex(p => p.slug === slug);

    const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
    const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

    // Get related posts
    const relatedPosts = helpers.getRelatedPosts(post, allPosts, 5);

    res.render('post', {
      config,
      helpers,
      post,
      prevPost,
      nextPost,
      relatedPosts,
      pageTitle: helpers.pageTitle({ type: 'post', title: post.title }),
    });
  } catch (error) {
    next(error);
  }
};
