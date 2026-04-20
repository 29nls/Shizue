const express = require('express');
const dataController = require('../controllers/dataController');

const router = express.Router();

// Archive page
router.get('/', dataController.getArchive);

module.exports = router;
