const express = require('express');
const router = express.Router();

//
const sessionController = require('../controllers/session');

//
router.get('/', sessionController.sessions);

//
router.post('/start', sessionController.startGame);

//
router.post('/close', sessionController.endGame);

//
router.put('/save-user', sessionController.saveUser);

module.exports = router;
