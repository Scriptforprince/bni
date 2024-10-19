const express = require('express');
const router = express.Router();
const regionController = require('../../controllers/c-region/regionController');

// Region routes
router.get('/manage-region', regionController.manageRegion);
router.get('/add-region', regionController.addRegion);

module.exports = router;
