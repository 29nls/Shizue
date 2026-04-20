const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

// Tag page
router.get('/:name', dataController.getTag);

module.exports = router;
