const postService = require('../services/postService');
const config = require('../config');

/**
 * GET /api/posts/:slug - Get post partial for AJAX loading
 */
exports.getPostPartial = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(slug);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Return just the post content HTML (for AJAX/preview)
    res.render('partials/post/article', {
      layout: false,
      post,
      config,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/posts - Get all posts as JSON
 */
exports.listPostsJson = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();

    const postsData = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      updated: post.updated,
      categories: post.categories,
      tags: post.tags,
      excerpt: post.excerpt,
      url: `/post/${post.slug}`,
    }));

    res.json({
      posts: postsData,
      total: postsData.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/meta - Get metadata (categories, tags, archives)
 */
exports.getMeta = async (req, res, next) => {
  try {
    const metadataService = require('../services/metadataService');
    
    const [categories, tags, archives] = await Promise.all([
      metadataService.getCategories(),
      metadataService.getTags(),
      metadataService.getArchives(),
    ]);

    res.json({
      categories,
      tags,
      archives,
    });
  } catch (error) {
    next(error);
  }
};
