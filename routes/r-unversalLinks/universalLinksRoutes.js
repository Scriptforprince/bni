const express = require('express');
const router = express.Router();
const universalController = require('../../controllers/c-universalLink/universalLinksController');

// Region routes
router.get('/manage-universal-links', universalController.manageUniversal);

module.exports = router;
