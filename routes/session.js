const express = require('express');
const router = express.Router();

//
const sessionController = require('../controllers/session');

//
router.get('/', sessionController.sessions);

//
router.post('/start', sessionController.startGame);

//
router.delete('/cancel', sessionController.cancelGame);

//
router.post('/close', sessionController.endGame);

module.exports = router;
