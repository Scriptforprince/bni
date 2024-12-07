const express = require('express');
const router = express.Router();
const kittyController = require('../../controllers/c-kittyDashboard/kittyDashboardController');

// Events routes
router.get('/manage-kitty', kittyController.manageKitty);

module.exports = router;
