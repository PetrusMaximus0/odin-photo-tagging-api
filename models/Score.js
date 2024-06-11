const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
	username: { type: String, required: true },
	totalTime: { type: number, required: true },
	lastGame: { type: boolean, required: true },
});

module.exports = mongoose.model('score', scoreSchema);
