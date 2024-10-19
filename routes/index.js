const express = require('express');
const router = express.Router();

// Import all routes
const indexRoutes = require('./r-home/indexRoutes');
const memberRoutes = require('./r-member/memberRoutes');
const regionRoutes = require('./r-region/regionRoutes');
const chapterRoutes = require('./r-chapter/chapterRoutes');
const dashboardRoutes = require('./r-dashboard/dashboardRoutes');

// Use all the imported routes
router.use('/', indexRoutes);
router.use('/d', dashboardRoutes);
router.use('/m', memberRoutes);
router.use('/r', regionRoutes);
router.use('/c', chapterRoutes);

module.exports = router;
