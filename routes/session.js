const express = require('express');
const router = express.Router();

//
const sessionController = require('../controllers/session');

//
router.get('/', sessionController.sessions);

//
router.post('/start-game', sessionController.startGame);

//
router.put('/end-game', sessionController.endGame);

module.exports = router;
