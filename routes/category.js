const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

// Category page
router.get('/:name', dataController.getCategory);

module.exports = router;
