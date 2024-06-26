const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
	username: { type: String, required: false },
	totalTime: { type: Number, required: true },
	lastGame: { type: Boolean, required: true },
});

module.exports = mongoose.model('score', scoreSchema);
