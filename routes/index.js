const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Homepage
router.get('/', postController.getHome);

module.exports = router;
