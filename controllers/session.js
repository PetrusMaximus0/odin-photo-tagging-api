// Models
const Session = require('../models/Session');
const Score = require('../models/Score');

//
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.sessions = asyncHandler(async (req, res) => {
	const result = await Session.find({});

	if (result === null) {
		res.sendStatus(404);
	} else {
		res.send({ sessions: result });
	}
});

exports.startGame = asyncHandler(async (req, res) => {
	// Assume this is a new session
	const newSession = new Session({
		startTime: new Date(),
	});
	await newSession.save();
	res.status(200).send(newSession);
});

const storeResult = async (req, totalTime) => {
	// Create the new score document
	const newScore = new Score({
		username: req.body.username || 'Anonymous',
		totalTime: totalTime,
		lastGame: false,
	});

	// Save the score document and delete the current session
	const [savedScore, deletedSession] = await Promises([
		newScore.save(),
		Session.findByIdAndDelete(req.body.id),
	]);

	// if saving the score or session deletion failed send an error status
	if (!savedScore || !deletedSession) {
		res.sendStatus(500);
	}
};

exports.endGame = [
	// Validate input
	body('username').trim().isLength({ max: 10 }).escape(),
	body('id').trim().isLength({ min: 1 }).escape(),

	// Handle the route
	asyncHandler(async (req, res) => {
		// Store the end time before the awaits so that the end time does not depend on how fast the queries happen.
		const endTime = new Date();

		// Validate the request
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).send({ errors: errors.array() });
		}

		// Retrieve the current session
		const session = await Session.findById(req.body.id);
		if (!session) res.sendStatus(404);

		// Calculate the total time
		const totalTime = endTime.getTime() - Date(session.startTime).getTime();

		//
		const scores = await Score.find({}).sort({ totalTime: 1 });

		//
		if (scores.length < 10) {
			// We have less than 10 scores, store the score on the board.
			storeResult(req, totalTime);

			//
			res.sendStatus(201);
		} else if (totalTime < scores[9].totalTime) {
			// This session score is in the top 10
			storeResult(req, totalTime);

			// Delete the last score from the board
			const deleteLastScore = await Score.findByIdAndDelete(scores[9]._id);
			if (!deleteLastScore) res.sendStatus(500);

			res.sendStatus(201);
		} else {
			// This session score is NOT in the top 10, store as last game's result.
			const updatedScore = await Score.findOneAndUpdate(
				{
					lastGame: true,
				},
				{
					username: req.body.username || 'Anonymous',
					totalTime: totalTime,
					lastGame: true,
				}
			);
			if (!updatedScore) res.sendStatus(500);

			res.sendStatus(201);
		}
	}),
];
