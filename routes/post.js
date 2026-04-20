const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Single post
router.get('/:slug', postController.getPost);

module.exports = router;
