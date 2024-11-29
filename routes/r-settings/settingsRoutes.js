const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/c-settings/settingsController');

// Region routes
router.get('/my-profile', settingsController.myProfile);
router.get('/settings', settingsController.settings);


module.exports = router;
