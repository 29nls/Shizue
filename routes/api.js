const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

// API routes
router.get('/posts/:slug', apiController.getPostPartial);
router.get('/posts', apiController.listPostsJson);
router.get('/meta', apiController.getMeta);

module.exports = router;
