const express = require('express');
const lessonController = require('../controllers/lessonsController');
const router = express.Router();

router.get('/', lessonController.getLessons_get);
router.get('/lessons', lessonController.createLesson_get);
router.post('/', lessonController.getLessons_post);
router.post('/lessons', lessonController.createLesson_post);

module.exports = router;
