const mongoose = require('mongoose');

async function initializeMongoServer() {
	//
	const mongoUri = process.env.MONGODB_URI;
	if(!mongoUri) {
		throw new Error('Mongo URI is missing');
	}
	mongoose.connect(mongoUri);
	mongoose.connection.on('error', (e) => {
		if (e.message.code === 'ETIMEDOUT') {
			console.log(e);
			mongoose.connect(mongoUri);
		}
		console.log(e);
		console.log("tried URI:", mongoUri);
	});

	mongoose.connection.once('open', () => {
		console.log('MongoDB Successfully connected to ', mongoUri);
	});
}

module.exports = initializeMongoServer;
