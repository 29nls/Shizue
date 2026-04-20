const express = require('express');
const searchController = require('../controllers/searchController');

const router = express.Router();

// Search API
router.get('/', searchController.search);
router.get('/index', searchController.getSearchIndex);

module.exports = router;
