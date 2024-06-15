const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');

const solutions = {
	yeldo: { x: 0.07, y: 0.69, discovered: false },
	waldo: { x: 0.405, y: 0.625, discovered: false },
	wizzard: { x: 0.78, y: 0.585, discovered: false },
};

const isCharacter = (character, markerRelativePosition, solutions) => {
	const maxDistance = 0.01;

	const distanceX = Math.abs(
		markerRelativePosition.x - solutions[`${character}`].x
	);
	const distanceY = Math.abs(
		markerRelativePosition.y - solutions[`${character}`].y
	);
	const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

	return distance <= maxDistance;
};

exports.verifyClick = asyncHandler((req, res) => {
	//
	if (
		!req.body.character ||
		!req.body.coordinates.x ||
		!req.body.coordinates.y
	) {
		res.sendStatus(400);
	}

	// Fetch the solutions from the database
	const fetchedSolutions = { ...solutions };
	const result = isCharacter(
		req.body.character,
		req.body.coordinates,
		fetchedSolutions
	);

	if (result === true) {
		//
		const solutionCoordinates = {
			x: solutions[`${req.body.character}`].x,
			y: solutions[`${req.body.character}`].y,
		};

		//
		solutions[`${req.body.character}`].discovered = true;

		//
		const response = {
			character: req.body.character,
			solution: solutionCoordinates,
			result: result,
		};
		res.status(200).send(response);
	} else {
		res.status(200).send({ result: false });
	}
});

exports.rankings = asyncHandler(async (req, res) => {
	const result = await Score.find({}).exec();
	if (!result) {
		res.sendStatus(404);
	}

	if (result.length > 1) {
		result.sort((a, b) => {
			return a.totalTime - b.totalTime;
		});
	}

	res.send({ rankings: result });
});

exports.saveUser = [
	//
	body('id').trim().isLength({ min: 1 }).escape(),
	body('username').trim().isLength({ min: 1, max: 10 }).escape(),

	//
	asyncHandler(async (req, res) => {
		// Validate and sanitize the inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).send({ username: req.body.username, error: errors });
		}

		// Check if the username is in use. If it is, compare the two scores and save the better score.
		const oldScore = await Score.findOne({ username: req.body.username });

		if (!oldScore) {
			// There is no old score with this username, add the username to the pre-created anonymous score.
			const score = await Score.findByIdAndUpdate(req.body.id, {
				username: req.body.username,
			});

			//
			score === null ? res.sendStatus(404) : res.status(201).send(score);
		} else {
			// A score document was found with the chosen username.
			const score = await Score.findById(req.body.id);
			if (score === null) {
				res.sendStatus(404);
			}
			// Compare the old score with the new one
			if (score.totalTime < oldScore.totalTime) {
				// Delete the old score and save the username to the new score.
				score.username = req.body.username;
				const [savedScore, deletedScore] = await Promise.all([
					score.save(),
					Score.findByIdAndDelete(oldScore._id),
				]);

				//
				savedScore === null || deletedScore === null
					? res.sendStatus(500)
					: res.sendStatus(201);
			} else {
				// The new score's total time is higher than the old score. Delete the new score and keep the old one.
				const deletedScore = await Score.findByIdAndDelete(req.body.id);

				deletedScore === null ? res.sendStatus(404) : res.sendStatus(200);
			}
		}
	}),
];
