//storyRoutes.js
const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.post('/create', storyController.createStoryImages);
router.get('/test', storyController.test);

module.exports = router;