const { mongoose, Schema } = require('mongoose');

const sessionSchema = new Schema({
	startTime: { type: Date, required: true },
	endTime: { type: Date, required: false },
	username: { type: String, required: false, length: { min: 2, max: 10 } },
});

sessionSchema.virtual('totalTime').get(function () {
	if (this.endTime) {
		return this.endTime.getTime() - this.startTime.getTime();
	} else {
		return 9999;
	}
});

module.exports = mongoose.model('session', sessionSchema);
