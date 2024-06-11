const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game.js');

/* Verify the user clicked the correct character */
router.post('/verifyClick', gameController.verifyClick);

module.exports = router;
