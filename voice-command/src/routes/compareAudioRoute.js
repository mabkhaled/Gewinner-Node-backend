const express = require('express');
const router = express.Router();
const compareAudioController = require('../controllers/compareAudioController');

router.post('/', compareAudioController.compare);

module.exports = router;
