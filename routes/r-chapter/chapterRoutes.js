const express = require('express');
const router = express.Router();
const chapterController = require('../../controllers/c-chapter/chapterController');

// Chapter routes
router.get('/manage-chapter', chapterController.manageChapter);
router.get('/add-chapter', chapterController.addChapter);

module.exports = router;
