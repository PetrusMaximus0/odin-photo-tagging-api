const asyncHandler = require('express-async-handler');

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
	const result = await Session.find({ endTime: { $exists: true } });
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
