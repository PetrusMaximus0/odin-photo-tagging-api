const express = require('express');
const router = express.Router();

const gameController = require('../controllers/game.js');

/* Verify the user clicked the correct character */
router.post('/verifyClick', gameController.verifyClick);

//
router.get('/rankings', gameController.rankings);

//
router.put('/save-user-score', gameController.saveUser);

module.exports = router;
