const mongoose = require('mongoose');

async function initializeMongoServer() {
	//
	mongoose.connect(process.env.MONGODB_URI);
	mongoose.connection.on('error', (e) => {
		if (e.message.code === 'ETIMEDOUT') {
			console.log(e);
			mongoose.connect(mongoUri);
		}
		console.log(e);
	});

	mongoose.connection.once('open', () => {
		console.log('MongoDB Successfully connected to ', mongoUri);
	});
}

module.exports = initializeMongoServer;
